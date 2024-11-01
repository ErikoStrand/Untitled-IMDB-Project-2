import { browser } from '$app/environment';

if (browser) {
	function loadData(name) {
		let data = JSON.parse(sessionStorage.getItem(name));
		return data;
	}

	let generalData = loadData('generalData');
	let movies = loadData('movies');
	let shows = loadData('shows');

	function nFormatter(num, digits) {
		const lookup = [
			{ value: 1, symbol: '' },
			{ value: 1e3, symbol: 'K' },
			{ value: 1e6, symbol: 'M' },
			{ value: 1e9, symbol: 'G' },
			{ value: 1e12, symbol: 'T' },
			{ value: 1e15, symbol: 'P' },
			{ value: 1e18, symbol: 'E' }
		];
		const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
		const item = lookup.findLast((item) => num >= item.value);
		return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0';
	}
	if (generalData != null) {
		displayData();
	}

	function displayData() {
		//movies
		let movie = document.getElementById('movies');
		let director = document.getElementById('directors');
		let topDirector = document.getElementById('topDirectors');

		let movieWatchtimeMinutes = document.getElementById('movieWatchtimeMinutes');
		let movieWatchtimeHours = document.getElementById('movieWatchtimeHours');
		let averageRating = document.getElementById('movieAverageRating');
		let averageRatingIMDB = document.getElementById('movieAverageRatingIMDB');

		for (let i = 0; i < 5 && i < Object.keys(movies['directors']).length; i++) {
			const director = Object.keys(movies['directors'])[i];
			const directorElement = document.createElement('p');
			directorElement.textContent = i + 1 + '. ' + director;
			topDirector.appendChild(directorElement);
		}
		director.textContent = movies['totalDirectors'];
		movie.textContent = movies['totalMedia'];
		movieWatchtimeMinutes.textContent = nFormatter(movies['totalWatchtimeMinutes'], 0);
		movieWatchtimeHours.textContent = movies['totalWatchtimeHours'];
		averageRating.textContent = movies['averageRating'].toFixed(1);
		averageRatingIMDB.textContent = movies['averageRatingIMDB'].toFixed(1);
		//tv episodes
		let show = document.getElementById('shows');
		let showAverageRating = document.getElementById('showAverageRating');
		let showAverageRatingIMDB = document.getElementById('showAverageRatingIMDB');
		let showWatchtimeMinutes = document.getElementById('showWatchtimeMinutes');
		let showWatchtimeHours = document.getElementById('showWatchtimeHours');

		showWatchtimeHours.textContent = shows['totalWatchtimeHours'];
		showWatchtimeMinutes.textContent = nFormatter(shows['totalWatchtimeMinutes'], 0);
		show.textContent = shows['totalMedia'];
		showAverageRating.textContent = shows['averageRating'].toFixed(1);
		showAverageRatingIMDB.textContent = shows['averageRatingIMDB'].toFixed(1);

		//general
		let totalWatchtimeNumber = movies['totalWatchtimeHours'] + shows['totalWatchtimeHours'];
		let highestStreak = document.getElementById('highestStreak');
		let currentStreak = document.getElementById('currentStreak');
		let totalMedia = document.getElementById('totalMedia');
		let totalAverageRating = document.getElementById('totalAverageRating');
		let longestTitle = document.getElementById('longestTitle');
		let shortestTitle = document.getElementById('shortestTitle');
		let mostVotes = document.getElementById('mostVotes');
		let mostVotesTitle = document.getElementById('mostVotesTitle');
		let leastVotes = document.getElementById('leastVotes');
		let leastVotesTitle = document.getElementById('leastVotesTitle');
		let totalWatchtime = document.getElementById('totalWatchtime');
		let totalWatchtimeDays = document.getElementById('totalWatchtimeDays');
		let totalWatchtimeProcent = document.getElementById('totalWatchtimeProcent');
		let mediaPerWeek = document.getElementById('mediaPerWeek');
		let mediaPerMonth = document.getElementById('mediaPerMonth');
		let accountAgeYears = document.getElementById('accountAgeYears');
		let accountAgeMonths = document.getElementById('accountAgeMonths');

		let years = (generalData['weeksSinceStart'] / 52.177457).toString().split('.')[0];
		let months = generalData['monthsSinceStart'] - years * 12;
		accountAgeYears.textContent = years;
		accountAgeMonths.textContent = months;
		mediaPerMonth.textContent = generalData['averageMediaPerMonth'].toFixed(0);
		mediaPerWeek.textContent = generalData['averageMediaPerWeek'].toFixed(1);
		totalWatchtimeDays.textContent = (totalWatchtimeNumber / 24).toFixed(0);
		totalWatchtime.textContent = totalWatchtimeNumber;
		totalWatchtimeProcent.textContent =
			((totalWatchtimeNumber / 8765.81277) * 100).toFixed(1) + '%';
		highestStreak.textContent = generalData['streak']['highestStreak'];
		currentStreak.textContent = generalData['streak']['currentStreak'];
		totalMedia.textContent = generalData['totalMedia'];
		totalAverageRating.textContent = generalData['totalAverageRating'].toFixed(1);
		longestTitle.textContent = generalData['titleData']['longest']['title'];
		shortestTitle.textContent = generalData['titleData']['shortest']['title'];
		mostVotes.textContent = nFormatter(generalData['numVotes']['highest']['votes'], 2);
		leastVotes.textContent = generalData['numVotes']['lowest']['votes'];
		mostVotesTitle.textContent = generalData['numVotes']['highest']['title'];
		leastVotesTitle.textContent = generalData['numVotes']['lowest']['title'];
		console.log(movies['perMonth'], generalData);
		loadCharts();
	}

	///CHARTSSSSS
	function loadCharts() {
		//movies
		var moviesPerYear = document.getElementById('moviesPerYear');

		var top20Genres = document.getElementById('movieTopGenres');
		var ratingsPerScore = document.getElementById('movieRatingsPerScore');

		//shows
		var showsPerRating = document.getElementById('showsPerRating');
		var showsPerYear = document.getElementById('showsPerYear');
		var showTopGenres = document.getElementById('showTopGenres');

		//general
		var mediaPerReleaseYear = document.getElementById('mediaPerReleaseYear');

		new Chart(mediaPerReleaseYear, {
			type: 'bar',
			data: {
				labels: Object.keys(generalData['mediaPerReleaseYear']),
				datasets: [
					{
						label: '# of Media',
						data: Object.values(generalData['mediaPerReleaseYear']),
						borderWidth: 1,
						backgroundColor: '#79ce60'
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: false
					}
				},
				maintainAspectRatio: false,
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true
						}
					}
				}
			}
		});

		new Chart(moviesPerYear, {
			type: 'bar',
			data: {
				labels: Object.keys(movies['perYear']),
				datasets: [
					{
						label: '# of Movies',
						data: Object.values(movies['perYear']),
						borderWidth: 1,
						backgroundColor: '#F6DB65'
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: false
					}
				},
				maintainAspectRatio: false,
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true
						}
					}
				}
			}
		});

		new Chart(top20Genres, {
			type: 'bar',
			data: {
				labels: Object.keys(movies['genres']).slice(0, 16),
				datasets: [
					{
						label: '# of Movies',
						data: Object.values(movies['genres']).slice(0, 16),
						borderWidth: 1,
						backgroundColor: '#F6DB65'
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: false
					}
				},
				maintainAspectRatio: false,
				scales: {
					x: {
						grid: {
							display: true
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: false
						}
					}
				}
			}
		});

		new Chart(ratingsPerScore, {
			type: 'bar',
			data: {
				labels: Object.keys(movies['ratingsPerScore']),
				datasets: [
					{
						label: '# of Movies',
						data: Object.values(movies['ratingsPerScore']),
						borderWidth: 1,
						backgroundColor: '#F6DB65'
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true
						}
					}
				}
			}
		});

		new Chart(showsPerRating, {
			type: 'bar',
			data: {
				labels: Object.keys(shows['ratingsPerScore']),
				datasets: [
					{
						label: '# of Shows',
						data: Object.values(shows['ratingsPerScore']),
						borderWidth: 1,
						backgroundColor: '#729ff2'
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true
						}
					}
				}
			}
		});
		new Chart(showTopGenres, {
			type: 'bar',
			data: {
				labels: Object.keys(shows['genres']).slice(0, 13),
				datasets: [
					{
						label: '# of Shows',
						data: Object.values(shows['genres']).slice(0, 13),
						borderWidth: 1,
						backgroundColor: '#729ff2'
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true
						}
					}
				}
			}
		});

		new Chart(showsPerYear, {
			type: 'bar',
			data: {
				labels: Object.keys(shows['perYear']),
				datasets: [
					{
						label: '# of Shows',
						data: Object.values(shows['perYear']),
						borderWidth: 1,
						backgroundColor: '#729ff2'
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: true
						}
					}
				}
			}
		});
	}
}
