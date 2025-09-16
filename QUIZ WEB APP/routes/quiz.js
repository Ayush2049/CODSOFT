// routes/quiz.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth"); // Import the middleware

// Define the /quiz route with authentication
router.get("/quiz", authenticateToken, (req, res) => {
  try {
    res.json({
      message: "Welcome to the quiz!",
      user: req.user, // The authenticated user data from the token
    });
  } catch (error) {
    console.error("Error in /quiz route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
