import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const DISCORD_CLIENT_ID = env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = env.DISCORD_REDIRECT_URI;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
	const disco_refresh_token = url.searchParams.get('code');
	if (!disco_refresh_token) {
		throw error(400, 'No refresh token found');
	}

	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: disco_refresh_token,
		scope: 'identify email guilds'
	};

	try {
		const response = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			body: new URLSearchParams(dataObject),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});

		const data = await response.json();

		if (data.error) {
			throw error(500, data.error);
		}

		const accessTokenExpiresIn = new Date(Date.now() + data.expires_in * 1000);
		const refreshTokenExpiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

		cookies.set('disco_access_token', data.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			expires: accessTokenExpiresIn
		});

		cookies.set('disco_refresh_token', data.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			expires: refreshTokenExpiresIn
		});

		return json({ disco_access_token: data.access_token });
	} catch (err) {
		console.error('Error refreshing Discord token:', err);
		throw error(500, 'Failed to refresh Discord token');
	}
}
