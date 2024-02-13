function loadData(name) {
  data = JSON.parse(sessionStorage.getItem(name));
  return data;
}

generalData = loadData("generalData");
movies = loadData("movies");
shows = loadData("shows");

function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : "0";
}
displayData();

function displayData() {
  //movies
  var movie = document.getElementById("movies");
  var director = document.getElementById("directors");
  var topDirector = document.getElementById("topDirectors");

  var movieWatchtimeMinutes = document.getElementById("movieWatchtimeMinutes");
  var movieWatchtimeHours = document.getElementById("movieWatchtimeHours");
  var averageRating = document.getElementById("movieAverageRating");
  var averageRatingIMDB = document.getElementById("movieAverageRatingIMDB");

  for (let i = 0; i < 5 && i < Object.keys(movies["directors"]).length; i++) {
    const director = Object.keys(movies["directors"])[i];
    const directorElement = document.createElement("p");
    directorElement.textContent = i + 1 + ". " + director;
    topDirector.appendChild(directorElement);
  }
  director.textContent = movies["totalDirectors"];
  movie.textContent = movies["totalMedia"];
  movieWatchtimeMinutes.textContent = nFormatter(
    movies["totalWatchtimeMinutes"],
    0,
  );
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
  showWatchtimeMinutes.textContent = nFormatter(
    shows["totalWatchtimeMinutes"],
    0,
  );
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
  mostVotes.textContent = nFormatter(
    generalData["numVotes"]["highest"]["votes"],
    2,
  );
  leastVotes.textContent = generalData["numVotes"]["lowest"]["votes"];
  mostVotesTitle.textContent = generalData["numVotes"]["highest"]["title"];
  leastVotesTitle.textContent = generalData["numVotes"]["lowest"]["title"];

  loadCharts();
}
