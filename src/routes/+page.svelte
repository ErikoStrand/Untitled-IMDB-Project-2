<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import { _handleFileUpload } from './+page';
	import { _handleSampleData } from '$lib/scripts/handleCSV.js';

	let showModal = $state(false);
</script>

<div id="flying-notes-container"></div>
<div class="mx-auto mt-28 flex max-w-screen-md flex-col justify-center pb-48 pl-6 pr-6 sm:pb-0">
	<h1
		class="text-center font-archivo text-7xl font-extrabold leading-tight tracking-tight text-stone-100 md:text-8xl"
	>
		STATS FOR <br />
		<div class="inline-grid">
			<span
				class="z-20 col-start-1 row-start-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
				>IMDb.</span
			>
			<span
				aria-hidden="true"
				class="z-10 col-start-1 row-start-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 opacity-30 blur-xl"
			></span>
		</div>
		<br />
	</h1>
	<p
		class="mt-4 max-w-[500px] self-center text-center font-archivo text-lg font-medium text-stone-400"
	>
		Ever wondered how many hours you've actually spent watching movies and tv-shows? Download your
		IMDb ratings and get your IMdb statistics in under four minutes!
	</p>
	<div class="mt-8 flex max-w-[400px] flex-col gap-4 self-center">
		<div class="flex flex-row gap-4 rounded-xl bg-zinc-800 p-6 shadow-md shadow-stone-800">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 fill-stone-300"
				viewBox="0 0 640 512"
			>
				<path
					d="M544 248v3.3l69.7-69.7c21.9-21.9 21.9-57.3 0-79.2L535.6 24.4c-21.9-21.9-57.3-21.9-79.2 0L416.3 64.5c-2.7-.3-5.5-.5-8.3-.5H296c-37.1 0-67.6 28-71.6 64H224V248c0 22.1 17.9 40 40 40s40-17.9 40-40V176c0 0 0-.1 0-.1V160l16 0 136 0c0 0 0 0 .1 0H464c44.2 0 80 35.8 80 80v8zM336 192v56c0 39.8-32.2 72-72 72s-72-32.2-72-72V129.4c-35.9 6.2-65.8 32.3-76 68.2L99.5 255.2 26.3 328.4c-21.9 21.9-21.9 57.3 0 79.2l78.1 78.1c21.9 21.9 57.3 21.9 79.2 0l37.7-37.7c.9 0 1.8 .1 2.7 .1H384c26.5 0 48-21.5 48-48c0-5.6-1-11-2.7-16H432c26.5 0 48-21.5 48-48c0-12.8-5-24.4-13.2-33c25.7-5 45.1-27.6 45.2-54.8v-.4c-.1-30.8-25.1-55.8-56-55.8c0 0 0 0 0 0l-120 0z"
				/>
			</svg>
			<a
				href="/upload"
				class="font-archivo text-xl font-bold leading-6 tracking-wide text-stone-200"
				>I'm new here! Show me how to get my data.</a
			>
		</div>
		<div class="flex flex-row gap-4 rounded-xl bg-zinc-800 p-6 shadow-md shadow-stone-800">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 fill-stone-300"
				viewBox="0 0 640 512"
			>
				<path
					d="M192 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8 352V352h16v96H184zm-64 0H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H152h80H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H264V256.9l28.6 47.5c9.1 15.1 28.8 20 43.9 10.9s20-28.8 10.9-43.9l-58.3-97c-17.4-28.9-48.6-46.6-82.3-46.6H177.1c-33.7 0-64.9 17.7-82.3 46.6l-58.3 97c-9.1 15.1-4.2 34.8 10.9 43.9s34.8 4.2 43.9-10.9L120 256.9V448zM598.6 121.4l-80-80c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L464 141.3 464 384c0 17.7 14.3 32 32 32s32-14.3 32-32V141.3l25.4 25.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"
				/>
			</svg>
			<button
				onclick={() => (showModal = true)}
				class="text-left font-archivo text-xl font-bold leading-6 tracking-wide text-stone-200"
				>I already got my data. Let me upload it.</button
			>
		</div>
		<Modal bind:showModal>
			{#snippet header()}
				<header class="text-l mb-4 font-archivo font-light leading-6 tracking-wide text-stone-200">
					<h1 class="text-xl font-medium">Hello!</h1>
					<p>
						When uploading your ratings, make sure the file is called ratings.csv otherwise the
						program will not work.
					</p>
				</header>
			{/snippet}
			<div>
				<div class="flex flex-row gap-4 text-center">
					<button
						class="w-full rounded-xl bg-accent p-2 text-xl font-semibold text-zinc-800 outline outline-yellow-500 drop-shadow-lg"
						onclick={() => {
							const fileInput = document.getElementById('file');
							if (fileInput) {
								fileInput.click();
							}
						}}
					>
						Upload Ratings
					</button>
					<input type="file" id="file" style="display:none" onchange={_handleFileUpload} />
				</div>
			</div>
		</Modal>

		<div class="flex flex-row gap-4 rounded-xl bg-zinc-800 p-6 shadow-md shadow-stone-800">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 fill-stone-300"
				viewBox="0 0 576 512"
			>
				<path
					d="M224 24V80H168c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h56v56c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V176h56c13.3 0 24-10.7 24-24V104c0-13.3-10.7-24-24-24H320V24c0-13.3-10.7-24-24-24H248c-13.3 0-24 10.7-24 24zM559.7 392.2c17.8-13.1 21.6-38.1 8.5-55.9s-38.1-21.6-55.9-8.5L392.6 416H272c-8.8 0-16-7.2-16-16s7.2-16 16-16h16 64c17.7 0 32-14.3 32-32s-14.3-32-32-32H288 272 193.7c-29.1 0-57.3 9.9-80 28L68.8 384H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H192 352.5c29 0 57.3-9.3 80.7-26.5l126.6-93.3zm-367-8.2l.9 0 0 0c-.3 0-.6 0-.9 0z"
				/>
			</svg>
			<button
				onclick={_handleSampleData}
				class="text-left font-archivo text-xl font-bold leading-6 tracking-wide text-stone-200"
				id="sampleButton"
			>
				Show me a preview of what it looks like.
			</button>
		</div>
	</div>
</div>
