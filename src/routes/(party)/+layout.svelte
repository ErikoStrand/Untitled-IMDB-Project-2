<script lang="ts">
	import PartyNavbar from '$lib/PartyNavbar.svelte';
	let { children } = $props();
</script>

<PartyNavbar />
{@render children()}
