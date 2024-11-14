import { query } from '$lib/server/db/mysql';
import { json } from '@sveltejs/kit';

const sql = 'SELECT * FROM facts ORDER BY RAND() LIMIT 1';

export async function GET() {
	try {
		const facts = await query(sql);

		if (!facts) {
			return json({ error: 'No data returned from query' }, { status: 404 });
		}

		if (facts.length === 0) {
			return json({ error: 'No facts found in database' }, { status: 404 });
		}

		return json(facts[0]);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
