import { json } from '@sveltejs/kit';
import { querymany } from '$lib/server/db/mysql.js';

const parentSQL =
	'SELECT DISTINCT b.*, r.rating, r.votes FROM basic b INNER JOIN episode e ON b.ID = e.parentID LEFT JOIN rating r ON b.ID = r.ID WHERE e.ID IN (?)';
const episodeCountSQL =
	'SELECT parentID, COUNT(*) AS episodeCount FROM episode WHERE parentID IN ( SELECT parentID FROM episode WHERE ID IN (?) ) GROUP BY parentID';
const watchedSQL =
	'SELECT parentID, COUNT(*) AS watched FROM episode WHERE ID IN (?) GROUP BY parentID';

const masterSQL =
	'SELECT b.*, r.rating, r.votes, ec.episodeCount, w.watched FROM basic b INNER JOIN episode e ON b.ID = e.parentID LEFT JOIN rating r ON b.ID = r.ID LEFT JOIN ( SELECT parentID, COUNT(*) AS episodeCount FROM episode WHERE parentID IN (SELECT parentID FROM episode WHERE ID IN (?)) GROUP BY parentID ) ec ON b.ID = ec.parentID LEFT JOIN (SELECT parentID, COUNT(*) AS watched FROM episode WHERE ID IN (?) GROUP BY parentID ) w ON b.ID = w.parentID WHERE e.ID IN (?) GROUP BY b.ID, r.rating, r.votes, ec.episodeCount, w.watched';
export async function POST({ request }) {
	try {
		let episodes = await request.json();
		episodes = episodes['episodes'];
		const episodesData = await querymany(masterSQL, [episodes, episodes, episodes]);
		// needs to be nested array but it works yippie

		console.log('successfully got episode data');
		return json(episodesData);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
