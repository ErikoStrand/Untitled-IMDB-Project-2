<script>
	import Modal from '$lib/Modal.svelte';
	import { user } from '$lib/stores';
	const person = $derived($user);
	let showModal = $state(true);
</script>

<section id="create" class="px-6 text-stone-50">
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
