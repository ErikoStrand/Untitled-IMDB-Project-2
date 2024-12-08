<script>
	import { fly } from 'svelte/transition';
	import { user } from '$lib/stores';
	const person = $derived($user);
	let userMenu = $state(false);

	function handleClick(event) {
		if (!event.target.closest('.profile-area')) {
			userMenu = false;
		}
	}
	let showToast = $state(false);

	function copyId() {
		navigator.clipboard.writeText(person.id);
		showToast = true;
		setTimeout(() => (showToast = false), 2000);
	}
	$effect(() => {
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	});

	function toggleUserMenu(event) {
		event.stopPropagation(); // Prevent document click from immediately closing
		userMenu = !userMenu;
	}
</script>

<nav
	class="fixed left-0 right-0 top-0 z-50 mb-10 flex h-12 w-full flex-row items-center justify-between bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 drop-shadow-lg"
>
	<div>
		<a
			class="text-stone-0 block px-4 font-heebo text-lg font-bold leading-10 text-stone-50"
			href="https://github.com/ErikoStrand"
			title="Github"
			target="_blank"
			rel="noopener">Erik*</a
		>
	</div>
	<ul
		class="flex flex-row gap-2 px-4 font-heebo text-base font-semibold tracking-wide text-stone-50"
	>
		{#if !person?.id}
			<li class="self-center rounded-md px-2 duration-200 ease-in-out hover:bg-zinc-700/50">
				<a
					href="/api/discord/auth"
					data-sveltekit-preload-data="off"
					class="flex flex-row gap-2 fill-stone-50 leading-10"
					title="Login"
					>Login <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="25px"
						><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
							d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
						/></svg
					></a
				>
			</li>
		{:else}
			<li class="self-center rounded-md px-2 duration-200 ease-in-out hover:bg-zinc-700/50">
				<a href="/watchlists" class="block leading-10" title="Watchlists">Watchlists</a>
			</li>
			<li class="profile-area relative self-center rounded-md px-2">
				<button class="flex cursor-pointer flex-row gap-2" onclick={toggleUserMenu}>
					<h2 class="block leading-10">
						{person.username}
					</h2>
					<img
						class="h-8 self-center rounded-md"
						src="https://cdn.discordapp.com/avatars/{person.id}/{person.avatar}.png"
						alt="{person.username}s picture"
					/>
				</button>
				{#if userMenu}
					<div
						class="absolute right-[1px] top-11 flex flex-col items-end gap-2 rounded-xl bg-zinc-800"
					>
						<button
							class="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-zinc-700"
							onclick={copyId}
						>
							<span class="whitespace-nowrap text-sm text-gray-400">Your ID:</span>
							<code class="rounded bg-zinc-900 px-2 py-1 font-mono text-blue-400">
								{person.id}
							</code>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 text-gray-400"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
								/>
							</svg>
						</button>
						{#if showToast}
							<div
								class="fixed bottom-1 right-4 rounded-lg bg-zinc-800 px-4 py-2 text-white shadow-lg"
								transition:fly={{ y: 10, duration: 300 }}
							>
								ID copied to clipboard!
							</div>
						{/if}
						<a
							href="/api/discord/auth/signout"
							class="rounded bg-red-500 px-3 py-1 text-base font-normal text-stone-50 transition-colors hover:bg-red-600"
						>
							Leave
						</a>
					</div>
				{/if}
			</li>
		{/if}
	</ul>
</nav>
