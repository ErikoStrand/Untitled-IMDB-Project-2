const createWatchlist = 'INSERT INTO watchlist (name, ownerID) VALUES (?, ?)';
const getWatchlists = 'SELECT name FROM watchlist where ownerID = (?)';
import { query } from '$lib/server/db/mysql.js';
import { json } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = sanitizeInput(data.get('name')?.toString() || '');
		console.log(data);
		const ownerID = sanitizeInput(data.get('ownerID')?.toString() || '');

		try {
			await query(createWatchlist, [name, ownerID]);
		} catch (error) {
			return json({ error: error.message }, { status: 500 });
		}
	}
};

function sanitizeInput(input) {
	// Remove HTML tags and limit input length
	return input
		.replace(/<[^>]*>/g, '')
		.trim()
		.slice(0, 500);
}

export async function load({ params, locals }) {
	try {
		const watchlists = await query(getWatchlists, [locals.user.id]);
		console.log(watchlists);
		return {
			watchlists
		};
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
