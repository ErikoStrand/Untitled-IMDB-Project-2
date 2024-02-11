function loadData(name) {
  data = JSON.parse(sessionStorage.getItem(name));
  return data;
}

generalData = loadData("generalData");
movies = loadData("movies");
shows = loadData("shows");

displayData();

function displayData() {
  //movies
  var movie = document.getElementById("movies");
  var director = document.getElementById("directors");
  var movieWatchtimeMinutes = document.getElementById("movieWatchtimeMinutes");
  var movieWatchtimeHours = document.getElementById("movieWatchtimeHours");
  var averageRating = document.getElementById("movieAverageRating");
  var averageRatingIMDB = document.getElementById("movieAverageRatingIMDB");

  director.textContent = movies["totalDirectors"];
  movie.textContent = movies["totalMedia"];
  movieWatchtimeMinutes.textContent = movies["totalWatchtimeMinutes"];
  movieWatchtimeHours.textContent = movies["totalWatchtimeHours"];
  averageRating.textContent = movies["averageRating"].toFixed(1);
  averageRatingIMDB.textContent = movies["averageRatingIMDB"].toFixed(1);
  //tv episodes
  var show = document.getElementById("shows");
  var showAverageRating = document.getElementById("showAverageRating");
  var showAverageRatingIMDB = document.getElementById("showAverageRatingIMDB");
  var showWatchtimeMinutes = document.getElementById("showWatchtimeMinutes");
  var showWatchtimeHours = document.getElementById("showWatchtimeHours");

  showWatchtimeHours.textContent = shows["totalWatchtimeHours"];
  showWatchtimeMinutes.textContent = shows["totalWatchtimeMinutes"];
  show.textContent = shows["totalMedia"];
  showAverageRating.textContent = shows["averageRating"].toFixed(1);
  showAverageRatingIMDB.textContent = shows["averageRatingIMDB"].toFixed(1);

  //general
  var highestStreak = document.getElementById("highestStreak");
  var currentStreak = document.getElementById("currentStreak");
  var totalMedia = document.getElementById("totalMedia");
  var totalAverageRating = document.getElementById("totalAverageRating");
  var longestTitle = document.getElementById("longestTitle");
  var shortestTitle = document.getElementById("shortestTitle");
  var mostVotes = document.getElementById("mostVotes");
  var mostVotesTitle = document.getElementById("mostVotesTitle");
  var leastVotes = document.getElementById("leastVotes");
  var leastVotesTitle = document.getElementById("leastVotesTitle");

  highestStreak.textContent = generalData["streak"]["highestStreak"];
  currentStreak.textContent = generalData["streak"]["currentStreak"];
  totalMedia.textContent = generalData["totalMedia"];
  totalAverageRating.textContent = generalData["totalAverageRating"].toFixed(1);
  longestTitle.textContent = generalData["titleData"]["longest"]["title"];
  shortestTitle.textContent = generalData["titleData"]["shortest"]["title"];
  mostVotes.textContent = generalData["numVotes"]["highest"]["votes"];
  leastVotes.textContent = generalData["numVotes"]["lowest"]["votes"];
  mostVotesTitle.textContent = generalData["numVotes"]["highest"]["title"];
  leastVotesTitle.textContent = generalData["numVotes"]["lowest"]["title"];

  loadCharts();
}
