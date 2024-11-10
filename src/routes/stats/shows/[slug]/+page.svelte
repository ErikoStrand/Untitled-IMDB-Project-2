<script>
	import { onMount } from 'svelte';
	import { _loadData } from '../../+page.js';
	import { _getNotWatched } from './+page.js';

	let { data } = $props();
	let episodes = $state({});
	onMount(async () => {
		episodes = _loadData(data.showID);
		episodes = await _getNotWatched(data.showID, Object.keys(episodes));
	});
</script>

{$inspect(episodes)}
