<script>
	import { user } from '$lib/stores';
	const person = $derived($user);
	let showModal = $state(true);
	let../../[slug]/$types.js { data } = $props();
	let watchlists = $state(data.watchlists);
</script>

<section id="add" class="text-stone-50 ~px-2/6">
	<form method="POST" class="flex flex-row gap-2 font-archivo">
		<input
			type="text"
			name="IMDbID"
			placeholder="IMDb ID"
			class="rounded-lg bg-zinc-800 p-3 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
		/>
		<input type="hidden" name="ownerID" value={person?.id} />
		<input type="hidden" name="username" value={person?.global_name} />

		<button
			class="rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-sky-400 px-4 py-3 font-bold transition-opacity duration-300 hover:opacity-90"
		>
			Add Movie
		</button>
	</form>
</section>
