<script>
	import { user } from '$lib/stores';
	const person = $derived($user);
</script>

<nav
	class="sticky top-0 z-50 mb-10 flex h-12 w-full flex-row items-center justify-between bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 drop-shadow-lg"
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
		class="flex flex-row gap-4 px-4 font-heebo text-base font-semibold tracking-wide text-stone-50"
	>
		{#if !person?.id}
			<li class="self-center rounded-md px-2 duration-200 ease-in-out hover:bg-zinc-700/50">
				<a
					href="/api/discord/auth"
					data-sveltekit-preload-data="off"
					class="block leading-10"
					title="Login">Login</a
				>
			</li>
		{:else}
			<li
				class="group relative self-center rounded-md px-2 duration-200 ease-in-out hover:bg-zinc-700/50"
			>
				<div class="flex flex-row gap-2">
					<h2 class="block leading-10">
						{person.username}
					</h2>
					<img
						class="h-8 self-center rounded-md"
						src="https://cdn.discordapp.com/avatars/{person.id}/{person.avatar}.png"
						alt="{person.usernames}s picture"
					/>
				</div>
				<a
					href="/api/discord/auth/signout"
					class="absolute right-[1px] rounded bg-red-500 px-3 py-1 text-base font-normal text-stone-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				>
					Leave
				</a>
			</li>
		{/if}
	</ul>
</nav>
