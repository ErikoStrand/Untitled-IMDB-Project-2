import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	cookies.delete('disco_access_token', { path: '/' });
	cookies.delete('disco_refresh_token', { path: '/' });

	return redirect(302, '/party');
}
