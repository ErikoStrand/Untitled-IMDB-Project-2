<script>
	let { data } = $props();
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores.js';

	$effect(() => {
		if (data.user != null) {
			user.set(data.user);
		} else {
			user.set(null);
		}
	});

	onMount(() => {
		if (data.user == null) {
			invalidateAll();
		}
	});
</script>

<div class="-mt-12 flex h-full max-w-screen-md items-center pl-2 text-stone-50 sm:pb-0 md:pl-6">
	<div class="flex flex-col gap-2">
		<h1
			class=" flex flex-row gap-2 text-center font-archivo text-7xl font-extrabold tracking-tight text-stone-100 md:text-8xl"
		>
			Critic <br />
			<div class="inline-grid">
				<span
					class="z-20 col-start-1 row-start-1 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 bg-clip-text text-transparent"
					>Party.</span
				>
				<span
					aria-hidden="true"
					class="z-10 col-start-1 row-start-1 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 opacity-30 blur-xl"
				></span>
			</div>
			<br />
		</h1>
		<section id="description" class="font-archivo text-base font-medium tracking-wide md:text-lg">
			<p>Create your own watchlists, Add media.</p>
			<p>Vote on what you want to watch, or randomize if you are feeling lucky</p>
		</section>
		<a
			href="api/discord/auth"
			class="mt-4 self-start rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-sky-400 p-4 py-3 font-archivo font-bold text-stone-50 transition-opacity duration-300 hover:opacity-90"
			>Get Started With Discord</a
		>
	</div>
</div>
