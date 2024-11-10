import { json } from '@sveltejs/kit';
import { querymany } from '$lib/server/db/mysql.js';

const masterSQL =
	"SELECT DISTINCT b.*, r.rating, r.votes, ec.episodeCount, w.watched FROM basic b INNER JOIN episode e ON b.ID = e.parentID LEFT JOIN rating r ON b.ID = r.ID LEFT JOIN (SELECT e.parentID, COUNT(CASE WHEN (b.release IS NOT NULL AND b.release != '\\N' AND CAST(b.release AS SIGNED) <= YEAR(CURRENT_DATE)) OR (r.votes > 0) THEN 1 END) AS episodeCount FROM episode e JOIN basic b ON e.ID = b.ID LEFT JOIN rating r ON e.ID = r.ID WHERE e.parentID IN (SELECT parentID FROM episode WHERE ID IN (?))GROUP BY e.parentID) ec ON b.ID = ec.parentID LEFT JOIN (SELECT parentID, COUNT(*) AS watched FROM episode WHERE ID IN (?) GROUP BY parentID) w ON b.ID = w.parentID WHERE e.ID IN (?)";
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
