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
		let showImages = {};
		let episodes = await request.json();
		episodes = episodes['episodes'];
		const episodesData = await querymany(parentSQL, [episodes]);
		for (let episode of episodesData) {
			showImages[episode.ID] = await getShowImage(episode.title, 'w185');
		}

		// needs to be nested array but it works yippie

		console.log('successfully got episode data');
		return json(showImages);
	} catch (error) {
		console.error('Server Error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}

async function getShowImage(showName, size = 'original') {
	// Available sizes: 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'
	const IMAGE_BASE_URL = `https://image.tmdb.org/t/p/${size}`;

	try {
		// Sleep for 250ms between requests (approximately 4 requests per second)
		await sleep(50);

		const searchResponse = await fetch(
			`${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(showName)}`
		);

		if (!searchResponse.ok) {
			throw new Error(`TMDB API error: ${searchResponse.status}`);
		}

		const searchData = await searchResponse.json();

		if (searchData.results && searchData.results.length > 0) {
			const show = searchData.results[0];
			return {
				poster: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
				backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${show.backdrop_path}` : null
			};
		}

		return { poster: null, backdrop: null };
	} catch (error) {
		console.error(`Failed to fetch image for ${showName}:`, error);
		return { poster: null, backdrop: null };
	}
}
