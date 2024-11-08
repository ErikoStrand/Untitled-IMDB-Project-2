import { json } from '@sveltejs/kit';
import { querymany } from '$lib/server/db/mysql.js';

const parentSQL =
	'SELECT DISTINCT b.*, r.rating, r.votes FROM basic b INNER JOIN episode e ON b.ID = e.parentID LEFT JOIN rating r ON b.ID = r.ID WHERE e.ID IN (?)';
const completionSQL = '';

export async function POST({ request }) {
	try {
		const episodes = await request.json();
		// needs to be nested array but it works yippie
		const parents = await querymany(parentSQL, [episodes['episodes']]);

		console.log('successfully got episode parents:');
		return json(parents);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
