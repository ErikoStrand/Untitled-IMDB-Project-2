import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { querymany } from '$lib/server/db/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql =
	'SELECT b.runtime FROM basic b INNER JOIN episode e ON b.ID = e.ID WHERE e.parentID = IN (?)';
function cleanString(str) {
	// Implement your cleanString function here
	return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function POST({ request }) {
	try {
		const episodes = await request.json();
		const runtime = await querymany(sql, episodes['episodes']);
		console.log(runetime);

		let minutes = 10;
		let hours = 10;

		const jsonFilePath = path.join(__dirname, '../../../../static/data/data.json');
		const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

		// Process the data
		hours = minutes / 60;
		console.log('successfully got episode runtimes:');
		return json({ minutes, hours });
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
