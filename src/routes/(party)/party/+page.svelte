<script>
	let { data } = $props();
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	onMount(() => {
		if (data.user == null) {
			invalidateAll();
			console.log(data);
		}
	});
</script>
