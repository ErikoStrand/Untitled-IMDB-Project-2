import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	// Use the provided fetch
	const showID = params.slug;

	const response = await fetch('/api/exist', {
		method: 'POST',
		body: JSON.stringify({ id: showID }) // Send the ID directly
	});

	const result = await response.json();
	if (result) {
		return {
			exists: result,
			showID
		};
	} else {
		throw error(404, {
			message: 'Show not found'
		});
	}
}
