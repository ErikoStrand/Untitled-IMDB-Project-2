<script>
	let { data } = $props();
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	onMount(() => {
		if (data.user == null) {
			invalidateAll();
		}
	});
</script>

{#if data.user != null}
	<h1 class="text-stone-50">{data.user.username}</h1>
{/if}
