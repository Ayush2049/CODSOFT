const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const quizRoutes = require("./routes/quiz");
const authRoutes = require("./routes/authRoutes"); // Correct import for auth routes

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public")); // Ensure the public folder is served
// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/quiz")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema and Model for Scores
const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
});

const Score = mongoose.model("Score", scoreSchema);

// Routes
app.use("/api/quiz", quizRoutes); // Quiz-related routes
app.use("/api/auth", authRoutes); // Authentication routes

// POST: Save scores
app.post("/api/scores", async (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== "number") {
    return res
      .status(400)
      .json({ message: "Invalid input. Username and score are required." });
  }

  try {
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved successfully", newScore });
  } catch (error) {
    console.error("Error saving score:", error);
    res
      .status(500)
      .json({ message: "Failed to save score. Please try again later." });
  }
});

// GET: Retrieve scores
app.get("/api/scores", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res
      .status(500)
      .json({ message: "Failed to load scores. Please try again later." });
  }
});

// Run cleanup function conditionally
async function cleanUpScores() {
  try {
    const result = await Score.deleteMany({
      $or: [{ username: { $exists: false } }, { score: { $exists: false } }],
    });
    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} incomplete entries.`);
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Call cleanup on startup
cleanUpScores();

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle SIGINT for graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
