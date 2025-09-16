// Redirect functions
function redirectToUserLogin() {
  window.location.href = "/frontend/views/login.html";
}

function redirectToRegister() {
  alert("Please register yourself first to access this feature");
  window.location.href = "/frontend/views/register.html";
}

function redirectToHelp() {
  // Open the chatbot interface directly
  if (typeof CXGenieWidget !== 'undefined') {
    // If widget is loaded, open it directly
    CXGenieWidget.open();
  }
}

// Testimonial slider
let currentIndex = 0;

function showTestimonial(index) {
  const testimonials = document.querySelectorAll(".testimonial-card");
  testimonials.forEach((card, i) => {
    card.style.display = i === index ? "flex" : "none";
  });
}

function nextTestimonial() {
  const testimonials = document.querySelectorAll(".testimonial-card");
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize testimonial slider
  showTestimonial(currentIndex);
  setInterval(nextTestimonial, 3500); // Change every 3.5 seconds

  // Add click handlers for all register redirects
  document.querySelectorAll('[onclick="redirectToRegister()"]').forEach(el => {
    el.addEventListener('click', redirectToRegister);
  });
});