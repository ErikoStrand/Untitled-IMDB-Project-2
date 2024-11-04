import { json } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { _loadCharts } from './+page';

export async function load({ fetch }) {
	try {
		const response = await fetch('/api/finished');
		const data = await response.json();
		return data;
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to fetch data' }, { status: 500 });
	}
}