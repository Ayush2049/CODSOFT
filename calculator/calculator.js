function showOnDisplay(input) {
  displayValue = document.getElementById("display").value;
  document.getElementById("display").value =
    document.getElementById("display").value + input;
}

function clearScreen() {
  document.getElementById("display").value = "";
}

function showResults() {
  document.getElementById("display").value = eval(
    document.getElementById("display").value
  );
}
