<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	import LoadingScreen from '$lib/LoadingScreen.svelte';
	let { children } = $props();
</script>

<LoadingScreen />
<Navbar />
{@render children()}
