<script lang="ts">
	import { browser } from '$app/environment';
	import { uploaded } from '$lib/stores';

	let { children } = $props();

	if (browser) {
		if (!$uploaded) {
			location.href = '/upload';
		}
	}
</script>

{@render children()}
