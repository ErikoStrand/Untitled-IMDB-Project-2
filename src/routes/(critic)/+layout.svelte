<script lang="ts">
	import Navbar from '$lib/Navbar.svelte';
	import LoadingScreen from '$lib/LoadingScreen.svelte';
	let { children } = $props();
</script>

<LoadingScreen />
<Navbar />
<main class="h-dvh pt-20">{@render children()}</main>
