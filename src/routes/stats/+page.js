import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export function _goBack(fallbackPath = '/') {
	if (browser) {
		// Prefer native browser back functionality
		if (window.history.length > 1) {
			window.history.back();
		} else {
			// Fallback to a default path if no previous history
			goto(fallbackPath);
		}
	}
}

export function _nFormatter(num, digits) {
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
export function _loadData(name) {
	let data = JSON.parse(sessionStorage.getItem(name));
	return data;
}

export function _loadCharts() {
	if (browser) {
		console.log('loaded +page.js');
		function loadData(name) {
			let data = JSON.parse(sessionStorage.getItem(name));
			return data;
		}

		let generalData = loadData('generalData');
		let movies = loadData('movies');
		let shows = loadData('shows');

		if (generalData != null) {
			internal();
		}
		///CHARTSSSSS
		function internal() {
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
}
