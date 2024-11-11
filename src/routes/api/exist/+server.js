import { query } from '$lib/server/db/mysql';
import { json } from '@sveltejs/kit';

const sql = 'SELECT basic.title FROM basic WHERE ID = (?)';

export async function POST({ request }) {
	try {
		let ID = await request.json();
		const exist = await query(sql, [ID.id]);
		const hasRows = exist && exist.length > 0;
		// needs to be nested array but it works yippie
		console.log('checked if exists.');

		return json(hasRows);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
