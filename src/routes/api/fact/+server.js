import { query } from '$lib/server/db/mysql';

const sql = 'SELECT * FROM facts ORDER BY RAND() LIMIT 1';

export async function GET() {
	try {
		const fact = await query(sql);
		return json(fact);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
