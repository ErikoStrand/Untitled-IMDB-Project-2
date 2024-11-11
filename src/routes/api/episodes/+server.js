import { json } from '@sveltejs/kit';
import { querymany } from '$lib/server/db/mysql.js';

const sql =
	'SELECT SUM(b.runtime) as runtime FROM basic b INNER JOIN episode e ON b.ID = e.ID WHERE e.parentID IN (?)';

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
