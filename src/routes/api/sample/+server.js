import { error } from '@sveltejs/kit';

export async function GET({ url, fetch }) {
	try {
		// Use the full URL from your domain
		const baseUrl = url.origin;
		const response = await fetch(`${baseUrl}/data/ratings.csv`);

		if (!response.ok) {
			throw error(404, 'File not found');
		}

		const data = await response.text();

		return new Response(data, {
			headers: {
				'Content-Type': 'text/csv'
			}
		});
	} catch (err) {
		console.error('Error fetching file:', err);
		throw error(500, 'Error fetching file');
	}
}
