<script>
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';
	import { _loadImages } from '../../../../(critic)/stats/shows/+page.js';
	import { _nFormatter } from '../../../../(critic)/stats/+page.js';
	import { page } from '$app/stores';
	import {
		_loadDescriptions,
		_formatRuntime,
		_deleteMedia,
		_getTimeAgo,
		_handleVote,
		_getIDsFromList
	} from './+page.js';
	import { deserialize } from '$app/forms';
	import { fly } from 'svelte/transition';
	const person = $derived($user);
	let showModal = $state(true);
	let { data } = $props();
	let medias = $state(data.media);
	let images = $state({});
	let descriptions = $state({});
	let debugStatus = $state('');
	let loadingDots = $state('');
	let currentProgress = $state({ current: 0, total: 0 });

	$effect(() => {
		if (debugStatus == 'Retrieving list') {
			const interval = setInterval(() => {
				loadingDots = loadingDots.length >= 3 ? '' : loadingDots + '.';
			}, 500);

			return () => clearInterval(interval);
		} else {
			loadingDots = '';
		}
	});
	$effect(() => {
		if (medias) {
			loadMediaData(medias);
		}
	});

	async function loadMediaData(mediaList) {
		await _loadImages(mediaList, 'w92', 'w780', true, (id, result) => {
			images[id] = result;
		});

		await _loadDescriptions(mediaList, (id, description) => {
			descriptions[id] = description;
		});
	}

	let confirmDelete = $state(null);

	async function handleVote(isUpvote, mediaID) {
		const result = await _handleVote(isUpvote, mediaID);
		if (result) {
			medias = medias.map((media) => {
				if (media.mediaID === mediaID) {
					return {
						...media,
						voteCount: result.voteCount,
						userVote: result.userVote
					};
				}
				return media;
			});
		}
	}

	async function addMovie(watchlistId, IMDbID, ownerID) {
		const response = await fetch('/api/party/addMovie', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				watchlistId,
				IMDbID,
				ownerID
			})
		});
		const result = await response.json();
		if (result.success) {
			medias = result.media;
			event.target.reset();
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const input = formData.get('IMDbID');
		const ownerID = formData.get('ownerID');
		const watchlistId = $page.params.id;

		try {
			if (input.includes('imdb.com/list/')) {
				debugStatus = 'Retrieving list';
				const response = await _getIDsFromList(input);
				const { IMDb_IDS } = response;

				debugStatus = `Found ${IMDb_IDS.length} items`;
				currentProgress = { current: 0, total: IMDb_IDS.length };

				// Add each movie from the list
				for (const [index, IMDbID] of IMDb_IDS.entries()) {
					debugStatus = `Adding ${index + 1}/${IMDb_IDS.length}: ${IMDbID}`;
					currentProgress.current = index + 1;

					const response = await fetch('/api/party/addMovie', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							watchlistId,
							IMDbID,
							ownerID
						})
					});
					const result = await response.json();
					if (result.success) {
						medias = result.media;
					}
				}

				debugStatus = 'Loading media data...';
				await loadMediaData(medias);
				debugStatus = 'Complete!';
				setTimeout(() => {
					debugStatus = '';
				}, 2000);
				event.target.reset();
			} else {
				// Handle single IMDb ID
				const response = await fetch('/api/party/addMovie', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						watchlistId,
						IMDbID: input,
						ownerID
					})
				});
				const result = await response.json();
				if (result.success) {
					medias = result.media;
					await loadMediaData(medias);
					event.target.reset();
				}
			}
		} catch (error) {
			debugStatus = `Error: ${error.message}`;
			console.error('Failed to add media:', error);
		}
	}

	async function handleDelete(ID) {
		if (confirmDelete === ID) {
			try {
				await _deleteMedia(ID);
				// Create a new array reference to trigger reactivity
				medias = [...medias.filter((media) => media.mediaID !== ID)];
			} catch (error) {
				console.error('Failed to delete media:', error);
			}
			confirmDelete = null; // Reset confirmation state after deletion
		} else {
			confirmDelete = ID;
			setTimeout(() => {
				if (confirmDelete === ID) {
					confirmDelete = null;
				}
			}, 3000);
		}
	}
</script>

