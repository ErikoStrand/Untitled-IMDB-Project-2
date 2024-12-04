import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const DISCORD_CLIENT_ID = env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = env.DISCORD_REDIRECT_URI;
const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds&prompt=consent`;

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
	return redirect(302, DISCORD_ENDPOINT);
}
