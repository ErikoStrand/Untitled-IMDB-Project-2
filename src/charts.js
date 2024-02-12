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

  //general
  var mediaPerReleaseYear = document.getElementById("mediaPerReleaseYear");

  new Chart(mediaPerReleaseYear, {
    type: "bar",
    data: {
      labels: Object.keys(generalData["mediaPerReleaseYear"]),
      datasets: [
        {
          label: "# of Media",
          data: Object.values(generalData["mediaPerReleaseYear"]),
          borderWidth: 1,
          backgroundColor: "#5ac43b",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
        },
      },
    },
  });

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
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        x: {
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
          },
        },
      },
    },
  });
}
