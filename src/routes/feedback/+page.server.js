import { fail } from '@sveltejs/kit';
import { query } from '$lib/server/db/mysql';

// Validation functions
function sanitizeInput(input) {
	// Remove HTML tags and limit input length
	return input
		.replace(/<[^>]*>/g, '')
		.trim()
		.slice(0, 500);
}

function validateName(name) {
	// Allow letters, spaces, and hyphens
	const nameRegex = /^[A-Za-z\s-]{2,50}$/;
	return nameRegex.test(name);
}

function validateCategory(category) {
	const validCategories = [
		'Bug Report',
		'Praise',
		'Feature Request',
		'User Experience',
		'Performance',
		'Other'
	];
	return validCategories.includes(category);
}

function validateMessage(message) {
	// Minimum 10 characters, maximum 500
	return message.length >= 10 && message.length <= 500;
}

export const actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const name = sanitizeInput(data.get('name')?.toString() || '');
		const category = sanitizeInput(data.get('category')?.toString() || '');
		const message = sanitizeInput(data.get('message')?.toString() || '');

		// Comprehensive validation
		if (!name || !validateName(name)) {
			return fail(400, {
				name,
				category,
				message,
				error: 'Invalid name format'
			});
		}

		if (!category || !validateCategory(category)) {
			return fail(400, {
				name,
				category,
				message,
				error: 'Invalid category'
			});
		}

		if (!message || !validateMessage(message)) {
			return fail(400, {
				name,
				category,
				message,
				error: 'Message must be between 10-500 characters'
			});
		}

		try {
			// Insert feedback with client IP for tracking
			const clientIP = getClientAddress();
			const sql = `
                INSERT INTO feedback 
                (name, category, feedback) 
                VALUES (?, ?, ?)
            `;

			await query(sql, [name, category, message]);
			return { success: true };
		} catch (error) {
			console.error('Feedback submission error:', error);
			return fail(500, {
				error: 'Submission failed. Please try again later.'
			});
		}
	}
};
