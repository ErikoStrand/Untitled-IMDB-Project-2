<script>
	import { user } from '$lib/stores';
	import { _deleteWatchlist, _leaveWatchlist, _createWatchlist } from './+page.js';
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
		<h2 class="text-3xl font-bold">Your Watchlists</h2>
		{#each watchlists as watchlist}
			{#if watchlist.isOwner}
				<div
					class="flex items-center gap-2 border-l-4 border-blue-500 bg-zinc-800 shadow-md shadow-zinc-800"
				>
					<a href="/watchlists/{watchlist.ID}/{watchlist.name}" class="h-32 flex-grow p-4">
						<h3 class="text-xl font-medium">{watchlist.name}</h3>
					</a>
					<button
						class="m-2 self-end rounded-md bg-red-500 px-4 py-2"
						onclick={() => handleDelete(watchlist.ID)}
					>
						{confirmDelete === watchlist.ID ? 'Sure?' : 'Delete'}
					</button>
				</div>
			{/if}
		{/each}

		<h2 class="mt-8 text-3xl font-bold">Invited Watchlists</h2>
		{#each watchlists as watchlist}
			{#if !watchlist.isOwner}
				<div
					class="flex items-center gap-2 border-l-4 border-green-500 bg-zinc-800 shadow-md shadow-zinc-800"
				>
					<a href="/watchlists/{watchlist.ID}/{watchlist.name}" class="h-32 flex-grow p-4">
						<h3 class="text-xl font-medium">{watchlist.name}</h3>
					</a>
					<button
						class="m-2 self-end rounded-md bg-zinc-600 px-4 py-2"
						onclick={() => handleLeave(watchlist.ID)}
					>
						{confirmDelete === watchlist.ID ? 'Sure?' : 'Leave'}
					</button>
				</div>
			{/if}
		{/each}
	</section>
</main>
