import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

const deleteInviteSQL = 'DELETE FROM invites WHERE discordID = ? AND watchlistID = ?';

export async function POST({ request }) {
	try {
		const { userId, watchlistId } = await request.json();

		await query(deleteInviteSQL, [userId, watchlistId]);

		return json({
			success: true,
			message: 'Successfully left watchlist'
		});
	} catch (error) {
		console.error('Failed to leave watchlist:', error);
		return json(
			{
				success: false,
				message: error.message
			},
			{ status: 500 }
		);
	}
}
