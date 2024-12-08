import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const { webpage_url } = await request.json();

		// Extract list ID and construct standardized URL
		const listId = webpage_url.match(/\/list\/(ls\d+)/)?.[1];
		if (!listId) {
			throw new Error('Invalid IMDb list URL');
		}

		const standardizedUrl = `https://www.imdb.com/list/${listId}/?view=compact&user_rating=1,10`;
		console.log(standardizedUrl);
		const response = await fetch('https://instantapi.ai/api/retrieve/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				webpage_url: standardizedUrl,
				api_method_name: 'getAllIMDbIDSfromList',
				api_parameters: "{['tt23030', 'tt23030']}",
				api_response_structure: JSON.stringify({
					IMDb_IDS: ['<the imdb id of all the movie in the ul list>']
				}),
				api_key: env.INSTANT_API_KEY
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch IMDb IDs');
		}

		const data = await response.json();
		console.log(data);
		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
