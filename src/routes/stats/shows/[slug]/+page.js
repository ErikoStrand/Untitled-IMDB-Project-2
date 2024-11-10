export async function _getNotWatched(parentID, episodes) {
	try {
		const response = await fetch('/api/episodes/individual', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ parentID, episodes })
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
