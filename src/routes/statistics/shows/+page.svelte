<script>
	import { onMount } from 'svelte';
	import { _loadData } from '../+page';

	let shows = $state({
		totalMedia: 0,
		totalWatchtimeMinutes: 0,
		totalWatchtimeHours: 0,
		totalRating: 0,
		totalRatingIMDB: 0,
		averageRating: 0,
		averageRatingIMDB: 0,
		perYear: {},
		ratingsPerScore: {},
		genres: {},
		episodes: {},
		shows: {}
	});

	onMount(() => {
		shows = _loadData('shows');
		console.log(shows);
	});
</script>

<h1>hello</h1>
