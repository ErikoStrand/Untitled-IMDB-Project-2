<script>
	import { loading } from '$lib/stores';
	import { onMount } from 'svelte';

	let showLoader = false;

	$: {
		if ($loading) {
			showLoader = true;
		} else {
			showLoader = false;
		}
	}
</script>

{#if showLoader}
	<div class="loading-screen bg-zinc-900">
		<div class="loader">
			<div class="spinner"></div>
			<span>Loading...</span>
		</div>
	</div>
{/if}

<style>
	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.loader {
		text-align: center;
		color: white;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		margin: 0 auto 1rem;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
