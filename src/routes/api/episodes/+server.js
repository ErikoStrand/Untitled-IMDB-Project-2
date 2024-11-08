import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { querymany } from '$lib/server/db/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql =
	'SELECT SUM(b.runtime) as runtime FROM basic b INNER JOIN episode e ON b.ID = e.ID WHERE e.parentID IN (?)';
function cleanString(str) {
	// Implement your cleanString function here
	return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function POST({ request }) {
	try {
		const episodes = await request.json();
		// needs to be nested array but it works yippie
		const runtime = await querymany(sql, [episodes['episodes']]);

		let minutes = parseInt(runtime[0]['runtime']);
		let hours = 0;

		// Process the data
		hours = minutes / 60;
		console.log('successfully got episode runtimes:');
		return json({ minutes, hours });
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
