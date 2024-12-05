<script lang="ts">
	import { _handleSampleData } from '$lib/scripts/handleCSV';
	import { _handleFileUpload } from './+page';
</script>

<header class="mx-auto mt-8 max-w-screen-md text-center text-lg font-semibold text-stone-200">
	<p>
		To view your IMDb statistics, this website will need a copy of your ratings. If you are worried
		about personal information the file only contains data about the media you have rated.
	</p>
</header>
<div class="mx-auto mt-8 flex max-w-screen-md flex-col gap-3 px-1 sm:px-4">
	<section
		class="mb-4 flex min-h-[26rem] flex-col rounded-2xl bg-zinc-800 px-2 py-4 shadow-md shadow-stone-800 md:px-6"
	>
		<nav class="mb-4 flex flex-row justify-between">
			<div class="flex flex-col">
				<h1 class="text-2xl font-medium text-stone-50">Your Ratings</h1>
				<h3 class="text-base font-medium text-neutral-500">Public</h3>
			</div>
			<svg viewBox="0 0 500 500" width="60px" height="60px" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M 449.918 250.002 C 449.918 96.095 283.321 -0.095 150.042 76.856 C 88.188 112.57 50.084 178.573 50.084 250.002 C 50.084 403.906 216.681 500.096 349.959 423.144 C 411.814 387.43 449.918 321.428 449.918 250.002 Z M 3.949 250.002 C 3.949 60.579 208.992 -57.811 373.026 36.901 C 449.155 80.855 496.052 162.09 496.052 250.002 C 496.052 439.421 291.01 557.812 126.975 463.1 C 50.847 419.145 3.949 337.911 3.949 250.002 Z"
					style="fill: rgb(239, 68, 68)"
				/>
				<path
					d="M 250.001 292.948 C 230.314 292.948 218.009 312.213 227.852 327.624 C 232.421 334.776 240.864 339.182 250.001 339.182 C 269.688 339.182 281.992 319.918 272.148 304.507 C 267.58 297.355 259.138 292.948 250.001 292.948 Z M 250.001 226.9 C 230.314 226.9 218.009 246.164 227.852 261.575 C 232.421 268.728 240.864 273.134 250.001 273.134 C 269.688 273.134 281.992 253.87 272.148 238.458 C 267.58 231.306 259.138 226.9 250.001 226.9 Z M 275.575 183.969 C 275.575 166.174 254.263 155.052 237.213 163.95 C 229.301 168.079 224.426 175.71 224.426 183.969 C 224.426 201.764 245.738 212.887 262.788 203.989 C 270.7 199.859 275.575 192.228 275.575 183.969 Z"
					style="fill: rgb(231, 229, 228)"
				/>
			</svg>
		</nav>
		<article
			class="flex flex-col rounded-lg bg-gradient-to-b from-neutral-800 to-zinc-800 to-90% font-heebo"
		>
			<div class="px-4 pt-4 text-stone-300">1234 &#40;of 1234&#41; titles</div>
			<div
				class="flex flex-row items-center justify-end gap-1 px-4 text-sm text-stone-200 md:text-base"
			>
				<div class="mr-1 text-center text-xs font-medium md:mr-3 md:text-base">Filter by:</div>
				<form action="">
					<select class="rounded-md border-2 border-stone-600 bg-zinc-800" name="" id="">
						<option value="">Show All</option>
					</select>
				</form>
				<div class="mx-1 text-center text-xs font-medium md:mx-3 md:text-base">Sort by:</div>
				<form action="">
					<select class="rounded-md border-2 border-stone-600 bg-zinc-800" name="" id="">
						<option value="">Most Recent</option>
					</select>
				</form>
				<i class="fa-solid fa-arrows-up-down fa-xl ml-1 mr-2 text-neutral-400"></i>
				<i class="fa-solid fa-grip fa-xl text-neutral-400"></i>
			</div>
			<!--title, image, title, number, data. id etc.-->
			<div class="mb-2 mt-4 flex flex-1 flex-row px-4">
				<div class="mr-4 min-w-36 bg-neutral-700"></div>
				<!--media details-->
				<div class="flex flex-col">
					<div class="font-heebo font-bold text-stone-200">
						1.
						<a
							href="#top"
							class="pl-1 font-archivo text-lg font-semibold tracking-wide text-blue-500"
							>Look at the movie description</a
						><span class="ml-2 font-archivo text-neutral-400">&#40;1932&#41;</span>
					</div>
					<div class="mb-1 tracking-wider text-neutral-400 opacity-50">
						15 | 1 hr 53 min | Drama, Fantasy, Mystery
					</div>
					<div class="flex flex-row font-archivo text-stone-50">
						<i class="fa-solid fa-star mr-1 self-center text-blue-600"></i>
						<span class="relative -bottom-[2px] left-2">8</span>
					</div>
					<div class="mt-1 tracking-wider text-neutral-400 opacity-50">Rated on 16 Feb 2005</div>
					<div class="mt-2 flex flex-col gap-2 font-archivo tracking-wide text-stone-200">
						<div>
							If you are reading this I am happy because you made it this far, and I believe you can
							do great things in life so let's continue. To download your data visit
							<a
								target="_blank"
								rel="noopener"
								href="https://www.imdb.com/list/ratings?user"
								class="font-semibold text-yellow-500 underline underline-offset-1">your ratings</a
							>
							and click the 3 dots shows in the circle up above.
						</div>

						<div>
							Once you've done that click
							<span class="font-bold underline underline-offset-1">export</span>
							and save the file as "ratings.csv".
						</div>
					</div>
					<div class="mt-2 text-sm text-neutral-400 opacity-80">
						Director:
						<a
							href="https://github.com/ErikoStrand"
							class="font-archivo text-sm font-medium text-blue-500">Erik Strandberg</a
						>
					</div>
				</div>
			</div>
		</article>
	</section>

	<div class="mb-16 flex h-12 flex-col gap-4 text-center md:flex-row">
		<button
			class="rounded-xl bg-accent p-2 font-archivo text-2xl font-bold text-zinc-900 outline outline-2 outline-yellow-500 drop-shadow-lg md:w-2/3"
			onclick={() => {
				const fileInput = document.getElementById('file');
				if (fileInput) {
					fileInput.click();
				}
			}}
		>
			Upload Your Ratings
		</button>
		<input type="file" id="file" style="display:none" onchange={_handleFileUpload} />
		<button
			onclick={_handleSampleData}
			id="sampleButton"
			class="flex-1 rounded-xl border-2 border-stone-400 bg-zinc-800 p-2 font-archivo text-xl font-semibold text-stone-200 drop-shadow-lg"
		>
			Load Sample Data
		</button>
	</div>
</div>
