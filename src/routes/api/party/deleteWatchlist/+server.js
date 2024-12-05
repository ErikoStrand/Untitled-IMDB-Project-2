const deleteWatchlistSQL = 'DELETE FROM watchlist WHERE ID = ?';
const deleteMediaSQL = 'DELETE FROM mediaInWatchlist WHERE watchlistID = ?';
import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

export async function POST({ request }) {
	try {
		const { id } = await request.json();

		await query(deleteMediaSQL, [id]);

		await query(deleteWatchlistSQL, [id]);

		return json({ success: true });
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
