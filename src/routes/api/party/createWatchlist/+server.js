import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

const createWatchlist = 'INSERT INTO watchlist (name, ownerID) VALUES (?, ?)';
const getWatchlists = `
    SELECT w.*, 
           CASE WHEN w.ownerID = ? THEN true ELSE false END as isOwner 
    FROM watchlist w 
    WHERE w.ownerID = ? 
    OR w.ID IN (SELECT watchlistID FROM invites WHERE discordID = ?)
    ORDER BY w.ID DESC
`;

export async function POST({ request }) {
	try {
		const { name, ownerID } = await request.json();

		// Create new watchlist
		await query(createWatchlist, [name, ownerID]);

		// Fetch updated watchlists
		const watchlists = await query(getWatchlists, [ownerID, ownerID, ownerID]);

		return json({
			success: true,
			watchlists: watchlists
		});
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
