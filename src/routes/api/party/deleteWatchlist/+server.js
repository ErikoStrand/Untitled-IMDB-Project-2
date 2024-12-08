import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

const deleteWatchlistSQL = 'DELETE FROM watchlist WHERE ID = ?';
const deleteMediaSQL = 'DELETE FROM mediaInWatchlist WHERE watchlistID = ?';
const deleteInvitesSQL = 'DELETE FROM invites WHERE watchlistID = ?';

export async function POST({ request }) {
	try {
		const { id } = await request.json();

		// Delete in order to maintain referential integrity
		await query(deleteMediaSQL, [id]); // Delete all media first
		await query(deleteInvitesSQL, [id]); // Delete all invites
		await query(deleteWatchlistSQL, [id]); // Delete the watchlist last

		return json({ success: true });
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
