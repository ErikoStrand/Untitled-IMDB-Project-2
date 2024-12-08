import { query } from '$lib/server/db/mysql.js';
export async function POST({ request, locals }) {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { mediaID, vote } = await request.json();

	try {
		const existingVote = await query('SELECT vote FROM upvotes WHERE mediaID = ? AND addedBy = ?', [
			mediaID,
			locals.user.id
		]);

		let userVote = null;

		if (existingVote.length) {
			if (existingVote[0].vote == vote) {
				await query('DELETE FROM upvotes WHERE mediaID = ? AND addedBy = ?', [
					mediaID,
					locals.user.id
				]);
			} else {
				await query('UPDATE upvotes SET vote = ? WHERE mediaID = ? AND addedBy = ?', [
					vote,
					mediaID,
					locals.user.id
				]);
				userVote = vote;
			}
		} else {
			await query('INSERT INTO upvotes (mediaID, addedBy, vote) VALUES (?, ?, ?)', [
				mediaID,
				locals.user.id,
				vote
			]);
			userVote = vote;
		}

		// Get total votes count
		const voteCount = await query(
			`
        SELECT 
          SUM(CASE WHEN vote = 1 THEN 1 ELSE -1 END) as total
        FROM upvotes 
        WHERE mediaID = ?
      `,
			[mediaID]
		);

		return new Response(
			JSON.stringify({
				mediaID,
				userVote,
				voteCount: voteCount[0].total || 0
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		console.error('Database error:', error);
		return new Response('Server error', { status: 500 });
	}
}
