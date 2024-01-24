const movies = {
  totalMedia: 0,
  totalWatchtimeMinutes: 0,
  totalWatchtimeHours: 0,
  totalDirectors: 0,
  totalRating: 0,
  averageRating: 0,
  totalRatingIMDB: 0,
  averageRatingIMDB: 0,
  perYear: {}, // year: yyyy, count: int
  perMonth: {}, // date: yyyy-mm, count: int
  genres: {}, //genre: int
  directors: {}, // director: count
  averageRatingPerMonth: {},
  ratingPerMonth: {},
  ratingsPerScore: {}, //10: int, 9: int, 8: int etc
};

const generalData = {
  streak: { highestStreak: 0, currentStreak: 0, startDate: "", endDate: "" },
  numVotes: {
    highest: { title: "", votes: 1000 },
    lowest: { title: "", votes: 100000 },
  },
  titleData: {
    longest: { title: "r", char: 0 },
    shortest: { title: "e123ddffawd", char: 0 },
  },
  mediaPerReleaseYear: {},
  totalMedia: 0,
  totalRating: 0,
  totalAverageRating: 0,
};

const shows = {
  totalMedia: 0,
  totalRating: 0,
  totalRatingIMDB: 0,
  averageRating: 0,
  averageRatingIMDB: 0,
  perYear: {},
  ratingsPerScore: {},
  genres: {},
};

const data = []; //array with all movies

(function () {
  // Constants
  var NEWLINE = "\n";
  var DELIMITER = ",";

  // DOM elements
  var i = document.getElementById("file"); // File input element

  // Check if the file input element exists
  if (!i) {
    return;
  }

  // Add event listener for the 'change' event on the file input element
  i.addEventListener("change", function () {
    // Check if files are present and at least one file is selected also if the name is correct.
    if (!!i.files && i.files.length > 0 && i.files[0].name == "ratings.csv") {
      parseCSV(i.files[0]); // Parse the selected CSV file
    }
  });

  // Function to parse CSV file
  function parseCSV(file) {
    // Check if FileReader is supported
    if (!file || !FileReader) {
      return;
    }

    // Create a new FileReader
    var reader = new FileReader();

    // Define the onload event handler for when the file is loaded
    reader.onload = function (e) {
      toData(e.target.result); // Convert the CSV content to data
      handleData();
    };

    // Read the file as text
    reader.readAsText(file);
  }

  // Function to convert CSV content to an HTML table
  function toData(text) {
    // Check if text or table element is not present
    if (!text) {
      return;
    }

    // Split CSV content into rows based on newline characters
    var rows = text.split(NEWLINE);

    // Extract headers (column names) from the first row

    // Iterate through each row in the CSV content
    rows.forEach(function (r) {
      r = r.trim();

      if (!r) {
        return;
      }

      // Split the row into columns based on the delimiter
      var cols = parseCSVRow(r);
      data.push(cols); //apend them to list to handle later

      if (cols.length === 0) {
        return;
      }
    });
  }
  function parseCSVRow(row) {
    var result = [];
    var currentField = "";
    var insideQuotes = false;

    for (var i = 0; i < row.length; i++) {
      var char = row[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === DELIMITER && !insideQuotes) {
        result.push(currentField);
        currentField = "";
      } else {
        currentField += char;
      }
    }

    result.push(currentField);
    return result;
  }
})();

