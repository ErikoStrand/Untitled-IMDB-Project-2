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

{#if data.user != null}
	<h1>{data.user.username}</h1>
	{console.log('store', $user)}
{/if}
