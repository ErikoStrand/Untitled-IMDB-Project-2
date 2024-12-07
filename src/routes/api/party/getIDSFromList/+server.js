import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const { webpage_url } = await request.json();

		const response = await fetch('https://instantapi.ai/api/retrieve/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				webpage_url,
				api_method_name: 'getAllIMDbIDS',
				api_response_structure: JSON.stringify({
					IMDb_IDS: ['<the imdb id of all the media in the list>']
				}),
				api_key: env.INSTANT_API_KEY
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch IMDb IDs');
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
