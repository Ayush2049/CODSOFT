/ Run cleanup function conditionally
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
