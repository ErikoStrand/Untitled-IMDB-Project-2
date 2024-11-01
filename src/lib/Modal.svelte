<script>
	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	class="min-h-72 w-screen max-w-xl appearance-none rounded-xl bg-zinc-800 p-4 shadow-md shadow-stone-800 backdrop:backdrop-blur-md"
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	<div class="flex min-h-72 flex-col justify-between">
		<div>
			{@render header?.()}
			{@render children?.()}
		</div>
		<!-- svelte-ignore a11y_autofocus -->
		<div class="flex justify-end">
			<button
				autofocus
				onclick={() => dialog.close()}
				class="font-archivo w-24 rounded-xl border-2 border-red-400 bg-red-500 p-2 text-xl font-semibold text-stone-100"
				>Close</button
			>
		</div>
	</div>
</dialog>

<style>
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
