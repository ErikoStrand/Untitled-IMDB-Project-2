import { query } from '$lib/server/db/mysql.js';
import { json } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

const loadSQL =
	'SELECT b.*, r.rating, r.votes FROM basic b LEFT JOIN rating r ON b.ID = r.ID WHERE b.ID = ?';
const addSQL =
	'INSERT INTO mediaInWatchlist (watchlistID, ownerID, IMDbID, addedBy) VALUES (?, ?, ?, ?)';
const existSQL = 'SELECT basic.title FROM basic WHERE ID = (?)';

export const actions = {
	default: async ({ request, params }) => {
		const watchlistId = params.id;
		const watchlistName = params.name;
		const data = await request.formData();
		const id = sanitizeInput(data.get('IMDbID')?.toString() || '');
		const ownerID = sanitizeInput(data.get('ownerID')?.toString() || '');
		const username = sanitizeInput(data.get('username')?.toString() || '');

		try {
			if (checkExist(id)) {
				await query(addSQL, [watchlistId, ownerID, id, username]);
				return {
					success: true,
					message: 'Movie added successfully'
				};
			}
			return {
				success: false,
				message: 'Movie not found'
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
	// Remove HTML tags and limit input length
	return input
		.replace(/<[^>]*>/g, '')
		.trim()
		.slice(0, 500);
}

async function checkExist(id) {
	const exist = await query(existSQL, [id]);
	const hasRows = exist && exist.length > 0;
	// needs to be nested array but it works yippie
	console.log('Exist: ', hasRows);
	return json(hasRows);
}
