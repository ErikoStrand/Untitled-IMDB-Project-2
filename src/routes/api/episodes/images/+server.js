import { json } from '@sveltejs/kit';
import { querymany, query } from '$lib/server/db/mysql.js';
import { env } from '$env/dynamic/private';

const TMDB_API_KEY = env.TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parentSQL =
	'SELECT DISTINCT b.title, b.ID FROM basic b INNER JOIN episode e ON b.ID = e.parentID LEFT JOIN rating r ON b.ID = r.ID WHERE e.ID IN (?)';
const getStoredImages = 'SELECT ID, poster, backdrop FROM images WHERE ID = ?';
const insertImages =
	'INSERT INTO images (ID, poster, backdrop) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM images WHERE ID = ?)';
export async function POST({ request }) {
	try {
		// Validate request body
		if (!request.body) {
			throw error(400, 'Request body is required');
		}

		const { episodes, posterSize, backdropSize } = await request.json();

		if (!episodes || !Array.isArray(episodes)) {
			throw error(400, 'Episodes must be an array');
		}

		// Execute SQL query with error handling
		let episodesData;
		try {
			episodesData = await querymany(parentSQL, [episodes]);
		} catch (dbError) {
			console.error('Database error:', dbError);
			throw error(500, 'Database query failed');
		}

		if (!episodesData || episodesData.length === 0) {
			return json({ results: [] });
		}

		// Create stream for response
		const stream = new ReadableStream({
			async start(controller) {
				let isControllerClosed = false; // Add flag to track controller state

				try {
					for await (const result of getShowImages(episodesData, posterSize, backdropSize)) {
						if (isControllerClosed) break;

						try {
							let queryParams = [
								...[result.id, result.images.poster, result.images.backdrop],
								result.id
							];
							query(insertImages, queryParams);
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

async function* getShowImages(episodes, posterSize, backdropSize = 'original') {
	const VALID_SIZES = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'];
	posterSize = VALID_SIZES.includes(posterSize) ? posterSize : 'w500';
	backdropSize = VALID_SIZES.includes(backdropSize) ? backdropSize : 'original';

	for (const episode of episodes) {
		try {
			// First check if images exist in database
			const storedImages = await query(getStoredImages, [episode.ID]);

			if (storedImages && storedImages.length > 0) {
				// If images exist in database, return them
				yield {
					id: episode.ID,
					images: {
						poster: storedImages[0].poster,
						backdrop: storedImages[0].backdrop
					}
				};
				continue; // Skip TMDB API calls for this episode
			}

			// If not in database, proceed with TMDB API calls
			await sleep(50);

			const findResponse = await fetch(
				`${BASE_URL}/find/${episode.ID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
			);

			if (!findResponse.ok) {
				throw error(findResponse.status, `TMDB API error: ${findResponse.statusText}`);
			}

			const findData = await findResponse.json();
			let result;

			if (findData.tv_results?.length > 0 || findData.tv_episode_results?.length > 0) {
				const show = findData.tv_results?.[0] || findData.tv_episode_results?.[0];
				result = {
					id: episode.ID,
					images: {
						poster: show.poster_path
							? `https://image.tmdb.org/t/p/${posterSize}${show.poster_path}`
							: show.still_path
								? `https://image.tmdb.org/t/p/${posterSize}${show.still_path}`
								: null,
						backdrop: show.backdrop_path
							? `https://image.tmdb.org/t/p/${backdropSize}${show.backdrop_path}`
							: null
					}
				};
			} else {
				// Title search fallback remains the same...
				// ... (rest of your existing TMDB API logic)
			}

			// Store the new images in database
			if (result) {
				const queryParams = [result.id, result.images.poster, result.images.backdrop, result.id];
				await query(insertImages, queryParams);
				yield result;
			}
		} catch (error) {
			console.error(`Failed to fetch image for ${episode.ID}:`, error);
			yield {
				id: episode.ID,
				images: { poster: null, backdrop: null }
			};
		}
	}
}
