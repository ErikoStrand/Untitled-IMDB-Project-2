// src/hooks.server.js
import { env } from '$env/dynamic/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const { cookies } = event;

	// Force user data fetch after authentication
	if (cookies.get('disco_access_token')) {
		try {
			const userResponse = await fetch('https://discord.com/api/users/@me', {
				headers: {
					Authorization: `Bearer ${cookies.get('disco_access_token')}`
				}
			});

			if (userResponse.ok) {
				event.locals.user = await userResponse.json();
			} else {
				// If access token is invalid, try refresh flow
				if (cookies.get('disco_refresh_token')) {
					const refreshResponse = await fetch(`${event.url.origin}/api/discord/auth/refresh`, {
						headers: {
							Cookie: `disco_refresh_token=${cookies.get('disco_refresh_token')}`
						}
					});

					if (refreshResponse.ok) {
						const data = await refreshResponse.json();
						if (data.disco_access_token) {
							const newUserResponse = await fetch('https://discord.com/api/users/@me', {
								headers: {
									Authorization: `Bearer ${data.disco_access_token}`
								}
							});
							if (newUserResponse.ok) {
								event.locals.user = await newUserResponse.json();
							}
						}
					}
				}
			}
		} catch (err) {
			console.error('Error fetching user:', err);
			// Clear invalid tokens
			cookies.delete('disco_access_token', { path: '/' });
			cookies.delete('disco_refresh_token', { path: '/' });
		}
	}

	const response = await resolve(event);
	return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
	console.error('Server error:', error);
	return {
		message: 'Internal Server Error',
		code: error?.code ?? 'UNKNOWN'
	};
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession({ locals }) {
	return {
		user: locals.user || null
	};
}
