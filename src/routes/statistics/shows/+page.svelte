<script>
	import { onMount } from 'svelte';
	import { _loadData, _nFormatter } from '../+page';
	import { _sendEpisodes } from './+page';
	let done = $state(false);
	let parents = $state({});
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
			parents = response;
			done = true;
		});
	});
</script>

<!-- ID, ended, genres, isAdult, rating, release, runtime, title, titleType, votes -->

{#if done}
	<div class="text-stone-50">
		{#each parents as parent}
			<div>
				<h1>{parent.title}</h1>
				<div class="flex flex-row gap-3">
					<span>{parent.release}</span><span>{_nFormatter(parent.votes, 1)}</span><span
						>{parent.rating}</span
					><span
						>{#if parent.ID in shows['shows']}{shows['shows'][parent.ID][1]}{/if}</span
					>
				</div>
				<div><span>{parent.genres}</span></div>
			</div>
		{/each}
	</div>
{/if}
