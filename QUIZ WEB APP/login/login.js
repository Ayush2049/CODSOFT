/// Ensure this script is included at the end of your HTML body or wrapped in DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  // Get buttons for signup and login
  const signupButton = document.getElementById("signup-btn");
  const loginButton = document.getElementById("login-btn");

  // Utility function to display errors
  const showError = (message) => {
    console.error(message);
    alert(message); // Provide feedback to the user
  };

  signupButton?.addEventListener("click", async (event) => {
    event.preventDefault();

    const username = document.getElementById("logname-signup")?.value.trim();
    const email = document.getElementById("logemail-signup")?.value.trim();
    const password = document.getElementById("logpass-signup")?.value.trim();

    if (!username || !email || !password) {
      return showError("Please fill in all fields for signup.");
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      console.log("Signup Response:", data);

      if (response.ok) {
        alert("Signup successful! Please login.");
      } else {
        // Display specific error messages from the server response
        if (data.errors) {
          const errorMessages = data.errors
            .map((error) => error.msg)
            .join(", ");
          showError(`Signup failed: ${errorMessages}`);
        } else {
          showError(data.message || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Signup Error:", error);
      showError("An error occurred during signup. Please try again.");
    }
  });

  // Validate and handle login form submission
  loginButton?.addEventListener("click", async (event) => {
    event.preventDefault();

    // Get input values
    const username = document.getElementById("logname-login")?.value.trim();
    const password = document.getElementById("logpass-login")?.value.trim();

    if (!username || !password) {
      return showError("Please fill in both username and password for login.");
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        alert("Login successful!");

        // Store the token in localStorage
        localStorage.setItem("token", data.token);

        // Verify if token is stored
        const storedToken = localStorage.getItem("token");
        console.log("Stored Token:", storedToken);

        alert("Login successful!");
        window.location.href = "../index.html"; // Redirect to homepage or dashboard
      } else {
        showError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      showError("An error occurred during login. Please try again.");
    }
  });
});
