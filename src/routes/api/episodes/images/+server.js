import { json } from '@sveltejs/kit';
import { querymany } from '$lib/server/db/mysql.js';
import { env } from '$env/dynamic/private';

const TMDB_API_KEY = env.TMDB_API;
const BASE_URL = 'https://api.themoviedb.org/3';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parentSQL =
	'SELECT DISTINCT b.title, b.ID FROM basic b INNER JOIN episode e ON b.ID = e.parentID LEFT JOIN rating r ON b.ID = r.ID WHERE e.ID IN (?)';

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
				try {
					for await (const result of getShowImages(episodesData, posterSize, backdropSize)) {
						const chunk = JSON.stringify(result) + '\n';
						controller.enqueue(new TextEncoder().encode(chunk));
					}
				} catch (streamError) {
					console.error('Stream error:', streamError);
					controller.error(streamError);
				} finally {
					controller.close();
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
			await sleep(250);

			// First try with IMDB ID
			const findResponse = await fetch(
				`${BASE_URL}/find/${episode.ID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
			);

			if (!findResponse.ok) {
				throw error(findResponse.status, `TMDB API error: ${findResponse.statusText}`);
			}

			const findData = await findResponse.json();

			// Check if we got results from IMDB ID
			if (findData.tv_results?.length > 0 || findData.tv_episode_results?.length > 0) {
				const show = findData.tv_results?.[0] || findData.tv_episode_results?.[0];
				yield {
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
				// If IMDB ID search failed, try with title
				await sleep(250); // Additional rate limiting before second request

				const searchResponse = await fetch(
					`${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(episode.title)}`
				);

				if (!searchResponse.ok) {
					throw error(searchResponse.status, `TMDB API error: ${searchResponse.statusText}`);
				}

				const searchData = await searchResponse.json();

				if (searchData.results && searchData.results.length > 0) {
					const show = searchData.results[0];
					yield {
						id: episode.ID,
						images: {
							poster: show.poster_path
								? `https://image.tmdb.org/t/p/${posterSize}${show.poster_path}`
								: null,
							backdrop: show.backdrop_path
								? `https://image.tmdb.org/t/p/${backdropSize}${show.backdrop_path}`
								: null
						}
					};
				} else {
					yield {
						id: episode.ID,
						images: { poster: null, backdrop: null }
					};
				}
			}
		} catch (error) {
			console.error(`Failed to fetch image for ${episode.ID}:`, error);
			try {
				// Try title search as last resort after error
				await sleep(250);

				const searchResponse = await fetch(
					`${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(episode.title)}`
				);

				if (!searchResponse.ok) {
					throw error(searchResponse.status, `TMDB API error: ${searchResponse.statusText}`);
				}

				const searchData = await searchResponse.json();

				if (searchData.results && searchData.results.length > 0) {
					const show = searchData.results[0];
					yield {
						id: episode.ID,
						images: {
							poster: show.poster_path
								? `https://image.tmdb.org/t/p/${posterSize}${show.poster_path}`
								: null,
							backdrop: show.backdrop_path
								? `https://image.tmdb.org/t/p/${backdropSize}${show.backdrop_path}`
								: null
						}
					};
				} else {
					yield {
						id: episode.ID,
						images: { poster: null, backdrop: null }
					};
				}
			} catch (secondError) {
				console.error(`Failed both ID and title search for ${episode.title}:`, secondError);
				yield {
					id: episode.ID,
					images: { poster: null, backdrop: null }
				};
			}
		}
	}
}
