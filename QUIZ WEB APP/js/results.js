document.addEventListener("DOMContentLoaded", () => {
  // Retrieve stored values from localStorage
  const finalScore = parseInt(localStorage.getItem("finalScore"), 10) || 0;

  // Retrieve totalQuestions from localStorage or set it to a default value
  const totalQuestions = parseInt(localStorage.getItem("totalQuestions"), 10);

  // If totalQuestions is undefined or not set, you could default it to 5 or any other number
  // This ensures we keep the correct value if previously set, else it defaults to 5
  if (!totalQuestions || isNaN(totalQuestions)) {
    // Set default to 5 (or another number you prefer)
    localStorage.setItem("totalQuestions", 5);
  }

  // If localStorage has a valid value for totalQuestions, use that
  const totalQuestionsValue = parseInt(
    localStorage.getItem("totalQuestions"),
    10
  );

  const userName = localStorage.getItem("userName") || "Guest"; // Use stored name or default to "Guest"

  // Retrieve and update cumulative score
  let cumulativeScore =
    parseInt(localStorage.getItem("cumulativeScore"), 10) || 0;
  cumulativeScore += finalScore; // Add the current round score to the cumulative score
  localStorage.setItem("cumulativeScore", cumulativeScore); // Update in localStorage

  // Log the values to ensure they're being retrieved correctly
  console.log("finalScore:", finalScore);
  console.log("totalQuestions:", totalQuestionsValue);
  console.log("userName:", userName);
  console.log("cumulativeScore:", cumulativeScore);

  // Correctly select the HTML elements to update them
  const finalScoreElement = document.querySelector(".final-score");
  const totalScoreElement = document.querySelector(".total-score");
  const cumulativeScoreElement = document.querySelector(".cumulative-score");
  const userNameElement = document.querySelector(".user-name");

  // Update the values for the score and total questions
  finalScoreElement.innerText = `${finalScore} / ${totalQuestionsValue}`;
  totalScoreElement.innerText = totalQuestionsValue;
  cumulativeScoreElement.innerText = cumulativeScore;
  userNameElement.innerText = userName;

  // Update the result summary with additional text labels
  const resultSummary = document.querySelector(".score-summary-container");
  resultSummary.innerHTML = `
    <h2>Congratulations, ${userName}!</h2>
    <p>Your score this round: <span class="final-score">${finalScore} / ${totalQuestionsValue}</span></p>
    <p>Your cumulative score: <span class="cumulative-score">${cumulativeScore}</span></p>
    <p>Total questions this round: <span class="total-score">${totalQuestionsValue}</span></p>
  `;

  // Initialize Lottie animation
  lottie.loadAnimation({
    container: document.getElementById("resultAnimation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "animated/animation.json", // Ensure the path is correct
  });

  // Show the bird animation when the score is calculated
  showBirdAnimation();

  // Determine feedback message based on the score
  const feedbackMessage = document.getElementById("feedbackMessage");
  if (totalQuestionsValue > 0) {
    const scorePercentage = finalScore / totalQuestionsValue;
    if (scorePercentage >= 0.8) {
      feedbackMessage.innerText = `Excellent job, ${userName}!`;
    } else if (scorePercentage >= 0.5) {
      feedbackMessage.innerText = `Good effort, ${userName}!`;
    } else {
      feedbackMessage.innerText = `Better luck next time, ${userName}!`;
    }
  } else {
    feedbackMessage.innerText = "No questions attempted.";
  }

  // Show the feedback message with slide and fade animation
  feedbackMessage.classList.add("show");
});

// Function to show the bird animation below the quiz results
function showBirdAnimation() {
  const animationWrapper = document.getElementById("resultAnimationWrapper");

  // Reset any previous animation by removing the class if present
  animationWrapper.classList.remove("bird-move-animation");

  // Trigger reflow to reapply animation
  void animationWrapper.offsetWidth;

  // Add the animation class to make the bird move across the screen
  animationWrapper.classList.add("bird-move-animation");
}
