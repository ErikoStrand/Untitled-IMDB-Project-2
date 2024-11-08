<script>
	import { onMount } from 'svelte';
	import { _loadData, _nFormatter } from '../+page';
	import { _sendEpisodes } from './+page';
	let done = $state(false);
	let episodes = $state({});
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
		_sendEpisodes(Object.keys(shows['episodes'])).then((response) => {
			episodes = response;
			done = true;
			console.log(episodes);
		});
	});
</script>

<!-- ID, ended, genres, isAdult, rating, release, runtime, title, titleType, votes -->

{#if done}
	<div class="text-stone-50">
		{#each episodes as episode}
			<div class="">
				<h1>{episode.title}</h1>
				<div class="flex flex-row gap-3">
					<span>{episode.release}</span><span>{_nFormatter(episode.votes, 1)}</span><span
						>{episode.rating}</span
					><span
						>{#if episode.ID in shows['shows']}{shows['shows'][episode.ID][1]}{/if}</span
					>
				</div>
				<div><span>{episode.genres}</span></div>
			</div>
		{/each}
	</div>
{/if}
