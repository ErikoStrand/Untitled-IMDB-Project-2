import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql.js';

const inviteSQL = 'INSERT INTO invites (discordID, watchlistID) VALUES (?, ?)';
const checkExistSQL = 'SELECT 1 FROM invites WHERE discordID = ? AND watchlistID = ?';
const checkUserSQL = 'SELECT 1 FROM discordBasics WHERE discordID = ?';
const checkWatchlistSQL = 'SELECT ownerID FROM watchlist WHERE ID = ?';

export async function POST({ request }) {
	try {
		const { userId, watchlistId } = await request.json();

		// Check if user exists
		const [userExists] = await query(checkUserSQL, [userId]);
		if (!userExists) {
			return json(
				{
					success: false,
					message: 'User not found'
				},
				{ status: 404 }
			);
		}

		// Check if watchlist exists and get owner
		const [watchlist] = await query(checkWatchlistSQL, [watchlistId]);
		if (!watchlist) {
			return json(
				{
					success: false,
					message: 'Watchlist not found'
				},
				{ status: 404 }
			);
		}

		// Don't allow inviting the owner
		if (watchlist.ownerID === userId) {
			return json(
				{
					success: false,
					message: 'Cannot invite the watchlist owner'
				},
				{ status: 400 }
			);
		}

		// Check if invite already exists
		const [inviteExists] = await query(checkExistSQL, [userId, watchlistId]);
		if (inviteExists) {
			return json(
				{
					success: false,
					message: 'User is already invited'
				},
				{ status: 400 }
			);
		}

		// Add invite
		await query(inviteSQL, [userId, watchlistId]);

		return json({
			success: true,
			message: 'User invited successfully'
		});
	} catch (error) {
		console.error('Failed to invite user:', error);
		return json(
			{
				success: false,
				message: error.message
			},
			{ status: 500 }
		);
	}
}
