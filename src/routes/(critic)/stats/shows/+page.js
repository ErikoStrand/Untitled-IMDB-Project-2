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

export async function _loadImages(episodes, posterSize, backdropSize, post = false, callback) {
	try {
		const response = await fetch('/api/tmdb/images', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ episodes, posterSize, backdropSize, post })
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				// Process any remaining data in buffer
				if (buffer.trim()) {
					try {
						const result = JSON.parse(buffer);
						if (result.id) {
							callback(result.id, result.images);
						}
					} catch (e) {
						console.error('Error parsing final buffer:', e);
					}
				}
				break;
			}

			buffer += decoder.decode(value, { stream: true });

			// Split by newlines and process each complete JSON object
			const lines = buffer.split('\n');
			buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

			for (const line of lines) {
				if (line.trim()) {
					try {
						const result = JSON.parse(line);
						if (result.id) {
							callback(result.id, result.images);
						}
					} catch (e) {
						console.error('Error parsing line:', e);
						continue;
					}
				}
			}
		}
	} catch (error) {
		console.error('Error loading images:', error);
		throw error;
	}
}
function saveData(name, data) {
	sessionStorage.setItem(name, JSON.stringify(data));
}

export function _navigateWithData(id, data) {
	saveData(id, data);
	goto(`/stats/shows/${id}`);
}