function handleData() {
  //handle data
  var allDates = {};
  generalData["totalMedia"] = data.length - 1;
  data.forEach(function (col) {
    //general
    getTitleData(col[3]);
    getNumVotes(col[10], col[3]);
    if (col[0] != "Const") {
      generalData["totalRating"] += parseInt(col[1]);
    }
    getMediaPerReleaseYear(col[11]);
    allDates[col[2]] = 1;
    //other stuff
    if (col[5] == "movie") {
      movies["totalMedia"] += 1;
      movies["totalWatchtimeMinutes"] += parseInt(col[7]);
      movies["totalWatchtimeHours"] = parseInt(
        movies["totalWatchtimeMinutes"] / 60,
      );
      movies["totalRating"] += parseInt(col[1]);
      movies["totalRatingIMDB"] += parseFloat(col[6]);
      getDirectors(col[12], movies);
      getRatingsPerScore(col[1], movies);
      getGenre(col[9], movies);
      getMediaPerMonth(col[2], movies);
      getMediaPerYear(col[2], movies);
      getRatingPerMonth(col[2], parseInt(col[1]), movies);
    }

    if (col[5] == "tvSeries" || col[5] == "tvMiniSeries") {
      shows["totalMedia"] += 1;
      shows["totalRating"] += parseInt(col[1]);
      shows["totalRatingIMDB"] += parseFloat(col[6]);
      getRatingsPerScore(col[1], shows);
      getGenre(col[9], shows);
      getMediaPerYear(col[2], shows);
    }
  });
  //handle data that needs other data or that need to be a bit more advanced
  //general
  generalData["totalAverageRating"] =
    generalData["totalRating"] / generalData["totalMedia"];
  //streak
  allDates = sortObjectByKeys(allDates);
  getIMDBStreak(allDates);
  //movies
  getAverageRatings(movies);
  movies["directors"] = sortObjectByValues(movies["directors"]);
  movies["genres"] = sortObjectByValues(movies["genres"]);
  movies["ratingPerMonth"] = sortObjectByKeys(movies["ratingPerMonth"]);
  movies["perMonth"] = sortObjectByKeys(movies["perMonth"]);
  movies["averageRatingPerMonth"] = sortObjectByKeys(
    movies["averageRatingPerMonth"],
  );
  movies["totalDirectors"] = getLenghtOfObject(movies["directors"]);

  //shows
  shows["genres"] = sortObjectByValues(shows["genres"]);
  getAverageRatings(shows);

  getAverageRatingPerMonth(
    movies["ratingPerMonth"],
    movies["perMonth"],
    movies,
  );
  displayData();
}
function getTitleData(title) {
  if (title.length > generalData["titleData"]["longest"]["title"].length) {
    generalData["titleData"]["longest"]["title"] = title;
    generalData["titleData"]["longest"]["char"] = title.length;
  }
  if (title.length < generalData["titleData"]["shortest"]["title"].length) {
    generalData["titleData"]["shortest"]["title"] = title;
    generalData["titleData"]["shortest"]["char"] = title.length;
  }
}
function getNumVotes(votes, title) {
  votes = parseInt(votes);
  if (votes > generalData["numVotes"]["highest"]["votes"]) {
    generalData["numVotes"]["highest"]["title"] = title;
    generalData["numVotes"]["highest"]["votes"] = votes;
  } else if (votes < generalData["numVotes"]["lowest"]["votes"]) {
    generalData["numVotes"]["lowest"]["title"] = title;
    generalData["numVotes"]["lowest"]["votes"] = votes;
  }
}
function getIMDBStreak(dates) {
  dates = Object.keys(dates);
  dates = dates.slice(0, -1);
  let currentStreak = [dates[0]];
  let longestStreak = [dates[0]];
  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const previousDate = new Date(dates[i - 1]);
    if (currentDate.getTime() === previousDate.getTime() + 86400000) {
      // 86400000 milliseconds in a day
      currentStreak.push(dates[i]);
    } else {
      currentStreak = [dates[i]];
    }
    if (currentStreak.length > longestStreak.length) {
      longestStreak = [...currentStreak];
    }
  }
  generalData["streak"]["highestStreak"] = longestStreak.length;
  generalData["streak"]["startDate"] = longestStreak[0];
  generalData["streak"]["endDate"] = longestStreak[longestStreak.length - 1];
  generalData["streak"]["currentStreak"] = currentStreak.length;
  console.log(generalData);
}

function getRatingPerMonth(date, rating, type) {
  var date = date.split("-");
  if (type["ratingPerMonth"][date[0] + "-" + date[1]] !== undefined) {
    type["ratingPerMonth"][date[0] + "-" + date[1]] += rating;
  } else {
    type["ratingPerMonth"][date[0] + "-" + date[1]] = rating;
  }
}

