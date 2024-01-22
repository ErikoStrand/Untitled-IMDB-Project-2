const movies = {
    totalMovies: 0,
    totalWatchtimeMinutes: 0,
    totalWatchtimeHours: 0,
    totalDirectors: 0, 
    totalRating: 0,
    averageRating: 0,
    totalRatingIMDB: 0,
    averageRatingIMDB: 0,
    perYear:  {}, // year: yyyy, count: int
    perMonth: {}, // date: yyyy-mm, count: int
    genres: {}, //genre: int
    directors: {}, // director: count
    averageRatingPerMonth: {},
    ratingPerMonth: {}, 
    ratingsPerScore: {}, //10: int, 9: int, 8: int etc
};

const tvSeries = {
    totalSeries: 0,
    totalRating: 0,
    totalRatingIMDB: 0,
    averageRatingIMDB: 0,
    ratingsPerScore: {},
};

const data = []; //array with all movies

(function () {
    // Constants
    var NEWLINE = '\n';
    var DELIMITER = ',';

    // DOM elements
    var i = document.getElementById('file');  // File input element

    // Check if the file input element exists
    if (!i) {
        return;
    }

    // Add event listener for the 'change' event on the file input element
    i.addEventListener('change', function () {
        // Check if files are present and at least one file is selected also if the name is correct.
        if (!!i.files && i.files.length > 0 && i.files[0].name == "ratings.csv") {
            parseCSV(i.files[0]);  // Parse the selected CSV file
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
            toData(e.target.result);  // Convert the CSV content to data
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
        return result;
    }

})();



function handleData() {
    console.log(data);

    //handle data
    data.forEach(function (col) {

        if (col[5] == "movie") {
            movies["totalMovies"] += 1;
            movies["totalWatchtimeMinutes"] += parseInt(col[7]);
            movies["totalWatchtimeHours"] = parseInt(movies["totalWatchtimeMinutes"] / 60);
            movies["totalRating"] += parseInt(col[1]);
            movies["totalRatingIMDB"] += parseFloat(col[6]);
            getDirectors(col[12], movies);
            getRatingsPerScore(col[1], movies);
            getGenre(col[9], movies);
            getMediaPerMonth(col[2], movies);
            getMediaPerYear(col[2], movies);
            getRatingPerMonth(col[2], parseInt(col[1]), movies)

            console.log(col);
        }

        if (col[5] == "tvSeries") {

        }

    });
    //handle data that needs other data or that need to be a bit more advanced
    getAverageRatings(movies);
    movies["directors"] = sortObjectByValues(movies["directors"]);
    movies["genres"] = sortObjectByValues(movies["genres"]);
    movies["ratingPerMonth"] = sortObjectByKeys(movies["ratingPerMonth"]);
    movies["perMonth"] = sortObjectByKeys(movies["perMonth"]);
    movies["averageRatingPerMonth"] = sortObjectByKeys(movies["averageRatingPerMonth"]);
    movies["totalDirectors"] = getLenghtOfObject(movies["directors"]);

    getAverageRatingPerMonth(movies["ratingPerMonth"], movies["perMonth"], movies)
    console.log(movies);

    displayData();

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
        type["averageRatingPerMonth"][key] = ratingPerMonth[key]/mediaPerMonth[key];
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

function getMediaPerYear(date, type) {
    var date = date.split("-");
    if (type["perYear"][date[0]] !== undefined) {
        type["perYear"][date[0]]++;
    } else {
        type["perYear"][date[0]] = 1;
    }
}

function getAverageRatings(type) {
    type["averageRating"] = type["totalRating"] / type["totalMovies"];
    type["averageRatingIMDB"] = type["totalRatingIMDB"] / type["totalMovies"];
}


function getDirectors(allDirectors, type) {
    const directors = allDirectors.split(",");
    directors.forEach(function(director) {
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
        return(b[1] - a[1]);
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
    genres.forEach(function(genre) {
        genre = genre.trim();
        if (type["genres"][genre] !== undefined) {
            type["genres"][genre]++;
        } else {
            type["genres"][genre] = 1;
        }
    });
}

function displayData() {
    var movie = document.getElementById("movies");
    var director = document.getElementById("directors")
    var watchtimeMinutes = document.getElementById("watchtimeMinutes")
    var watchtimmeHours = document.getElementById("watchtimeHours")
    var averageRating = document.getElementById("averageRating")
    var averageRatingIMDB = document.getElementById("averageRatingIMDB")

    director.textContent = movies["totalDirectors"];
    movie.textContent = movies["totalMovies"];
    watchtimeMinutes.textContent = movies["totalWatchtimeMinutes"];
    watchtimeHours.textContent = movies["totalWatchtimeHours"];
    averageRating.textContent = movies["averageRating"].toFixed(1);
    averageRatingIMDB.textContent = movies["averageRatingIMDB"].toFixed(1);
}