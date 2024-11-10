<script>
	import { onMount } from 'svelte';
	import { _loadData } from '../../+page.js';
	import { _getNotWatched } from './+page.js';

	let { data } = $props();
	let episodes = $state({});
	// Group episodes by season
	let seasonMap = $derived(
		Object.values(episodes).reduce((acc, episode) => {
			const season = episode.season;
			if (!acc[season]) {
				acc[season] = [];
			}
			acc[season].push(episode);
			return acc;
		}, {})
	);

	// Get unique seasons sorted
	let seasons = $derived(
		Object.keys(seasonMap)
			.map(Number)
			.sort((a, b) => a - b)
	);

	// Set initial active tab to first available season (e.g., season 4)
	let activeTab = $state();

	function setActiveTab(season) {
		activeTab = season;
	}
	onMount(async () => {
		episodes = _loadData(data.showID);
		episodes = await _getNotWatched(data.showID, Object.keys(episodes));
		setActiveTab(seasons[0]);
	});
</script>

<div class="tabs-container">
	<div class="tabs-header">
		{#each seasons as season}
			<button
				class="tab-button"
				class:active={activeTab === season}
				onclick={() => setActiveTab(season)}
			>
				Season {season}
			</button>
		{/each}
	</div>

	<div class="tab-content">
		{#each seasonMap[activeTab] || [] as episode}
			<div class="episode-card">
				<h3>{episode.title}</h3>
				<div class="episode-details">
					<span>Episode {episode.episode}</span>
					<span>Rating: {episode.rating}/10</span>
					<span>{episode.runtime} min</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.tabs-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.tabs-header {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.tab-button {
		padding: 0.75rem 1.5rem;
		border: none;
		background: none;
		cursor: pointer;
		font-weight: 500;
		color: #64748b;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.tab-button.active {
		color: #0f172a;
		border-bottom: 2px solid #3b82f6;
	}

	.tab-content {
		display: grid;
		gap: 1rem;
	}

	.episode-card {
		padding: 1rem;
		border-radius: 0.5rem;
		background-color: #f8fafc;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.episode-details {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
		color: #64748b;
		font-size: 0.875rem;
	}

	h3 {
		margin: 0;
		color: #0f172a;
		font-size: 1.125rem;
	}
</style>
