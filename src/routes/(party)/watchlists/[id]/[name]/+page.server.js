import { query } from '$lib/server/db/mysql.js';
import { json } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const loadSQL =
	'SELECT b.*, r.rating, r.votes, m.ID AS mediaID, m.addedAt, m.ownerID, d.discordName, d.avatar, i.poster as image, t.description, (SELECT COUNT(*) FROM upvotes WHERE mediaID = m.ID AND vote = 1) - (SELECT COUNT(*) FROM upvotes WHERE mediaID = m.ID AND vote = 0) as voteCount, (SELECT vote FROM upvotes WHERE mediaID = m.ID AND addedBy = ?) as userVote, CASE WHEN m.ownerID = ? THEN true WHEN w.ownerID = ? THEN true ELSE false END as canDelete FROM mediaInWatchlist m JOIN basic b ON m.IMDbID = b.ID JOIN watchlist w ON m.watchlistID = w.ID LEFT JOIN rating r ON b.ID = r.ID LEFT JOIN discordBasics d ON m.ownerID = d.discordID LEFT JOIN images i ON b.ID = i.id LEFT JOIN TMDBBasic t ON b.ID = t.ID WHERE m.watchlistID = ? ORDER BY m.addedAt DESC';
const addSQL = 'INSERT INTO mediaInWatchlist (watchlistID, ownerID, IMDbID) VALUES (?, ?, ?)';
const existSQL = `
	SELECT b.title 
	FROM basic b 
	WHERE b.ID = ? 
	AND NOT EXISTS (
			SELECT 1 
			FROM mediaInWatchlist m 
			WHERE m.watchlistID = ? 
			AND m.IMDbID = ?
	)
`;
const checkPermissions = async (userId, watchlistId, mediaId = null) => {
	// Check if user created the watchlist
	const creatorSQL = `
			SELECT ownerID 
			FROM watchlist 
			WHERE ID = ? AND ownerID = ?
	`;

	// Check if user is invited
	const invitedSQL = `
			SELECT discordID 
			FROM invites 
			WHERE discordID = ? AND watchlistID = ?
	`;

	try {
		const [creator] = await query(creatorSQL, [watchlistId, userId]);
		const isCreator = Boolean(creator);

		// Only check for invite if user is not the creator
		let isInvited = false;
		if (!isCreator) {
			const [invited] = await query(invitedSQL, [userId, watchlistId]);
			isInvited = Boolean(invited);
		}

		return {
			didCreate: isCreator,
			isInvited: isCreator || isInvited // Creator is automatically considered invited
		};
	} catch (error) {
		console.error('Permission check failed:', error);
		return {
			didCreate: false,
			isInvited: false
		};
	}
};

export async function load({ params, locals }) {
	const watchlistId = params.id;
	const userId = locals.user?.id;

	// Check if user is logged in
	if (!userId) {
		throw redirect(303, '/party');
	}

	try {
		// Check permissions
		const permissions = await checkPermissions(userId, watchlistId);
		console.log(permissions);

		// If user is neither creator nor invited, redirect
		if (!permissions.didCreate && !permissions.isInvited) {
			console.log('is this wrong?');
			throw redirect(303, '/watchlists');
		}

		// Load media data if authorized
		const media = await query(loadSQL, [userId, userId, userId, watchlistId]);
		return {
			media,
			permissions
		};
	} catch (error) {
		console.error('Load error:', error);
		throw redirect(303, '/watchlists');
	}
}
export const actions = {
	default: async ({ request, params }) => {
		const watchlistId = params.id;
		const watchlistName = params.name;
		const data = await request.formData();
		const id = sanitizeInput(data.get('IMDbID')?.toString() || '');
		const ownerID = sanitizeInput(data.get('ownerID')?.toString() || '');

		try {
			if (await checkExist(id, watchlistId)) {
				await query(addSQL, [watchlistId, ownerID, id]);
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

async function checkExist(id, watchlistID) {
	const exist = await query(existSQL, [id, watchlistID, id]);
	const hasRows = exist && exist.length > 0;
	// needs to be nested array but it works yippie
	console.log('Can Insert: ', hasRows);
	return hasRows;
}