function getAverageRatingPerMonth(ratingPerMonth, mediaPerMonth, type) {
  for (const key in ratingPerMonth) {
    type["averageRatingPerMonth"][key] =
      ratingPerMonth[key] / mediaPerMonth[key];
  }
}

function getMediaPerMonth(date, type) {
  var date = date.split("-");
  if (type["perMonth"][date[0] + "-" + date[1]] !== undefined) {
    type["perMonth"][date[0] + "-" + date[1]]++;
  } else {
    type["perMonth"][date[0] + "-" + date[1]] = 1;
  }
}

function getMediaPerReleaseYear(date) {
  var date = date.split("-");
  if (generalData["mediaPerReleaseYear"][date[0]] !== undefined) {
    generalData["mediaPerReleaseYear"][date[0]]++;
  } else {
    generalData["mediaPerReleaseYear"][date[0]] = 1;
  }
}

function getMediaPerYear(date, type) {
  var date = date.split("-");
  if (type["perYear"][date[0]] !== undefined) {
    type["perYear"][date[0]]++;
  } else {
    type["perYear"][date[0]] = 1;
  }
}

function getAverageRatings(type) {
  type["averageRating"] = type["totalRating"] / type["totalMedia"];
  type["averageRatingIMDB"] = type["totalRatingIMDB"] / type["totalMedia"];
}

function getDirectors(allDirectors, type) {
  const directors = allDirectors.split(",");
  directors.forEach(function (director) {
    director = director.trim();
    if (type["directors"][director] !== undefined) {
      // If the director exists, increment the count
      type["directors"][director]++;
    } else {
      // If the director does not exist, add a new entry
      type["directors"][director] = 1;
    }
  });
}

function getLenghtOfObject(directorsObject) {
  return Object.keys(directorsObject).length;
}

function sortObjectByKeys(obj) {
  var keys = Object.keys(obj);

  keys.sort();

  var sortedObject = {};
  keys.forEach(function (key) {
    sortedObject[key] = obj[key];
  });

  return sortedObject;
}

function sortObjectByValues(object) {
  var array = Object.entries(object);
  array.sort(function (a, b) {
    return b[1] - a[1];
  });
  return Object.fromEntries(array);
}

function getRatingsPerScore(rating, type) {
  if (type["ratingsPerScore"][rating] !== undefined) {
    // If the director exists, increment the count
    type["ratingsPerScore"][rating]++;
  } else {
    // If the director does not exist, add a new entry
    type["ratingsPerScore"][rating] = 1;
  }
}

function getGenre(allGenres, type) {
  const genres = allGenres.split(",");
  genres.forEach(function (genre) {
    genre = genre.trim();
    if (type["genres"][genre] !== undefined) {
      type["genres"][genre]++;
    } else {
      type["genres"][genre] = 1;
    }
  });
}

function displayData() {
  //movies
  var movie = document.getElementById("movies");
  var director = document.getElementById("directors");
  var watchtimeMinutes = document.getElementById("movieWatchtimeMinutes");
  var watchtimeHours = document.getElementById("movieWatchtimeHours");
  var averageRating = document.getElementById("movieAverageRating");
  var averageRatingIMDB = document.getElementById("movieAverageRatingIMDB");

  director.textContent = movies["totalDirectors"];
  movie.textContent = movies["totalMedia"];
  watchtimeMinutes.textContent = movies["totalWatchtimeMinutes"];
  watchtimeHours.textContent = movies["totalWatchtimeHours"];
  averageRating.textContent = movies["averageRating"].toFixed(1);
  averageRatingIMDB.textContent = movies["averageRatingIMDB"].toFixed(1);
  //tv episodes
  var show = document.getElementById("shows");
  var showAverageRating = document.getElementById("showAverageRating");
  var showAverageRatingIMDB = document.getElementById("showAverageRatingIMDB");

  show.textContent = shows["totalMedia"];
  showAverageRating.textContent = shows["averageRating"].toFixed(1);
  showAverageRatingIMDB.textContent = shows["averageRatingIMDB"].toFixed(1);

  loadCharts();
}
