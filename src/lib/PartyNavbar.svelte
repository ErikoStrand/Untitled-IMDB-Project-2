<script>
	import { uploaded } from '$lib/stores';
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
		class="flex flex-row gap-4 px-6 font-heebo text-base font-semibold tracking-wide text-stone-50"
	>
		<li class="self-center rounded-md px-2 duration-200 ease-in-out hover:bg-zinc-700/50">
			<a href="/feedback" class="block leading-10" title="Feedback">Login</a>
		</li>
	</ul>
</nav>
