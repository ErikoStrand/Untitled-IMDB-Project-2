import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

const loadSQL =
	'SELECT b.*, r.rating, r.votes, m.ID AS mediaID, m.addedAt, m.ownerID, d.discordName, d.avatar, i.poster as image, t.description, (SELECT COUNT(*) FROM upvotes WHERE mediaID = m.ID AND vote = 1) - (SELECT COUNT(*) FROM upvotes WHERE mediaID = m.ID AND vote = 0) as voteCount, (SELECT vote FROM upvotes WHERE mediaID = m.ID AND addedBy = ?) as userVote, CASE WHEN m.ownerID = ? THEN true WHEN w.ownerID = ? THEN true ELSE false END as canDelete FROM mediaInWatchlist m JOIN basic b ON m.IMDbID = b.ID JOIN watchlist w ON m.watchlistID = w.ID LEFT JOIN rating r ON b.ID = r.ID LEFT JOIN discordBasics d ON m.ownerID = d.discordID LEFT JOIN images i ON b.ID = i.id LEFT JOIN TMDBBasic t ON b.ID = t.ID WHERE m.watchlistID = ? ORDER BY m.addedAt DESC';
const addSQL = 'INSERT INTO mediaInWatchlist (watchlistID, ownerID, IMDbID) VALUES (?, ?, ?)';
const existSQL = `
	SELECT b.title 
	FROM basic b 
	WHERE b.ID = ? 
	AND NOT EXISTS (
			SELECT 1 
			FROM mediaInWatchlist m 
			WHERE m.watchlistID = ? 
			AND m.IMDbID = ?
	)
`;

async function checkExist(id, watchlistID) {
	const exist = await query(existSQL, [id, watchlistID, id]);
	const hasRows = exist && exist.length > 0;
	return hasRows;
}
export async function POST({ request }) {
	try {
		const { watchlistId, IMDbID, ownerID } = await request.json();

		if (await checkExist(IMDbID, watchlistId)) {
			await query(addSQL, [watchlistId, ownerID, IMDbID]);

			// Fetch updated list
			const media = await query(loadSQL, [ownerID, ownerID, ownerID, watchlistId]);

			return json({
				success: true,
				media: media
			});
		}

		return json(
			{
				success: false,
				message: 'Movie not found'
			},
			{ status: 404 }
		);
	} catch (error) {
		return json(
			{
				success: false,
				message: error.message
			},
			{ status: 500 }
		);
	}
}
