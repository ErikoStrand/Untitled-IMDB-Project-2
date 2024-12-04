<script lang="ts">
	import PartyNavbar from '$lib/PartyNavbar.svelte';
	let { children } = $props();
</script>

<PartyNavbar />
<main class="h-dvh pt-20">{@render children()}</main>
