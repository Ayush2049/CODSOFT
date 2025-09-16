const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator"); // Ensure this import is here
const User = require("../serv/models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ayush9691"; // Use .env for security

// Signup route
router.post(
  "/signup",
  [
    check("username", "Username is required").notEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create a new user instance
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });

      // Save the user to the database
      await user.save();
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      console.error("Error during user registration:", err);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      username: user.username,
      score: user.score,
      cumulativeScore: user.cumulativeScore,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
