// src/routes/api/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();
	const { generalData, movies, shows } = data;

	// Process the received data on the server
	// You can store the data in a database, perform calculations, etc.

	// Example: Logging the received data
	console.log('Received data:', { generalData, movies, shows });

	// Return a response
	return json({ success: true });
}
