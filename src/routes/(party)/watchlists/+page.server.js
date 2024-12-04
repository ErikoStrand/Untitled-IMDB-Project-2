export const actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const name = sanitizeInput(data.get('name')?.toString() || '');
		console.log(name);
	}
};

function sanitizeInput(input) {
	// Remove HTML tags and limit input length
	return input
		.replace(/<[^>]*>/g, '')
		.trim()
		.slice(0, 500);
}
