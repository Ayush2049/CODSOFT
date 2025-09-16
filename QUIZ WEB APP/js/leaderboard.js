// Function to display the leaderboard
async function displayLeaderboard() {
  try {
    const response = await fetch("http://localhost:5000/api/scores");
    const scores = await response.json();
    const leaderboardContainer = document.getElementById("leaderboard");

    // Clear existing leaderboard entries
    leaderboardContainer.innerHTML = ""; // Clear existing entries

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);

    // Loop through each score and display it
    scores.forEach((score, index) => {
      const scoreElement = document.createElement("div");
      scoreElement.classList.add("leaderboard-entry");

      // Create elements for username, medal, and score
      const usernameElement = document.createElement("span");
      usernameElement.textContent = score.username;

      const scoreDisplayElement = document.createElement("span");
      scoreDisplayElement.classList.add("leaderboard-score");
      scoreDisplayElement.textContent = score.score;

      // Add medal based on ranking
      const medalElement = document.createElement("span");
      medalElement.classList.add("medal");
      if (index === 0) {
        medalElement.textContent = "🏅"; // Gold medal
      } else if (index === 1) {
        medalElement.textContent = "🥈"; // Silver medal
      } else if (index === 2) {
        medalElement.textContent = "🥉"; // Bronze medal
      }

      // Append elements in the correct grid order
      scoreElement.appendChild(usernameElement); // First column
      scoreElement.appendChild(medalElement); // Center column for medal
      scoreElement.appendChild(scoreDisplayElement); // Last column

      // Add the score entry to the leaderboard container
      leaderboardContainer.appendChild(scoreElement);
    });
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

// Call displayLeaderboard() on page load to show current scores
document.addEventListener("DOMContentLoaded", () => {
  displayLeaderboard();
});
