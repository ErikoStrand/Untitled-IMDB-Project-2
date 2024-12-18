import { browser } from '$app/environment';
import { uploaded } from '$lib/stores';
import { loading } from '$lib/stores';

export async function _handleSampleData() {
	fetch('/api/sample')
		.then((response) => response.blob())
		.then((blob) => {
			console.log('Got Sample Data Trying to Parse :)');
			handleCSV(blob);
		})
		.catch((error) => {
			console.error('Error fetching sample data:', error);
		});
}

export default function handleCSV(file) {
	if (browser) {
		loading.set(true);
		console.log('File uploaded, Loading handleCSV.');
		const data = [];
		(function () {
			// Constants
			var NEWLINE = '\n';
			var DELIMITER = ',';

			// DOM elements
			parseCSV(file);

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
					handleData(data);
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
				var currentField = '';
				var insideQuotes = false;

				for (var i = 0; i < row.length; i++) {
					var char = row[i];

					if (char === '"') {
						insideQuotes = !insideQuotes;
					} else if (char === DELIMITER && !insideQuotes) {
						result.push(currentField);
						currentField = '';
					} else {
						currentField += char;
					}
				}

				result.push(currentField);
				result.splice(4, 1);
				return result;
			}
			// gets ratings.csv from the server, using fetch and some js on the backend.
		})();

		//prob not elegant way but should work? add new false for new data point,
		//js data, server data (episodes).
		var allDataDone = [false, false];
		let movies = {
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
			ratingsPerScore: {} //10: int, 9: int, 8: int etc
		};

		let generalData = {
			streak: { highestStreak: 0, currentStreak: 0, startDate: '', endDate: '' },
			numVotes: {
				highest: { title: '', votes: 100 },
				lowest: { title: '', votes: 100000 }
			},
			titleData: {
				longest: { title: 'shrt', char: 0 },
				shortest: { title: 'placeholder', char: 0 }
			},
			mediaPerReleaseYear: {},
			totalMedia: 0,
			totalRating: 0,
			totalAverageRating: 0,
			averageMediaPerWeek: 0,
			averageMediaPerMonth: 0,
			monthsSinceStart: 0,
			weeksSinceStart: 0
		};

		let shows = {
			totalMedia: 0,
			totalWatchtimeMinutes: 0,
			totalWatchtimeHours: 0,
			totalRating: 0,
			totalRatingIMDB: 0,
			averageRating: 0,
			averageRatingIMDB: 0,
			perYear: {},
			ratingsPerScore: {},
			genres: {},
			episodes: {},
			shows: {}
		};

		function loadData(name) {
			data = JSON.parse(sessionStorage.getItem(name));
			return data;
		}
		function checkAllDataDone() {
			if (allDataDone.every(Boolean)) {
				uploaded.set(true);
				saveData('movies', movies);
				saveData('shows', shows);
				saveData('generalData', generalData);
				location.href = '/stats';
			}
		}

		function saveData(name, data) {
			sessionStorage.setItem(name, JSON.stringify(data));
		}

		function handleData() {
			//handle data
			data.splice(0, 1);
			let allShowID = [];
			let allDates = {};
			let allEpisodes = {};
			generalData['totalMedia'] = data.length;
			data.forEach(function (col) {
				//general
				getTitleData(col[3], col[0], col[5]);
				getNumVotes(col[10], col[3], col[0]);
				if (col[0] != 'Const') {
					generalData['totalRating'] += parseInt(col[1]);
				}
				getMediaPerReleaseYear(col[11]);
				allDates[col[2]] = 1;
				//other stuff
				if (col[5] == 'Movie' || col[5] == 'TV Movie') {
					movies['totalMedia'] += 1;
					movies['totalWatchtimeMinutes'] += parseInt(col[7]);
					movies['totalWatchtimeHours'] = parseInt(movies['totalWatchtimeMinutes'] / 60);
					movies['totalRating'] += parseInt(col[1]);
					movies['totalRatingIMDB'] += parseFloat(col[6]);
					getDirectors(col[12], movies);
					getRatingsPerScore(col[1], movies);
					getGenre(col[9], movies);
					getMediaPerMonth(col[2], movies);
					getMediaPerYear(col[2], movies);
					getRatingPerMonth(col[2], parseInt(col[1]), movies);
				}

				if (col[5] == 'TV Series' || col[5] == 'TV Mini Series') {
					shows['shows'][col[0]] = col;
					allShowID.push(col[0]);
					shows['totalMedia'] += 1;
					shows['totalRating'] += parseInt(col[1]);
					shows['totalRatingIMDB'] += parseFloat(col[6]);
					getRatingsPerScore(col[1], shows);
					getGenre(col[9], shows);
					getMediaPerYear(col[2], shows);
				}
				if (col[5] == 'TV Episode') {
					shows['episodes'][col[0]] = col;
				}
			});
			console.log(Object.keys(allEpisodes));
			//handle data that needs other data or that need to be a bit more advanced
			//general
			generalData['totalAverageRating'] = generalData['totalRating'] / generalData['totalMedia'];
			//streak
			allDates = sortObjectByKeys(allDates);
			getIMDBStreak(allDates);
			//movies
			getAverageRatings(movies);
			movies['directors'] = sortObjectByValues(movies['directors']);
			movies['genres'] = sortObjectByValues(movies['genres']);
			movies['ratingPerMonth'] = sortObjectByKeys(movies['ratingPerMonth']);
			movies['perMonth'] = sortObjectByKeys(movies['perMonth']);
			movies['averageRatingPerMonth'] = sortObjectByKeys(movies['averageRatingPerMonth']);
			movies['totalDirectors'] = getLenghtOfObject(movies['directors']);
			getAverageRatingPerMonth(movies['ratingPerMonth'], movies['perMonth'], movies);

			//shows
			sendData(allShowID)
				.then((response) => {
					shows['totalWatchtimeMinutes'] = parseInt(response['minutes']);
					shows['totalWatchtimeHours'] = parseInt(response['hours']);
					allDataDone[1] = true;
					checkAllDataDone();
				})
				.catch((error) => {
					console.error('Error:', error);
				});

			shows['genres'] = sortObjectByValues(shows['genres']);
			getAverageRatings(shows);
			generalData['monthsSinceStart'] = getMonthsSinceStart(
				Object.keys(movies['perMonth'])[0],
				Object.keys(movies['perMonth'])[Object.keys(movies['perMonth']).length - 1]
			);
			generalData['weeksSinceStart'] = parseInt(generalData['monthsSinceStart'] * 4.34812141);
			generalData['averageMediaPerWeek'] =
				generalData['totalMedia'] / generalData['weeksSinceStart'];
			generalData['averageMediaPerMonth'] =
				generalData['totalMedia'] / generalData['monthsSinceStart'];

			//check if done
			allDataDone[0] = true;
			checkAllDataDone();
		}
		function checkNaN(thing) {
			if (isNaN(thing)) {
				return 20;
			} else {
				return thing;
			}
		}
		//converts the dates to a Date
		function getMonthsSinceStart(start, end) {
			start = new Date(start);
			end = new Date(end);

			let diffMonths = (end.getFullYear() - start.getFullYear()) * 12;
			diffMonths -= start.getMonth();
			diffMonths += end.getMonth() + 1;
			return diffMonths;
		}

		function getTitleData(title, id, type) {
			if (title.length > generalData['titleData']['longest']['title'].length) {
				generalData['titleData']['longest']['ID'] = id;
				generalData['titleData']['longest']['title'] = title;
				generalData['titleData']['longest']['type'] = type;
				generalData['titleData']['longest']['char'] = title.length;
			}
			if (title.length < generalData['titleData']['shortest']['title'].length) {
				generalData['titleData']['shortest']['ID'] = id;
				generalData['titleData']['shortest']['title'] = title;
				generalData['titleData']['shortest']['type'] = type;
				generalData['titleData']['shortest']['char'] = title.length;
			}
		}
		function getNumVotes(votes, title, ID) {
			votes = parseInt(votes);
			if (votes > generalData['numVotes']['highest']['votes']) {
				generalData['numVotes']['highest']['ID'] = ID;
				generalData['numVotes']['highest']['title'] = title;
				generalData['numVotes']['highest']['votes'] = votes;
			} else if (votes < generalData['numVotes']['lowest']['votes']) {
				generalData['numVotes']['lowest']['ID'] = ID;
				generalData['numVotes']['lowest']['title'] = title;
				generalData['numVotes']['lowest']['votes'] = votes;
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
			generalData['streak']['highestStreak'] = longestStreak.length;
			generalData['streak']['startDate'] = longestStreak[0];
			generalData['streak']['endDate'] = longestStreak[longestStreak.length - 1];
			generalData['streak']['currentStreak'] = currentStreak.length;
		}

		function getRatingPerMonth(date, rating, type) {
			var date = date.split('-');
			if (type['ratingPerMonth'][date[0] + '-' + date[1]] !== undefined) {
				type['ratingPerMonth'][date[0] + '-' + date[1]] += rating;
			} else {
				type['ratingPerMonth'][date[0] + '-' + date[1]] = rating;
			}
		}

		function getAverageRatingPerMonth(ratingPerMonth, mediaPerMonth, type) {
			for (const key in ratingPerMonth) {
				type['averageRatingPerMonth'][key] = ratingPerMonth[key] / mediaPerMonth[key];
			}
		}

		function getMediaPerMonth(date, type) {
			var date = date.split('-');
			if (type['perMonth'][date[0] + '-' + date[1]] !== undefined) {
				type['perMonth'][date[0] + '-' + date[1]]++;
			} else {
				type['perMonth'][date[0] + '-' + date[1]] = 1;
			}
		}

		function getMediaPerReleaseYear(date) {
			var date = date.split('-');
			if (generalData['mediaPerReleaseYear'][date[0]] !== undefined) {
				generalData['mediaPerReleaseYear'][date[0]]++;
			} else {
				generalData['mediaPerReleaseYear'][date[0]] = 1;
			}
		}

		function getMediaPerYear(date, type) {
			var date = date.split('-');
			if (type['perYear'][date[0]] !== undefined) {
				type['perYear'][date[0]]++;
			} else {
				type['perYear'][date[0]] = 1;
			}
		}

		function getAverageRatings(type) {
			type['averageRating'] = type['totalRating'] / type['totalMedia'];
			type['averageRatingIMDB'] = type['totalRatingIMDB'] / type['totalMedia'];
		}

		function getDirectors(allDirectors, type) {
			const directors = allDirectors.split(',');
			directors.forEach(function (director) {
				director = director.trim();
				if (type['directors'][director] !== undefined) {
					// If the director exists, increment the count
					type['directors'][director]++;
				} else {
					// If the director does not exist, add a new entry
					type['directors'][director] = 1;
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
			if (type['ratingsPerScore'][rating] !== undefined) {
				// If the director exists, increment the count
				type['ratingsPerScore'][rating]++;
			} else {
				// If the director does not exist, add a new entry
				type['ratingsPerScore'][rating] = 1;
			}
		}

		function getGenre(allGenres, type) {
			const genres = allGenres.split(',');
			genres.forEach(function (genre) {
				genre = genre.trim();
				if (type['genres'][genre] !== undefined) {
					type['genres'][genre]++;
				} else {
					type['genres'][genre] = 1;
				}
			});
		}
		async function sendData(episodes) {
			try {
				const response = await fetch('/api/episodes', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ episodes })
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const result = await response.json();
				return result;
			} catch (error) {
				console.error('Error:', error);
				throw error;
			}
		}
	}
}
