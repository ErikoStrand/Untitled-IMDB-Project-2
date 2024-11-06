import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanString(str) {
	// Implement your cleanString function here
	return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function POST({ request }) {
	try {
		const { episodes } = await request.json();
		let minutes = 0;
		let hours = 0;

		const jsonFilePath = path.join(__dirname, '../../../../static/data/data.json');
		const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

		// Process the data
		for (let key in episodes) {
			let value = episodes[key];
			key = cleanString(key);

			if (!Number.isInteger(value)) {
				value = 20;
			}

			if (value <= 120) {
				if (jsonData.hasOwnProperty(key)) {
					minutes += value * jsonData[key]['episodeCount'];
				}
			} else {
				minutes += value;
			}
		}

		hours = minutes / 60;
		console.log('successfully got episode runtimes:');
		return json({ minutes, hours });
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
