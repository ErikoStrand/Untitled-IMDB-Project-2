import { query } from '$lib/server/db/mysql.js';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

const TMDB_API_KEY = env.TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredDescription = 'SELECT ID, description FROM TMDBBasic WHERE ID = ?';
const insertDescription =
	'REPLACE INTO TMDBBasic (ID, description) SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM TMDBBasic WHERE ID = ?)';

export async function POST({ request }) {
	try {
		if (!request.body) {
			throw error(400, 'Request body is required');
		}

		const { media } = await request.json();
		if (!media || !Array.isArray(media)) {
			throw error(400, 'Media must be an array');
		}

		const stream = new ReadableStream({
			async start(controller) {
				let isControllerClosed = false;

				try {
					for await (const result of getDescriptions(media)) {
						if (isControllerClosed) break;

						try {
							if (result && result.description) {
								await query(insertDescription, [result.id, result.description, result.id]);
							}
							const chunk = JSON.stringify(result) + '\n';
							controller.enqueue(new TextEncoder().encode(chunk));
						} catch (error) {
							if (error.code === 'ERR_INVALID_STATE') {
								isControllerClosed = true;
								break;
							}
							throw error;
						}
					}
				} catch (streamError) {
					console.error('Stream error:', streamError);
					if (!isControllerClosed) {
						controller.error(streamError);
					}
				} finally {
					if (!isControllerClosed) {
						controller.close();
					}
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'application/json',
				'Transfer-Encoding': 'chunked'
			}
		});
	} catch (err) {
		console.error('Server Error:', err);
		throw error(err.status || 500, err.message || 'Internal server error');
	}
}

async function* getDescriptions(media) {
	for (const item of media) {
		try {
			// Check cache first
			const storedDesc = await query(getStoredDescription, [item.ID]);
			if (storedDesc && storedDesc.length > 0) {
				yield {
					id: item.ID,
					description: storedDesc[0].description
				};
				continue;
			}

			await sleep(25); // Rate limiting

			const findResponse = await fetch(
				`${BASE_URL}/find/${item.ID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
			);

			if (!findResponse.ok) {
				throw error(findResponse.status, `TMDB API error: ${findResponse.statusText}`);
			}

			const findData = await findResponse.json();
			let description = null;

			// Check all possible result types
			if (findData.movie_results?.[0]) {
				description = findData.movie_results[0].overview;
			} else if (findData.tv_results?.[0]) {
				description = findData.tv_results[0].overview;
			} else if (findData.tv_episode_results?.[0]) {
				description = findData.tv_episode_results[0].overview;
			}

			yield {
				id: item.ID,
				description: description
			};
		} catch (error) {
			console.error(`Failed to fetch description for ${item.ID}:`, error);
			yield {
				id: item.ID,
				description: null
			};
		}
	}
}
