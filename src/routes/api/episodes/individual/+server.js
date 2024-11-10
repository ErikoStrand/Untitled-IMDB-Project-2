import { json } from '@sveltejs/kit';
import { querymany } from '$lib/server/db/mysql.js';

const sql =
	'SELECT b.*,r.rating,r.votes,e.parentID,e.season,e.episode FROM basic b JOIN episode e ON b.ID = e.ID LEFT JOIN rating r ON b.ID = r.ID WHERE e.parentID = ? AND e.ID NOT IN (?)';
export async function POST({ request }) {
	try {
		let data = await request.json();
		let episodes = data['episodes'];
		const notWatched = await querymany(sql, [data.parentID, episodes]);
		// needs to be nested array but it works yippie

		console.log('successfully got not Watched');
		return json(notWatched);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
