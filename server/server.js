const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, '../src')));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/sampleData', (req, res) => {
    const filePath = path.join(__dirname, '../data/ratings.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        res.setHeader('Content-Type', 'text/csv');
        res.send(data);
    });
});

app.post('/episodes', (req, res) => {
    let minutes = 0;
    let hours = 0;

    const data = JSON.parse(req.body.data);
    const jsonFilePath = path.join(__dirname, '../data/episodes_data.json');
    const json = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Process the data
    for (let key in data) {
        let value = data[key];
        key = cleanString(key);

        if (!Number.isInteger(value)) {
            value = 20;
        }

        if (value <= 120) {
            if (json.hasOwnProperty(key)) {
                minutes += value * json[key];
            }
        } else {
            minutes += value;
        }
    }

    hours = minutes / 60;
    res.send(`${minutes} ${hours}`);
});



//functions:
function cleanString(string) {
    return string.replace(/[^a-zA-Z0-9_-]/g, '');
}