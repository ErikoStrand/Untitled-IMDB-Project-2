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
