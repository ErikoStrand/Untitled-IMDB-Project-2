var images = ["images/ratings.png", "images/export.png"];
var currentIndex = 0;

function loadImage(index) {
  document.getElementById("image").src = images[index];
}

document.getElementById("next").addEventListener("click", function () {
  if (currentIndex < images.length - 1) {
    currentIndex++;
  }
  if (currentIndex < images.length) {
    loadImage(currentIndex);
  }
});

document.getElementById("back").addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
  }
  if (currentIndex < images.length) {
    loadImage(currentIndex);
  }
});
