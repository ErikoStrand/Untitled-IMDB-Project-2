<script>
	import { onMount } from 'svelte';
	import { _loadData, _nFormatter, _goBack } from '../+page';
	import { _sendEpisodes, _loadImages, _navigateWithData } from './+page';
	import { loading } from '$lib/stores';
	import { goto } from '$app/navigation';
	let done = $state(false);
	let episodes = $state({});
	let images = $state({});
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
	loading.set(true);
	onMount(async () => {
		shows = _loadData('shows');
		_sendEpisodes(Object.keys(shows['episodes'])).then((response) => {
			episodes = response;
			loading.set(false);
			done = true;
		});
	});
	onMount(async () => {
		await _loadImages(Object.keys(shows['episodes']), 'w92', 'w780', false, (id, result) => {
			images[id] = result;
		});
	});
</script>

<svelte:head>
	<title>Shows</title>
</svelte:head>
<!-- ID, ended, genres, isAdult, rating, release, runtime, title, titleType, votes, watched, episodeCount -->

<div
	class="relative mx-auto mb-32 flex max-w-screen-lg animate-slide-up flex-col gap-4 pl-4 pr-4 text-stone-50"
>
	<div class="text-xl">
		<nav class="flex flex-row gap-1">
			<button
				class=" self-center rounded-full fill-stone-50 px-2 py-1 font-archivo font-medium duration-200 ease-in-out hover:bg-zinc-600/50"
				onclick={_goBack}
				><svg
					class="self-center"
					xmlns="http://www.w3.org/2000/svg"
					height="20px"
					viewBox="0 0 320 512"
					><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
						d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
					/></svg
				>
			</button>
			<h1 class="self-center font-semibold">You're Rated Shows</h1>
		</nav>

		<p class="text-base">
			<span class="font-bold text-blue-500">Click</span> on any of the shows to get a display like this
			on the episodes you havn't watched
		</p>
		<p class="text-sm text-gray-400">
			Disclaimer: If you havn't rated a episode of the show it won't show up here.
		</p>
	</div>
	{#if done}
		{#each episodes as episode}
			<div
				tabindex="0"
				role="button"
				onclick={() => _navigateWithData(episode.ID, shows['episodes'])}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						_navigateWithData(episode.ID, shows['episodes']);
					}
				}}
				class="flex flex-row gap-3 rounded-md border-2 border-dashed border-transparent bg-zinc-800 p-4 font-archivo shadow-md shadow-stone-800 duration-300 ease-linear hover:border-dashed hover:border-blue-500"
			>
				<div id="image">
					{#if images[episode.ID]}
						{#if images[episode.ID]['poster'] !== null}
							<img
								class="h-[138px] w-[92px] rounded-md object-cover"
								src={images[episode.ID].poster}
								alt="{episode.title} poster"
								loading="lazy"
							/>
						{:else}
							<div class="h-[138px] w-[92px] animate-pulse rounded-md bg-zinc-700"></div>
						{/if}
					{:else}
						<div class="h-[138px] w-[92px] animate-pulse rounded-md bg-zinc-700"></div>
					{/if}
				</div>
				<section class="mt-auto">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div class="flex flex-row gap-2" onclick={(e) => e.stopPropagation()}>
						<svg
							class="self-center fill-blue-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 512"
							width="20px"
							height="20px"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
							/></svg
						>
						<a
							href="https://www.imdb.com/title/{episode.ID}/"
							rel="noopener noreferrer"
							target="”_blank”"
							class="text-xl">{episode.title}</a
						>
					</div>
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
				</section>
			</div>
		{/each}
	{/if}
</div>
