let storedData = {
	generalData: {},
	movies: {},
	shows: {}
};
import { json } from '@sveltejs/kit';
import { _setUploaded } from '$lib/globals';

export async function POST({ request }) {
	const data = await request.json();
	const { generalData, movies, shows } = data;

	// Process the received data on the server
	storedData.generalData = generalData;
	storedData.movies = movies;
	storedData.shows = shows;
	_setUploaded(true);

	// Return a response
	return json({ success: true });
}

export async function GET() {
	// Return the stored data
	return json(storedData);
}
