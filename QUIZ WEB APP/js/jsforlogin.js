window.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");

  // Check if the user is logged in based on the token
  const token = localStorage.getItem("token");
  console.log("Token on page load:", token);

  if (token) {
    console.log("User is logged in. Showing logout button.");
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
  } else {
    console.log("User is not logged in. Showing login button.");
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("logout-btn").style.display = "none";
  }

  // Handle login button click
  loginButton.addEventListener("click", () => {
    window.location.href = "login/login.html"; // Redirect to login page
  });

  // Handle logout button click
  logoutButton.addEventListener("click", () => {
    console.log("Logging out...");
    localStorage.removeItem("token"); // Remove token from localStorage
    window.location.href = "index.html"; // Redirect back to index.html
  });
});
