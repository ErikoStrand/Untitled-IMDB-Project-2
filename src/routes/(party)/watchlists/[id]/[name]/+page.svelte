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
		_inviteUser
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
		if (medias) {
			loadMediaData(medias);
		}
	});

	setContext('media', {
		images,
		descriptions,
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

	async function loadMediaData(mediaList) {
		await _loadImages(mediaList, 'w92', 'w780', true, (id, result) => {
			images[id] = result;
		});

		await _loadDescriptions(mediaList, (id, description) => {
			descriptions[id] = description;
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

	<section class="flex flex-col gap-4">
		{#each medias as media (media.mediaID)}
			<MediaCard {media} />
		{/each}
	</section>
</div>
