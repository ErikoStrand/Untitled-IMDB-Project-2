const deleteMediaSQL = 'DELETE FROM mediaInWatchlist WHERE ID = ?';
const deleteVotesSQL = 'DELETE FROM upvotes WHERE mediaID = ?';
import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

export async function POST({ request }) {
	try {
		const { id } = await request.json();

		// Delete associated votes first
		await query(deleteVotesSQL, [id]);

		// Then delete the media
		await query(deleteMediaSQL, [id]);

		return json({ success: true });
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
