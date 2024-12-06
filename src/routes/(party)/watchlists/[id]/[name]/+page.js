export async function _handleVote(isUpvote, mediaID) {
	try {
		const response = await fetch('/api/party/votes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				mediaID: mediaID,
				vote: isUpvote
			})
		});

		if (!response.ok) {
			throw new Error('Vote request failed');
		}

		return await response.json();
	} catch (error) {
		console.error('Failed to vote:', error);
		return null;
	}
}

export function _getTimeAgo(unixTimestamp) {
	const now = Math.floor(Date.now() / 1000);
	const diff = now - unixTimestamp;

	if (diff < 60) {
		return 'just now';
	}

	if (diff < 3600) {
		const minutes = Math.floor(diff / 60);
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
	}

	if (diff < 86400) {
		const hours = Math.floor(diff / 3600);
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
	}

	if (diff < 2592000) {
		const days = Math.floor(diff / 86400);
		return `${days} ${days === 1 ? 'day' : 'days'} ago`;
	}

	if (diff < 31536000) {
		const months = Math.floor(diff / 2592000);
		return `${months} ${months === 1 ? 'month' : 'months'} ago`;
	}

	const years = Math.floor(diff / 31536000);
	return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export async function _deleteMedia(id) {
	try {
		const response = await fetch('/api/party/deleteMedia', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
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

export function _formatRuntime(minutes) {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours === 0) return `${remainingMinutes}m`;
	if (remainingMinutes === 0) return `${hours}h`;
	return `${hours}h ${remainingMinutes}m`;
}
export async function _loadDescriptions(media, callback) {
	try {
		const response = await fetch('/api/tmdb/description', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ media })
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
							callback(result.id, result.description);
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
							callback(result.id, result.description);
						}
					} catch (e) {
						console.error('Error parsing line:', e);
						continue;
					}
				}
			}
		}
	} catch (error) {
		console.error('Error loading descriptions:', error);
		throw error;
	}
}
