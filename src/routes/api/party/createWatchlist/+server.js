import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

const createWatchlist = 'INSERT INTO watchlist (name, ownerID) VALUES (?, ?)';
const getWatchlists = `SELECT w.*, CASE WHEN w.ownerID = ? THEN true ELSE false END as isOwner, (SELECT COUNT(*) FROM mediaInWatchlist WHERE watchlistID = w.ID) as mediaCount, (SELECT SUM(b.runtime) FROM mediaInWatchlist m JOIN basic b ON m.IMDbID = b.ID WHERE m.watchlistID = w.ID) as totalRuntime, (SELECT JSON_ARRAYAGG(JSON_OBJECT('discordName', d.discordName, 'avatar', d.avatar, 'discordID', d.discordID)) FROM invites i JOIN discordBasics d ON i.discordID = d.discordID WHERE i.watchlistID = w.ID) as invitedUsers, w.createdAt, db.discordName as ownerName FROM watchlist w LEFT JOIN discordBasics db ON w.ownerID = db.discordID WHERE w.ownerID = ? OR w.ID IN (SELECT watchlistID FROM invites WHERE discordID = ?) ORDER BY w.ID DESC`;

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