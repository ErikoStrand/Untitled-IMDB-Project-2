<script>
	import { user } from '$lib/stores';
	import { _deleteWatchlist } from './+page.js';
	const person = $derived($user);
	let showModal = $state(true);
	let { data } = $props();
	let watchlists = $state(data.watchlists);
	let confirmDelete = $state(null);
	$inspect(watchlists);

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
</script>

<main class="flex flex-col gap-8">
	<section id="create" class="text-stone-50 ~px-2/6">
		<form method="POST" class="flex flex-row gap-2 font-archivo">
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

	<section
		id="yourWatchlists"
		class="flex flex-col gap-4 font-archivo text-stone-50 ~px-2/6 *:rounded-xl"
	>
		<h1 class="~text-3xl/5xl">Your Watchlists</h1>
		{#each watchlists as watchlist}
			<div class="flex items-center gap-2 bg-zinc-800 shadow-md shadow-zinc-800">
				<a
					href="/watchlists/{watchlist.ID}/{watchlist.name}"
					class="h-32 flex-grow p-2 font-medium"
				>
					<h1>{watchlist.name}</h1>
				</a>
				<button
					class=" m-2 self-end rounded-md bg-red-500 px-4 font-medium transition-colors duration-200 hover:bg-red-600"
					onclick={() => handleDelete(watchlist.ID)}
				>
					{confirmDelete === watchlist.ID ? 'Sure?' : 'Delete'}
				</button>
			</div>
		{/each}
	</section>
</main>
