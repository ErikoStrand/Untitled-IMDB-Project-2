<script>
	import MediaCard from '$lib/MediaCard.svelte';
	import { setContext } from 'svelte';
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
		_getIDsFromList,
		_inviteUser,
		_getMostVoted
	} from './+page.js';
	import { deserialize } from '$app/forms';
	import { fly } from 'svelte/transition';
	const person = $derived($user);
	let showModal = $state(true);
	let { data } = $props();
	let { permissions } = $state(data);
	let medias = $state(data.media);
	let images = $state({});
	let descriptions = $state({});
	let debugStatus = $state('');
	let loadingDots = $state('');
	let currentProgress = $state({ current: 0, total: 0 });
	let confirmDelete = $state(null);

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
		if (medias != null) {
			loadMediaData(medias);
		}
	});

	setContext('media', {
		handlers: {
			handleDelete,
			handleVote
		},
		utils: {
			formatRuntime: _formatRuntime,
			getTimeAgo: _getTimeAgo,
			nFormatter: _nFormatter
		}
	});
	let mostVoted = $derived(medias ? _getMostVoted(medias) : null);
	//maaan
	async function loadMediaData(mediaList) {
		await _loadImages(mediaList, 'w92', 'w780', true, (id, result) => {
			const media = medias.find((m) => m.ID === id);
			if (media) {
				media.image = result?.poster || null;
			}
		});

		await _loadDescriptions(mediaList, (id, description) => {
			const media = medias.find((m) => m.ID === id);
			if (media) {
				media.description = description;
			}
		});
	}

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

				// Collect all promises
				const promises = IMDb_IDS.map(async (IMDbID, index) => {
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
					return response.json();
				});

				// Wait for all movies to be added
				const results = await Promise.all(promises);
				const lastResult = results[results.length - 1];

				if (lastResult.success) {
					medias = lastResult.media;
					debugStatus = 'Loading media data...';
					debugStatus = 'Complete!';
					setTimeout(() => {
						debugStatus = '';
					}, 2000);
				}
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
	async function handleInvite(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const userId = formData.get('userId');
		const watchlistId = $page.params.id;

		const success = await _inviteUser(userId, watchlistId);
		if (success) {
			event.target.reset();
			// Optional: Show success toast
		}
	}
	async function handleDelete(ID) {
		try {
			await _deleteMedia(ID);
			// Create a new array reference to trigger reactivity
			medias = [...medias.filter((media) => media.mediaID !== ID)];
		} catch (error) {
			console.error('Failed to delete media:', error);
		}
	}
</script>

<div class="flex flex-col gap-8 text-stone-50 ~px-2/6">
	<section id="add" class="text-stone-50">
		<section class="flex flex-wrap justify-between gap-3">
			<form onsubmit={handleSubmit} class="min-w-[320px] max-w-[360px] flex-1 font-archivo">
				<div class="flex flex-row gap-2">
					<input
						type="text"
						name="IMDbID"
						placeholder="IMDb ID or List Link"
						class="w-full rounded-lg bg-zinc-800 p-3 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
					/>
					<input type="hidden" name="ownerID" value={person?.id} />
					<button
						class="whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-sky-400 px-4 py-3 font-bold transition-opacity duration-300 hover:opacity-90"
					>
						Add Media
					</button>
				</div>
			</form>

			{#if permissions.didCreate}
				<form onsubmit={handleInvite} class="min-w-[320px] max-w-[360px] flex-1 font-archivo">
					<div class="flex flex-row gap-2">
						<input
							type="text"
							name="userId"
							placeholder="Enter Discord User ID"
							class="w-full rounded-lg bg-zinc-800 p-3 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
						/>
						<button
							class="whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-sky-400 px-4 py-3 font-bold transition-opacity duration-300 hover:opacity-90"
						>
							Invite User
						</button>
					</div>
				</form>
			{/if}
		</section>

		{#if debugStatus}
			<div class="font-mono text-sm text-green-400">
				{debugStatus}{#if debugStatus == 'Retrieving list'}{loadingDots}{/if}
				{#if currentProgress.total > 0}
					({currentProgress.current}/{currentProgress.total})
				{/if}
			</div>
		{/if}
	</section>

	{#if mostVoted}
		<div
			class="animate-border relative rounded-md border-2 border-transparent [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.amber.500)_86%,_theme(colors.amber.300)_90%,_theme(colors.amber.500)_94%,_theme(colors.slate.600/.48))_border-box]"
		>
			<svg
				class="absolute -left-5 -top-5 h-8 -rotate-45 fill-amber-500"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 576 512"
			>
				<path
					d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"
				/>
			</svg>
			<div class="rounded-md bg-zinc-800 p-4">
				<MediaCard media={mostVoted} />
			</div>
		</div>
	{/if}
	<section class="flex flex-col gap-4">
		{#each medias as media (media.mediaID)}
			<div
				class="rounded-md border-2 border-transparent bg-zinc-800 p-4 shadow-md shadow-stone-800 duration-500 ease-in-out hover:border-r-2 hover:[border-image:linear-gradient(to_bottom,transparent,theme(colors.blue.400),transparent)_1_100%_0_0]"
			>
				<MediaCard {media} />
			</div>
		{/each}
	</section>
</div>
