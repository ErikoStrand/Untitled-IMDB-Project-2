import { browser } from '$app/environment';

export async function _handleFileUpload(event) {
	if (browser) {
		const file = event.target.files[0];
		if (file && file.name === 'ratings.csv') {
			const module = await import('$lib/scripts/handleCSV.js');
			module.default(file);
		}
	}
}
