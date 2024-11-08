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

<!-- ID, ended, genres, isAdult, rating, release, runtime, title, titleType, votes, watched, episodeCount -->

{#if done}
	<div class="relative mx-auto mb-32 flex max-w-screen-lg flex-col gap-4 pl-4 pr-4 text-stone-50">
		{#each episodes as episode}
			<div
				class="flex flex-col gap-1 rounded-md bg-zinc-800 p-4 font-archivo shadow-md shadow-stone-800"
			>
				<h1 class="text-xl">{episode.title}</h1>
				<div class="flex flex-row gap-3">
					<span>{episode.release}</span>
					<div class="flex flex-row gap-1 font-mono">
						<svg
							class="self-center fill-yellow-500"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
							width="20px"
							height="20px"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
							/></svg
						><span>{episode.rating}</span>
						<span class="text-gray-400">({_nFormatter(episode.votes, 1)})</span>
					</div>
					{#if episode.ID in shows['shows']}
						<div class="flex flex-row gap-1 font-mono">
							<svg
								class="self-center fill-blue-500"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 576 512"
								width="20px"
								height="20px"
								><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
									d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
								/></svg
							>
							<span>{shows['shows'][episode.ID][1]}</span>
						</div>
					{/if}
				</div>
				<div class="flex gap-2">
					{#each episode.genres.split(',') as genre, i}
						{#if i < episode.genres.split(',').length - 1}
							<span>{genre},</span>
						{:else}
							<span>{genre}</span>
						{/if}
					{/each}
				</div>
				<div class="flex flex-row gap-2">
					<div class="text-gray-400">
						<span>{episode.watched}</span>
						<span>/</span>
						<span>{episode.episodeCount}</span>
					</div>
					<div>
						{((episode.watched / episode.episodeCount) * 100).toFixed(2)}%
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
