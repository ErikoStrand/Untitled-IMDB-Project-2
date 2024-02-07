var images = ["images/ratings.png", "images/export.png", "images/upload.png"];
var descriptions = [
  "And make sure to log in if you aren't already. Click the three dots in the top right corner.",
  "When you see the export button highlighted in the image click it and make sure to save the file as ratings.csv or else the website won't work.",
];
var currentIndex = 0;

function loadImage(index) {
  document.getElementById("image").src = images[index];
}
function toggleElement(id, state) {
  var doc = document.getElementById(id);
  doc.style.visibility = state;
}
function changeDescription(index) {
  document.getElementById("description-text").textContent = descriptions[index];
}
function buttonStates() {
  if (currentIndex == 0) {
    document.getElementById("linkToRatings").style.display = "block";
  } else {
    document.getElementById("linkToRatings").style.display = "none";
  }
  if (currentIndex > 0) {
    toggleElement("back", "visible");
  } else {
    toggleElement("back", "hidden");
  }
  if (currentIndex < images.length - 1) {
    toggleElement("next", "visible");
  } else {
    toggleElement("next", "hidden");
  }
}

document.getElementById("next").addEventListener("click", function () {
  if (currentIndex < images.length - 1) {
    currentIndex++;
    loadImage(currentIndex);
    changeDescription(currentIndex);
    buttonStates();
  }
});

document.getElementById("back").addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
    loadImage(currentIndex);
    changeDescription(currentIndex);
    buttonStates();
  }
});

buttonStates();
changeDescription(currentIndex);
