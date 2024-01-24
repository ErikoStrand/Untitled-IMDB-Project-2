function loadCharts() {
  //movies
  var moviesPerYear = document.getElementById("moviesPerYear");
  var averageRatingPerMonth = document.getElementById(
    "movieAverageRatingPerMonth",
  );
  var moviesPerMonth = document.getElementById("moviesPerMonth");
  var top20Genres = document.getElementById("movieTopGenres");
  var topDirectors = document.getElementById("topDirectors");
  var ratingsPerScore = document.getElementById("movieRatingsPerScore");

  //shows
  var showsPerRating = document.getElementById("showsPerRating");
  var showsPerYear = document.getElementById("showsPerYear");
  var showTopGenres = document.getElementById("showTopGenres");

  new Chart(moviesPerYear, {
    type: "bar",
    data: {
      labels: Object.keys(movies["perYear"]),
      datasets: [
        {
          label: "# of Movies",
          data: Object.values(movies["perYear"]),
          borderWidth: 1,
          backgroundColor: "#F6C615",
        },
      ],
    },
    options: {
      aspectRatio: 30 / 13,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  new Chart(averageRatingPerMonth, {
    type: "line",
    data: {
      labels: Object.keys(movies["averageRatingPerMonth"]),
      datasets: [
        {
          label: "x/10 per Month",
          data: Object.values(movies["averageRatingPerMonth"]),
          borderWidth: 1,
          backgroundColor: "#F6C615",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  new Chart(moviesPerMonth, {
    type: "bar",
    data: {
      labels: Object.keys(movies["perMonth"]),
      datasets: [
        {
          label: "# of Movies",
          data: Object.values(movies["perMonth"]),
          borderWidth: 1,
          backgroundColor: "#F6C615",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(top20Genres, {
    type: "bar",
    data: {
      labels: Object.keys(movies["genres"]).slice(0, 16),
      datasets: [
        {
          label: "# of Movies",
          data: Object.values(movies["genres"]).slice(0, 16),
          borderWidth: 1,
          backgroundColor: "#F6C615",
        },
      ],
    },
    options: {
      aspectRatio: 220 / 270,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(topDirectors, {
    type: "bar",
    data: {
      labels: Object.keys(movies["directors"]).slice(0, 10),
      datasets: [
        {
          label: "# of Directors",
          data: Object.values(movies["directors"]).slice(0, 10),
          borderWidth: 1,
          backgroundColor: "#F6C615",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(ratingsPerScore, {
    type: "bar",
    data: {
      labels: Object.keys(movies["ratingsPerScore"]),
      datasets: [
        {
          label: "# of Movies",
          data: Object.values(movies["ratingsPerScore"]),
          borderWidth: 1,
          backgroundColor: "#F6C615",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  new Chart(showsPerRating, {
    type: "bar",
    data: {
      labels: Object.keys(shows["ratingsPerScore"]),
      datasets: [
        {
          label: "# of Shows",
          data: Object.values(shows["ratingsPerScore"]),
          borderWidth: 1,
          backgroundColor: "#598ae4",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(showTopGenres, {
    type: "bar",
    data: {
      labels: Object.keys(shows["genres"]).slice(0, 13),
      datasets: [
        {
          label: "# of Shows",
          data: Object.values(shows["genres"]).slice(0, 13),
          borderWidth: 1,
          backgroundColor: "#598ae4",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  new Chart(showsPerYear, {
    type: "bar",
    data: {
      labels: Object.keys(shows["perYear"]),
      datasets: [
        {
          label: "# of Shows",
          data: Object.values(shows["perYear"]),
          borderWidth: 1,
          backgroundColor: "#598ae4",
        },
      ],
    },
    options: {
      aspectRatio: 30 / 13,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