<div class="flex flex-col gap-8 text-stone-50 ~px-2/6">
	<section id="add" class="text-stone-50">
		<form onsubmit={handleSubmit} class="flex flex-col gap-2 font-archivo">
			<div class="flex flex-row gap-2">
				<input
					type="text"
					name="IMDbID"
					placeholder="IMDb ID or List Link"
					class="rounded-lg bg-zinc-800 p-3 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
				/>
				<input type="hidden" name="ownerID" value={person?.id} />
				<button
					class="rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-sky-400 px-4 py-3 font-bold transition-opacity duration-300 hover:opacity-90"
				>
					Add Media
				</button>
			</div>
			{#if debugStatus}
				<div class="font-mono text-sm text-green-400">
					{debugStatus}{#if debugStatus == 'Retrieving list'}{loadingDots}{/if}
					{#if currentProgress.total > 0}
						({currentProgress.current}/{currentProgress.total})
					{/if}
				</div>
			{/if}
		</form>
	</section>

	<section class="flex flex-col gap-4">
		{#each medias as media (media.mediaID)}
			<div
				in:fly={{ x: 50, duration: 300 }}
				out:fly={{ x: -50, duration: 200 }}
				class="flex flex-col gap-3 rounded-md border-2 border-dashed border-transparent bg-zinc-800 p-4 font-archivo shadow-md shadow-stone-800 duration-300 ease-linear hover:border-dashed hover:border-blue-500"
			>
				<section class="flex flex-row gap-3">
					<div id="image">
						{#if images[media.ID]}
							{#if images[media.ID]['poster'] !== null}
								<img
									class="h-[138px] w-[92px] rounded-md object-cover"
									src={images[media.ID].poster}
									alt="{media.title} poster"
									loading="lazy"
								/>
							{:else}
								<div class="h-[138px] w-[92px] animate-pulse rounded-md bg-zinc-700"></div>
							{/if}
						{:else}
							<div class="h-[138px] w-[92px] animate-pulse rounded-md bg-zinc-700"></div>
						{/if}
					</div>
					<section class="mt-auto flex flex-1 flex-col">
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
								href="https://www.imdb.com/title/{media.ID}/"
								rel="noopener noreferrer"
								target="”_blank”"
								class="text-xl">{media.title}</a
							>
						</div>
						<div class="flex flex-col">
							<div class="flex flex-row gap-2 text-gray-400">
								<div>{media.release}</div>
								<div>{_formatRuntime(media.runtime)}</div>
							</div>
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
								><span>{_nFormatter(media.rating, 2)}</span>
								<span class="text-gray-400">({_nFormatter(media.votes, 1)})</span>
							</div>
						</div>
						<div class="flex justify-between gap-2">
							<div>
								{#each media.genres.split(',') as genre, i}
									{#if i < media.genres.split(',').length - 1}
										<span>{genre},</span>
									{:else}
										<span>{genre}</span>
									{/if}
								{/each}
							</div>
						</div>
					</section>
					<button
						class="self-start rounded-md bg-red-500 px-4 font-medium transition-colors duration-200 hover:bg-red-600"
						onclick={() => handleDelete(media.mediaID)}
					>
						{confirmDelete === media.mediaID ? 'Sure?' : 'Delete'}
					</button>
				</section>
				<p>{descriptions[media.ID]}</p>
				<nav class="flex flex-row items-center justify-between gap-2">
					<div
						class="flex items-center rounded-lg text-stone-200 {media.userVote === null
							? 'bg-zinc-700'
							: media.userVote
								? 'bg-green-500'
								: 'bg-red-500'}"
					>
						<button
							aria-label="upvote"
							class="rounded-full p-1.5 transition-colors hover:bg-zinc-700/50"
							onclick={() => handleVote(true, media.mediaID)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="fill-stone-50"
								width="15px"
								viewBox="0 0 512 512"
								><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
								{#if media.userVote}
									<path
										d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"
									/>
								{:else}
									<path
										d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z"
									/>
								{/if}
							</svg>
						</button>

						<span class="min-w-[2rem] text-center font-medium">{media.voteCount}</span>

						<button
							aria-label="downvote"
							class="rounded-full p-1.5 transition-colors hover:bg-zinc-700/50"
							onclick={() => handleVote(false, media.mediaID)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="rotate-180 fill-stone-50"
								width="15px"
								viewBox="0 0 512 512"
								><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
								{#if !media.userVote && media.userVote != null}
									<path
										d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"
									/>
								{:else}
									<path
										d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z"
									/>
								{/if}
							</svg>
						</button>
					</div>
					<p class="space-x-1">
						added by <span class="font-heebo text-lg text-blue-600">{media.discordName}</span><span
							>{_getTimeAgo(media.addedAt)}</span
						>
					</p>
				</nav>
			</div>
		{/each}
	</section>
</div>
