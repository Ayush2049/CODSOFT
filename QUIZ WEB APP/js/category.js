// category.js

function selectCategory(category) {
  console.log("Category selected function called with category:", category); // Debug log
  localStorage.setItem("category", category);
  window.location.href = "quiz.html";
}
