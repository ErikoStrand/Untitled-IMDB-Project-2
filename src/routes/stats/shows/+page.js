import { goto } from '$app/navigation';

export async function _sendEpisodes(episodes) {
	try {
		const response = await fetch('/api/episodes/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ episodes })
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

export async function _loadImages(
	episodes,
	posterSize = 'w154',
	backdropSize = 'original',
	post = false,
	onResult
) {
	try {
		const response = await fetch('/api/episodes/images', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				episodes,
				posterSize,
				backdropSize,
				post
			})
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				console.log('got all images');
				break;
			}

			const result = JSON.parse(decoder.decode(value));
			// Call callback with each result
			onResult(result.id, result.images);
		}
	} catch (error) {
		console.error('Error loading images:', error);
	}
}

function saveData(name, data) {
	sessionStorage.setItem(name, JSON.stringify(data));
}

export function _navigateWithData(id, data) {
	saveData(id, data);
	goto(`/stats/shows/${id}`);
}
