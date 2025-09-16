window.addEventListener("DOMContentLoaded", (event) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You need to log in before entering.");
    window.location.href = "/login"; // Redirect to the login page if not logged in
  } else {
    // If you want to validate the token with the server, you should make an API request here
    console.log("User is logged in with token:", token);
  }
});

// quiz.js
document.addEventListener("DOMContentLoaded", () => {
  setCategoryInDropdown(); // Set the category when the page loads
});

const setCategoryInDropdown = () => {
  const selectedCategory = localStorage.getItem("category"); // Get the selected category from localStorage
  const categoryDropdown = document.querySelector("#category"); // Get the dropdown element

  // Ensure categoryDropdown exists before setting its value and adding the event listener
  if (categoryDropdown) {
    if (selectedCategory) {
      categoryDropdown.value = selectedCategory; // Set the dropdown to the selected category
    }

    // Save the selected category when dropdown changes
    categoryDropdown.addEventListener("change", () => {
      localStorage.setItem("category", categoryDropdown.value);
    });
  }
};

const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  const percentage = (value / time) * 100; // Ensure 'time' is defined before this line
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

const startQuiz = () => {
  const num = numQuestions ? numQuestions.value : 10; // Default to 10 if numQuestions is not found
  const selectedCategory = localStorage.getItem("category"); // Retrieve the selected category from localStorage
  const diff = difficulty ? difficulty.value : "medium"; // Default to "medium" if difficulty is not found

  // Check if a category was selected
  if (!selectedCategory) {
    alert("No category selected. Please go back to the home page.");
    return;
  }

  if (startBtn) loadingAnimation(); // Start loading animation only if startBtn exists

  // Use the selected category to fetch questions
  let url;

  if (selectedCategory === "UPSC") {
    // Path to the UPSC questions JSON file
    url = "./js/upsc_questions.json";
  } else {
    // Fetch questions from the API for other categories
    url = `https://opentdb.com/api.php?amount=${num}&category=${selectedCategory}&difficulty=${diff}&type=multiple`;
  }

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      // Parse data depending on the source
      if (selectedCategory === "UPSC") {
        questions = data; // For UPSC, the JSON is already in the expected format
      } else {
        questions = data.results; // For API data
      }

      // Stop loading animation here
      if (startBtn) startBtn.innerHTML = "Start Quiz"; // Reset the button text

      // Check if questions were found
      if (questions.length === 0) {
        alert("No questions found for the selected category and difficulty.");
        return;
      }

      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      if (startBtn) startBtn.innerHTML = "Start Quiz"; // Reset button text if startBtn exists
      alert("Failed to load questions. Please try again later.");
    });
};

// Event listener for starting the quiz (only if startBtn exists)
if (startBtn) {
  startBtn.addEventListener("click", startQuiz);
}

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  const questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>
    `;
  });

  questionNumber.innerHTML = `Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
    <span class="total">/${questions.length}</span>`;

  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((ans) => ans.classList.remove("selected"));
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  time = timePerQuestion.value; // Set time based on input
  startTimer(time); // Start the timer
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAudio("assets/countdown.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};

const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);

  return loadingInterval;
};

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML = "Quiz Mania";
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    checkAnswer();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
  });
}

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      highlightCorrectAnswer();
    }
  } else {
    highlightCorrectAnswer();
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => answer.classList.add("checked"));

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const highlightCorrectAnswer = () => {
  const correctAnswer = questions[currentQuestion - 1].correct_answer;
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    if (answer.querySelector(".text").innerHTML === correctAnswer) {
      answer.classList.add("correct");
    }
  });
};

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = async () => {
  // Validate `score` and `questions.length` before saving
  if (typeof score === "undefined" || questions.length === 0) {
    console.error("Score or questions length is undefined.");
    return;
  }

  // Save score and total questions in localStorage
  localStorage.setItem("finalScore", score);
  localStorage.setItem("totalQuestions", questions.length);

  console.log("Final Score:", localStorage.getItem("finalScore")); // Logs score
  console.log("Total Questions:", localStorage.getItem("totalQuestions")); // Logs total questions

  // Prompt for username
  const username = prompt("Enter your name to save your score:");

  if (username) {
    // Save the user's name to localStorage
    localStorage.setItem("userName", username);

    // Send data to the backend
    try {
      const response = await fetch("http://localhost:5000/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          score: score,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score.");
      }

      console.log("Score saved successfully.");
      // Redirect to results page after successful submission
      window.location.href = "results.html";
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Could not save your score. Please try again later.");
    }
  } else {
    alert("You must enter a name to save your score.");
  }
};
