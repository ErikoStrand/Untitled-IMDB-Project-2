import { query } from '$lib/server/db/mysql.js';
import { json } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

const createWatchlist = 'INSERT INTO watchlist (name, ownerID) VALUES (?, ?)';
const getWatchlists = `
    SELECT w.*, 
           CASE WHEN w.ownerID = ? THEN true ELSE false END as isOwner 
    FROM watchlist w 
    WHERE w.ownerID = ? 
    OR w.ID IN (SELECT watchlistID FROM invites WHERE discordID = ?)
    ORDER BY w.ID DESC
`;

export const actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const name = sanitizeInput(data.get('name')?.toString() || '');
		const ownerID = sanitizeInput(data.get('ownerID')?.toString() || '');

		try {
			const [result] = await query(createWatchlist, [name, ownerID]);
			const watchlists = await query(getWatchlists, [ownerID, ownerID, ownerID]);

			return {
				success: true,
				id: result.insertId,
				watchlists
			};
		} catch (error) {
			return fail(500, {
				success: false,
				message: error.message
			});
		}
	}
};
function sanitizeInput(input) {
	return input
		.replace(/<[^>]*>/g, '')
		.trim()
		.slice(0, 500);
}

export async function load({ params, locals }) {
	try {
		const userId = locals.user.id;
		const watchlists = await query(getWatchlists, [userId, userId, userId]);

		return {
			watchlists
		};
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
