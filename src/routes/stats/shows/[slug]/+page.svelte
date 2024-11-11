<script>
	import { onMount } from 'svelte';
	import { _loadData, _nFormatter } from '../../+page.js';
	import { _getNotWatched } from './+page.js';
	import { _loadImages } from '../+page.js';
	import { loading } from '$lib/stores.js';

	let { data } = $props();
	let episodes = $state({});
	let images = $state({});
	let done = $state(false);
	loading.set(true);

	let seasonMap = $derived(
		Object.values(episodes).reduce((acc, episode) => {
			const season = episode.season;
			if (!acc[season]) {
				acc[season] = [];
			}
			acc[season].push(episode);
			return acc;
		}, {})
	);

	let seasons = $derived(
		Object.keys(seasonMap)
			.map(Number)
			.sort((a, b) => a - b)
	);

	let activeTab = $state();

	// Function to load images for specific season
	async function loadSeasonImages(season) {
		if (!seasonMap[season]) return;

		const seasonEpisodes = seasonMap[season].map((episode) => ({
			title: episode.title,
			ID: episode.ID
		}));

		await _loadImages(seasonEpisodes, 'w342', 'w780', true, (id, result) => {
			images[id] = result;
		});
	}

	async function setActiveTab(season) {
		activeTab = season;
		// Load images for the newly selected season
		await loadSeasonImages(season);
	}

	onMount(async () => {
		episodes = _loadData(data.showID);
		episodes = await _getNotWatched(data.showID, Object.keys(episodes));
		done = true;
		loading.set(false);

		// Set initial active tab and load its images
		if (seasons.length > 0) {
			await setActiveTab(seasons[0]);
		}
	});
</script>

<div
	class="relative mx-auto mb-32 flex max-w-screen-lg animate-slide-up flex-col px-4 text-stone-50"
>
	<div class="text-xl">
		<h1 class="font-semibold">Episodes You havn't rated</h1>
		<p class="text-sm text-gray-400">Disclaimer: Any episode you've rated won't show up here.</p>
	</div>
	{#if done}
		<div
			class="mt-4 flex gap-4 overflow-auto rounded-t-xl text-stone-50 [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
  [&::-webkit-scrollbar-track]:bg-gray-100
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  [&::-webkit-scrollbar]:h-2"
		>
			{#each seasons as season}
				<button
					class="whitespace-nowrap rounded-t-xl px-3 py-1 font-semibold duration-100 ease-in-out hover:text-gray-400 {activeTab ===
					season
						? 'border-b-2 border-yellow-300 bg-gradient-to-t from-zinc-700 from-90% to-zinc-800  text-stone-50'
						: 'border-b-2 border-zinc-800 bg-gradient-to-t from-zinc-800 from-90% to-zinc-900  text-stone-50'}"
					onclick={() => setActiveTab(season)}
				>
					Season {season}
				</button>
			{/each}
		</div>

		<div class="flex flex-col gap-4">
			{#each seasonMap[activeTab] as episode}
				<div
					class="flex flex-col gap-3 rounded-md bg-zinc-800 p-4 font-archivo shadow-md shadow-stone-800 sm:flex-row"
				>
					<div id="image">
						{#if images[episode.ID]}
							{#if images[episode.ID]['poster'] !== null}
								<img
									class="h-[124px] w-[256px] rounded-md object-cover"
									src={images[episode.ID].poster}
									alt="{episode.title} poster"
									loading="lazy"
								/>
							{:else}
								<div
									class="flex h-[124px] w-[256px] animate-pulse items-center justify-center rounded-md bg-zinc-700"
								>
									Not Found
								</div>
							{/if}
						{:else}
							<div
								class="flex h-[124px] w-[256px] animate-pulse items-center justify-center rounded-md bg-zinc-700"
							>
								Not Found
							</div>
						{/if}
					</div>
					<section class="mt-auto">
						<a
							class="flex flex-row gap-2"
							href="https://www.imdb.com/title/{episode.ID}/"
							rel="noopener noreferrer"
							target="”_blank”"
						>
							<div>S{episode.season}.E{episode.episode}</div>
							<svg
								class="self-center fill-blue-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 640 512"
								width="18px"
								height="18px"
								><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
									d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
								/></svg
							>
							<p class="text-l">{episode.title}</p>
						</a>
						<div class="flex flex-row gap-3">
							<span class="font-light text-gray-400">{episode.release}</span>
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
						</div>
						<div class="flex gap-2 text-base font-light">
							{#each episode.genres.split(',') as genre, i}
								{#if i < episode.genres.split(',').length - 1}
									<span>{genre},</span>
								{:else}
									<span>{genre}</span>
								{/if}
							{/each}
						</div>
					</section>
				</div>
			{/each}
		</div>
	{/if}
</div>
