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
	<div class="loading-screen flex flex-col bg-zinc-900">
		<div class="wave-loader">
			{#each Array(15) as _, i}
				<div
					class="person"
					style="--delay: {i * 0.1}s; --height: {Math.random() * 50 + 30}px"
				></div>
			{/each}
		</div>
		<div class="mt-6 animate-pulse text-2xl text-stone-50">Loading...</div>
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
		z-index: 100;
		overflow: hidden;
	}

	.wave-loader {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		width: 100%;
		height: 300px;
		position: relative;
	}

	.person {
		width: 20px;
		height: var(--height);
		background-color: #e74c3c;
		margin: 0 5px;
		transform-origin: bottom center;
		opacity: 0;
		transform: scale(0.5) translateY(50px);
		animation:
			smooth-appear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
			continuous-wave 1.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
		animation-delay: var(--delay), calc(0.8s + var(--delay));
	}

	.loading-text {
		position: absolute;
		bottom: -50px;
		color: white;
		font-size: 1.5rem;
		opacity: 0;
		transform: translateY(20px);
		animation: pulse 1.5s infinite 1.5s;
	}

	@keyframes smooth-appear {
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes continuous-wave {
		0% {
			transform: translateY(0%) scale(1);
		}
		100% {
			transform: translateY(25%) scale(1);
		}
		0% {
			transform: translateY(0%) scale(1);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(0.95);
		}
	}
</style>
