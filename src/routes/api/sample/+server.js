import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
	try {
		const filePath = join(process.cwd(), 'static', 'data', 'ratings.csv');
		const data = await readFile(filePath, 'utf8');

		return new Response(data, {
			headers: {
				'Content-Type': 'text/csv'
			}
		});
	} catch (err) {
		console.error('Error reading file:', err);
		throw error(500, 'Error reading file');
	}
}
