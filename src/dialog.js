const dialog = document.getElementById("gotData");
const openButton = document.getElementById("gotDataButton");
const closeButton = document.getElementById("gotDataClose");

openButton.addEventListener("click", () => {
  console.log("Opened Modal");
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  console.log("closed Modal");
  dialog.close();
});
