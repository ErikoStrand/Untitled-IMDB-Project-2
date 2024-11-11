<script>
	import { _goBack } from '../+page';

	let { children } = $props();
</script>

<button
	class="mb-1 ml-4 flex flex-row gap-1 rounded-full bg-amber-300 fill-zinc-900 px-2 py-1 font-archivo font-medium"
	onclick={_goBack}
	><svg class="self-center" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 320 512"
		><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
			d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
		/></svg
	>Back
</button>
{@render children()}
