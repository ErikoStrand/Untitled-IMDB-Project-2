import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const DISCORD_CLIENT_ID = env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = env.DISCORD_REDIRECT_URI;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
	const returnCode = url.searchParams.get('code');
	if (!returnCode) {
		throw error(400, 'Missing return code');
	}

	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: DISCORD_REDIRECT_URI,
		code: returnCode,
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
			console.log('error');
			throw error(400, data.error_description || 'Failed to authenticate with Discord');
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

		return redirect(302, '/party');
	} catch (err) {
		// Only log real errors
		if (err instanceof redirect) {
			console.error('Error during Discord authentication:', err);
			throw err;
		}
		throw err;
	}
}
