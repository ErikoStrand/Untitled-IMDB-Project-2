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

export function _percentToHex(percentage) {
	// Convert to number and handle NaN
	const percent = Number(percentage);
	if (isNaN(percent)) return '#ff0000'; // Default to red if NaN

	// Ensure percentage is between 0 and 100
	const boundedPercent = Math.min(100, Math.max(0, percent));

	let r, g;

	if (boundedPercent < 50) {
		// Red to Yellow (0-50%)
		r = 255;
		g = Math.round(boundedPercent * 5.1); // 255/50 = 5.1
	} else {
		// Yellow to Green (50-100%)
		r = Math.round((100 - boundedPercent) * 5.1);
		g = 255;
	}

	// Convert to hex and ensure 2 digits
	const rHex = Math.round(r).toString(16).padStart(2, '0');
	const gHex = Math.round(g).toString(16).padStart(2, '0');

	return `#${rHex}${gHex}00`;
}
