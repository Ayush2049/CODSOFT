/* Smooth scroll to the "Skills" section when clicked */
document
  .getElementById("scroll-to-skills")
  .addEventListener("click", function () {
    document.getElementById("skills").scrollIntoView({ behavior: "smooth" });
  });

/* Log a message to the console to confirm the script is loaded */

console.log("Portfolio Loaded");

/*Function to toggle the visibility of the "About Me" section*/

document.getElementById("toggle-about").addEventListener("click", function () {
  const aboutSection = document.getElementById("about");

  /*Check the current display state and toggle accordingly*/
  if (
    aboutSection.style.display === "none" ||
    aboutSection.style.display === ""
  ) {
    aboutSection.style.display = "block";
  } else {
    aboutSection.style.display = "none";
  }
});
