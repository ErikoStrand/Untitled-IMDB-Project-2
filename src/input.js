const data = [];
(function () {
  // Constants
  var NEWLINE = "\n";
  var DELIMITER = ",";

  // DOM elements
  var i = document.getElementById("file"); // File input element

  // Check if the file input element exists
  if (i) {
    // Add event listener for the 'change' event on the file input element
    i.addEventListener("change", function () {
      // Check if files are present and at least one file is selected also if the name is correct.
      if (!!i.files && i.files.length > 0 && i.files[0].name == "ratings.csv") {
        parseCSV(i.files[0]); // Parse the selected CSV file
      }
    });
  }

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
      sessionStorage.setItem("data", JSON.stringify(data));
      location.href = "statistics.html";
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

  document
    .getElementById("sampleButton")
    .addEventListener("click", function () {
      console.log("hello");
      fetch("sampleData.php")
        .then((response) => response.blob())
        .then((blob) => {
          parseCSV(blob);
        });
    });
})();
