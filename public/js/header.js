//displays or hides the dropdown menu when the user clicks on it
function toggleDropdown() {
    var x = document.getElementById("dropdownMenu");
    if (x.style.display === "flex") {
      x.style.display = "none";
    } else {
      x.style.display = "flex";
    }
}