<script>
	import { user } from '$lib/stores';
	import { _deleteWatchlist, _leaveWatchlist, _createWatchlist } from './+page.js';
	import { _formatRuntime, _getTimeAgo } from './[id]/[name]/+page.js';
	import { fly } from 'svelte/transition';
	const person = $derived($user);
	let showModal = $state(true);
	let { data } = $props();
	let watchlists = $state(data.watchlists);
	let confirmDelete = $state(null);

	async function handleDelete(ID) {
		if (confirmDelete === ID) {
			try {
				await _deleteWatchlist(ID);
				watchlists = watchlists.filter((w) => w.ID !== ID);
			} catch (error) {
				console.error('Failed to delete watchlist:', error);
			}
		} else {
			confirmDelete = ID;
			setTimeout(() => {
				if (confirmDelete === ID) {
					confirmDelete = null;
				}
			}, 3000);
		}
	}
	async function handleCreate(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		const result = await _createWatchlist(formData.get('name'), formData.get('ownerID'));

		if (result.success) {
			watchlists = result.watchlists;
			event.target.reset();
		}
	}
	// Update handleLeave to modify state
	async function handleLeave(watchlistId) {
		if (confirmDelete === watchlistId) {
			const success = await _leaveWatchlist(watchlistId, person.id);
			if (success) {
				// Remove watchlist from state with animation
				watchlists = watchlists.filter((w) => w.ID !== watchlistId);
			}
		} else {
			confirmDelete = watchlistId;
			setTimeout(() => {
				if (confirmDelete === watchlistId) {
					confirmDelete = null;
				}
			}, 3000);
		}
	}
	$inspect(watchlists);
</script>

<main class="flex flex-col gap-8 ~px-2/6">
	<section id="create" class="text-stone-50">
		<form onsubmit={handleCreate} class="flex flex-row gap-2 font-archivo">
			<input
				type="text"
				name="name"
				placeholder="Watchlist Name"
				class="rounded-lg bg-zinc-800 p-3 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
			/>
			<input type="hidden" name="ownerID" value={person?.id} />

			<button
				class="rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-sky-400 px-4 py-3 font-bold transition-opacity duration-300 hover:opacity-90"
			>
				Create
			</button>
		</form>
	</section>

	<section class="flex flex-col gap-4 font-archivo text-stone-50">
		{#each [{ title: 'Your Watchlists', items: watchlists.filter((w) => w.isOwner), color: 'blue', action: 'Delete', handler: handleDelete }, { title: 'Invited Watchlists', items: watchlists.filter((w) => !w.isOwner), color: 'green', action: 'Leave', handler: handleLeave }] as { title, items, color, action, handler }}
			{#if items.length > 0}
				<h2 class="text-3xl font-bold {title === 'Invited Watchlists' ? 'mt-8' : ''}">{title}</h2>
				{#each items as watchlist}
					<div
						in:fly={{ x: 50, duration: 300 }}
						out:fly={{ x: -50, duration: 200 }}
						class={`flex items-center gap-2 border-l-4 ${
							color === 'blue' ? 'border-blue-500' : 'border-green-500'
						} bg-zinc-800 shadow-md shadow-zinc-800`}
					>
						<a
							href="/watchlists/{watchlist.ID}/{watchlist.name}"
							class="flex min-h-32 flex-grow flex-col justify-between gap-4 p-4"
						>
							<div class="flex flex-col gap-2">
								<header>
									<h3 class="text-xl font-medium">{watchlist.name}</h3>
									<p class="space-x-1 text-sm text-gray-300">
										made by <span class="font-heebo text-blue-600">{watchlist.ownerName}</span>
										{_getTimeAgo(watchlist.createdAt)}
									</p>
								</header>
								<section class="flex flex-row items-center gap-2 text-sm text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										class="w-3 fill-gray-400"
										><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
											d="M192 64l0 64c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32zM82.7 207c-15.3 8.8-20.5 28.4-11.7 43.7l32 55.4c8.8 15.3 28.4 20.5 43.7 11.7l55.4-32c15.3-8.8 20.5-28.4 11.7-43.7l-32-55.4c-8.8-15.3-28.4-20.5-43.7-11.7L82.7 207zM288 192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-64 0zm64 160c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-64 0zM160 384l0 64c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32zM32 352c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-64 0z"
										/></svg
									>
									<p>{watchlist.mediaCount || 0} Things</p>
									<div class="flex items-center">
										{_formatRuntime(watchlist.totalRuntime)}
									</div>
								</section>
							</div>

							{#if watchlist.invitedUsers}
								<div class="flex items-center">
									<div class="flex -space-x-3">
										{#each watchlist.invitedUsers?.slice(0, 6) || [] as user}
											<img
												src="https://cdn.discordapp.com/avatars/{user.discordID}/{user.avatar}.png"
												alt={user.discordName}
												class="h-8 w-8 rounded-full border-2 border-zinc-800"
												title={user.discordName}
											/>
										{/each}
										{#if watchlist.invitedUsers.length > 6}
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-700 text-xs"
											>
												+{watchlist.invitedUsers.length - 6}
											</div>
										{/if}
									</div>
								</div>
							{/if}
						</a>
						<button
							class="m-2 self-end rounded-md {color === 'blue'
								? 'bg-red-500'
								: 'bg-zinc-600'} px-4 py-2"
							onclick={() => handler(watchlist.ID)}
						>
							{confirmDelete === watchlist.ID ? 'Sure?' : action}
						</button>
					</div>
				{/each}
			{/if}
		{/each}
	</section>
</main>
