<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/stores';
	import LoadingScreen from '$lib/LoadingScreen.svelte';
	let { children } = $props();
</script>

<LoadingScreen />
<Navbar />
{@render children()}
