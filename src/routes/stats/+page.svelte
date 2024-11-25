<script>
	import { onMount } from 'svelte';
	import { _loadData, _nFormatter, _loadCharts, _getFact } from './+page.js';
	import { browser } from '$app/environment';
	import NumberFlow from '@number-flow/svelte';

	let movies = $state({
		totalMedia: 0,
		totalWatchtimeMinutes: 0,
		totalWatchtimeHours: 0,
		totalDirectors: 0,
		totalRating: 0,
		averageRating: 0,
		totalRatingIMDB: 0,
		averageRatingIMDB: 0,
		perYear: {}, // year: yyyy, count: int
		perMonth: {}, // date: yyyy-mm, count: int
		genres: {}, //genre: int
		directors: {
			'Why are you here': 5,
			'go upload your ratings': 4,
			'Nothing Magical Wont happen': 3,
			'I swear': 2,
			'Really I promise you': 1,
			"I guess that's it then": 0
		}, // director: count
		averageRatingPerMonth: {},
		ratingPerMonth: {},
		ratingsPerScore: {} //10: int, 9: int, 8: int etc
	});

	let generalData = $state({
		streak: { highestStreak: 10, currentStreak: 0, startDate: '', endDate: '' },
		numVotes: {
			highest: { title: '', votes: 100 },
			lowest: { title: '', votes: 100000 }
		},
		titleData: {
			longest: { title: 'shrt', char: 0 },
			shortest: { title: 'placeholder', char: 0 }
		},
		mediaPerReleaseYear: {},
		totalMedia: 0,
		totalRating: 0,
		totalAverageRating: 0,
		averageMediaPerWeek: 0,
		averageMediaPerMonth: 0,
		monthsSinceStart: 0,
		weeksSinceStart: 0
	});

	let shows = $state({
		totalMedia: 0,
		totalWatchtimeMinutes: 0,
		totalWatchtimeHours: 0,
		totalRating: 0,
		totalRatingIMDB: 0,
		averageRating: 0,
		averageRatingIMDB: 0,
		perYear: {},
		ratingsPerScore: {},
		genres: {}
	});
	let fact = $state({});
	let done = $state(false);
	onMount(async () => {
		generalData = _loadData('generalData');
		movies = _loadData('movies');
		shows = _loadData('shows');
		$inspect(shows);

		_loadCharts();
		fact = await _getFact();
		done = true;
	});
	async function newFact() {
		fact = await _getFact();
	}
</script>

<div class="relative mx-auto mb-32 max-w-screen-lg pl-4 pr-4 ~text-sm/base">
	<header class="mb-2 flex flex-col items-end pt-4 lg:flex-row">
		<div id="slogan" class="relative mb-4 flex flex-col">
			<h1
				class="text-left font-quicksand text-4xl font-extrabold leading-tight tracking-wider text-stone-50"
			>
				Your
				<div class="inline-grid">
					<span
						class="z-20 col-start-1 row-start-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
						>IMDb</span
					>
					<span
						aria-hidden="true"
						class="z-10 col-start-1 row-start-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 opacity-30 blur-xl"
					></span>
				</div>
				Statistics
			</h1>
			<h2 class="inline-block font-quicksand text-2xl font-bold tracking-wider text-gray-400">
				View how you spend your time
			</h2>
		</div>
		<div
			class="ml-auto flex flex-row items-center gap-3 font-archivo text-3xl font-bold tracking-wide text-stone-50"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				height="40px"
				class="fill-stone-50"
				><!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
					d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"
				/></svg
			>
			<h2>General</h2>
		</div>
	</header>

	<section
		class="m-0 mb-4 grid grid-flow-dense grid-cols-2 gap-4 drop-shadow-md lg:grid-cols-4 lg:gap-8"
	>
		<div
			class="relative col-span-2 row-span-2 flex min-h-48 flex-col gap-1 overflow-hidden rounded-xl bg-zinc-800 p-4 shadow-md shadow-zinc-800 lg:min-h-96"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="absolute -bottom-28 -right-28 w-72 fill-zinc-900 opacity-40 lg:-left-28"
				viewBox="0 0 512 512"
			>
				<path
					d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
				/>
			</svg>
			<div class="flex flex-col font-archivo text-xl font-semibold tracking-wider text-gray-400">
				<div class="inline-block font-mono text-8xl font-extrabold text-stone-50">
					<NumberFlow
						class="h-8"
						format={{ useGrouping: false }}
						value={movies.totalWatchtimeHours + shows.totalWatchtimeHours}
					/>
				</div>
				Hours watched in total.
			</div>
			<div
				class="flex items-center gap-2 font-heebo text-lg font-semibold tracking-normal text-gray-500"
			>
				That's
				<span class="font-mono text-xl font-extrabold text-gray-400">
					{_nFormatter((movies.totalWatchtimeHours + shows.totalWatchtimeHours) / 24, 0)}
				</span>
				Days or
				<span id="totalWatchtimeProcent" class="font-mono text-xl font-extrabold text-lime-600">
					{_nFormatter(
						((movies.totalWatchtimeHours + shows.totalWatchtimeHours) / 8765.81277) * 100,
						1
					)}%
				</span>
				of a year.
			</div>
		</div>

		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div id="totalMedia" class="font-mono text-5xl font-extrabold text-stone-50">
				{generalData.totalMedia}
			</div>
			<h2 class=" font-archivo font-semibold tracking-wider text-gray-400">Media Watched</h2>
			<div>
				<div
					id="totalAverageRating"
					class="inline-block font-mono text-5xl font-extrabold text-stone-50"
				>
					{_nFormatter(generalData.totalAverageRating, 1)}
				</div>
				<div class="inline-block font-mono text-xl text-stone-50">/10</div>
			</div>
			<h2 class=" font-archivo font-semibold tracking-wider text-gray-400">Average Rating</h2>
		</div>
		<div class="relative row-span-2 min-h-48 overflow-hidden rounded-xl bg-zinc-300 p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="absolute -right-32 -top-28 h-72 rotate-12 overflow-hidden fill-zinc-200"
				viewBox="0 0 576 512"
			>
				<path
					d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
				/>
			</svg>
			<div class="flex h-full flex-col justify-between">
				<div class="z-20 flex flex-row justify-between font-mono text-zinc-800">
					<div class="">
						<div>{fact.category}</div>
						<div>{fact.ID}/200</div>
					</div>
					<button
						class="h-7 rounded-xl bg-gray-200 px-2 duration-150 ease-in-out hover:bg-gray-400"
						onclick={newFact}>new</button
					>
				</div>
				<div>
					<div id="factfact" class="flex flex-row gap-2">
						<h1 class=" font-heebo text-4xl font-semibold tracking-wider text-zinc-700">Fact</h1>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							width="20px"
							class="fill-zinc-700"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M464 6.1c9.5-8.5 24-8.1 33 .9l8 8c9 9 9.4 23.5 .9 33l-85.8 95.9c-2.6 2.9-4.1 6.7-4.1 10.7l0 21.4c0 8.8-7.2 16-16 16l-15.8 0c-4.6 0-8.9 1.9-11.9 5.3L100.7 500.9C94.3 508 85.3 512 75.8 512c-8.8 0-17.3-3.5-23.5-9.8L9.7 459.7C3.5 453.4 0 445 0 436.2c0-9.5 4-18.5 11.1-24.8l111.6-99.8c3.4-3 5.3-7.4 5.3-11.9l0-27.6c0-8.8 7.2-16 16-16l34.6 0c3.9 0 7.7-1.5 10.7-4.1L464 6.1zM432 288c3.6 0 6.7 2.4 7.7 5.8l14.8 51.7 51.7 14.8c3.4 1 5.8 4.1 5.8 7.7s-2.4 6.7-5.8 7.7l-51.7 14.8-14.8 51.7c-1 3.4-4.1 5.8-7.7 5.8s-6.7-2.4-7.7-5.8l-14.8-51.7-51.7-14.8c-3.4-1-5.8-4.1-5.8-7.7s2.4-6.7 5.8-7.7l51.7-14.8 14.8-51.7c1-3.4 4.1-5.8 7.7-5.8zM87.7 69.8l14.8 51.7 51.7 14.8c3.4 1 5.8 4.1 5.8 7.7s-2.4 6.7-5.8 7.7l-51.7 14.8L87.7 218.2c-1 3.4-4.1 5.8-7.7 5.8s-6.7-2.4-7.7-5.8L57.5 166.5 5.8 151.7c-3.4-1-5.8-4.1-5.8-7.7s2.4-6.7 5.8-7.7l51.7-14.8L72.3 69.8c1-3.4 4.1-5.8 7.7-5.8s6.7 2.4 7.7 5.8zM208 0c3.7 0 6.9 2.5 7.8 6.1l6.8 27.3 27.3 6.8c3.6 .9 6.1 4.1 6.1 7.8s-2.5 6.9-6.1 7.8l-27.3 6.8-6.8 27.3c-.9 3.6-4.1 6.1-7.8 6.1s-6.9-2.5-7.8-6.1l-6.8-27.3-27.3-6.8c-3.6-.9-6.1-4.1-6.1-7.8s2.5-6.9 6.1-7.8l27.3-6.8 6.8-27.3c.9-3.6 4.1-6.1 7.8-6.1z"
							/></svg
						>
					</div>
					<p class="font-archivo font-medium text-zinc-900">
						{fact.description}
					</p>
				</div>
			</div>
		</div>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div class="flex flex-row items-center gap-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 576 512"
					height="32px"
					class="fill-yellow-500"
					><!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
						d="M400 0L176 0c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8L24 64C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9L192 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-26.1 0C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24L446.4 64c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112l84.4 0c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6l84.4 0c-5.1 66.3-31.1 111.2-63 142.3z"
					/></svg
				>
				<div id="highestStreak" class="font-mono text-5xl font-extrabold text-stone-50">
					{generalData.streak.highestStreak}
				</div>
			</div>
			<h2 class=" font-archivo font-semibold tracking-wider text-gray-400">Highest Streak</h2>
			<div class="ml-1 flex flex-row items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 384 512"
					height="36px"
					class="fill-red-600"
					><!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
						d="M153.6 29.9l16-21.3C173.6 3.2 180 0 186.7 0C198.4 0 208 9.6 208 21.3V43.5c0 13.1 5.4 25.7 14.9 34.7L307.6 159C356.4 205.6 384 270.2 384 337.7C384 434 306 512 209.7 512H192C86 512 0 426 0 320v-3.8c0-48.8 19.4-95.6 53.9-130.1l3.5-3.5c4.2-4.2 10-6.6 16-6.6C85.9 176 96 186.1 96 198.6V288c0 35.3 28.7 64 64 64s64-28.7 64-64v-3.9c0-18-7.2-35.3-19.9-48l-38.6-38.6c-24-24-37.5-56.7-37.5-90.7c0-27.7 9-54.8 25.6-76.9z"
					/></svg
				>
				<div id="currentStreak" class="font-mono text-5xl font-extrabold text-stone-50">
					{generalData.streak.currentStreak}
				</div>
			</div>
			<h2 class="font-archivo font-semibold tracking-wider text-gray-400">Current Streak</h2>
		</div>
		<div class="col-span-2 max-h-48 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Media Per Release Year
			</h2>
			<div class="max-h-48">
				<canvas id="mediaPerReleaseYear" class="p-1"></canvas>
			</div>
		</div>

		<div
			class="flex h-48 flex-col justify-center gap-4 rounded-xl bg-zinc-800 p-4 px-6 shadow-md shadow-zinc-800 lg:col-span-2"
		>
			<div id="longest flex gap-1">
				<h2 class="font-archivo text-sm font-normal tracking-wider text-gray-300">Longest Title</h2>
				<a
					href="https://www.imdb.com/title/{generalData.titleData.longest.ID}"
					id="longestTitle"
					class="line-clamp-2 font-mono font-semibold text-gray-300"
					target="_blank"
					rel="noopener"
				>
					{generalData.titleData.longest.title}
				</a>
				<p class="font-archivo text-sm text-gray-400">
					+{(generalData.titleData.longest.char / generalData.titleData.shortest.char) * 100}%
					Longer
				</p>
			</div>
			<div id="shortest">
				<h2 class=" font-archivo text-sm font-normal tracking-wider text-gray-300">
					Shortest Title
				</h2>
				<a
					href="https://www.imdb.com/title/{generalData.titleData.shortest.ID}"
					id="shortestTitle"
					class="line-clamp-2 font-mono font-semibold text-gray-300"
					target="_blank"
					rel="noopener"
				>
					{generalData.titleData.shortest.title}
				</a>
			</div>
		</div>
		<div
			class="flex h-48 flex-col justify-center gap-4 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800 lg:col-span-2"
		>
			<div id="most" class="">
				<div class="flex flex-row items-center gap-2">
					<h2 class=" font-archivo text-sm font-normal tracking-wider text-gray-300">Most Votes</h2>
					<div class="flex flex-row items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 320 512"
							width="15px"
							class="fill-green-500"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"
							/></svg
						>
						<div id="mostVotes" class="font-mono text-lg font-extrabold text-gray-300">
							{_nFormatter(generalData.numVotes.highest.votes)}
						</div>
					</div>
				</div>
				<a
					href="https://www.imdb.com/title/{generalData.numVotes.highest.ID}"
					id="mostVotesTitle"
					class="line-clamp-1 font-mono font-semibold text-gray-300"
				>
					{generalData.numVotes.highest.title}
				</a>
			</div>

			<div id="most" class="">
				<div class="flex flex-row items-center gap-2">
					<h2 class=" font-archivo text-sm font-normal tracking-wider text-gray-300">
						Least Votes
					</h2>
					<div class="flex flex-row items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 320 512"
							width="15px"
							class="rotate-180 fill-red-500"
							><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"
							/></svg
						>
						<div id="mostVotes" class="font-mono text-lg font-extrabold text-gray-300">
							{_nFormatter(generalData.numVotes.lowest.votes)}
						</div>
					</div>
				</div>
				<a
					href="https://www.imdb.com/title/{generalData.numVotes.lowest.ID}"
					id="mostVotesTitle"
					class="line-clamp-1 font-mono font-semibold text-gray-300"
				>
					{generalData.numVotes.lowest.title}
				</a>
			</div>
		</div>
		<div
			class="col-span-1 flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div id="mediaPerWeek" class="font-mono text-5xl font-extrabold text-stone-50">
				<NumberFlow
					class="h-8"
					locales="en-US"
					format={{ notation: 'compact' }}
					value={generalData.averageMediaPerWeek}
				/>
			</div>
			<h2 class="font-archivo font-semibold tracking-wider text-gray-400">media/wk</h2>
			<h2 class="font-archivo font-semibold tracking-wider text-gray-400">
				<div id="mediaPerMonth" class="font-mono text-5xl font-extrabold text-stone-50">
					<NumberFlow
						class="h-8"
						format={{ notation: 'compact' }}
						locales="en-US"
						value={generalData.averageMediaPerMonth}
					/>
				</div>
				media/mo
			</h2>
		</div>
		<div
			class="col-span-1 flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 font-archivo shadow-md shadow-zinc-800"
		>
			<h2 class=" font-archivo font-semibold tracking-wider text-gray-400">
				You've been a critic for
			</h2>
			<div
				id="accountAge"
				class="flex flex-col flex-wrap gap-1 text-2xl font-extrabold text-stone-50"
			>
				<div class="flex flex-row gap-1">
					<div id="accountAgeYears">{Math.floor(generalData.monthsSinceStart / 12)}</div>
					<div class="mt-auto text-xl font-medium">years</div>
				</div>
				<div class="flex flex-row gap-1">
					<div id="accountAgeMonths">{generalData.monthsSinceStart % 12}</div>
					<div class="mt-auto text-xl font-medium">months</div>
				</div>
			</div>
		</div>
	</section>

	<header class="mb-2 mt-14 flex">
		<div class="ml-auto flex flex-row items-center gap-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				height="40px"
				class=" fill-stone-50"
				><!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
					d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM48 368l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM48 240l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM48 112l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16L64 96c-8.8 0-16 7.2-16 16zM416 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM160 128l0 64c0 17.7 14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32L192 96c-17.7 0-32 14.3-32 32zm32 160c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-128 0z"
				/></svg
			>
			<h2 class=" inline-block font-archivo text-3xl font-bold tracking-wide text-stone-50">
				Movies
			</h2>
		</div>
	</header>
	<section
		class="m-0 mb-3 grid grid-flow-dense grid-cols-2 gap-4 drop-shadow-md lg:grid-cols-4 lg:gap-8"
	>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div id="movies" class="font-mono text-6xl font-extrabold text-stone-50">
				{movies.totalMedia}
			</div>
			<h2 class=" font-archivo font-semibold tracking-wider text-gray-400">Movies Watched</h2>
		</div>

		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 font-archivo font-medium shadow-md shadow-zinc-800 ~text-sm/base"
		>
			<div id="movieWatchtimeHours" class="font-mono text-5xl font-extrabold text-stone-50">
				{movies.totalWatchtimeHours}
			</div>
			<h2 class="tracking-wider text-gray-400">Hours Watched</h2>
			<div id="movieWatchtimeMinutes" class="font-mono text-5xl font-extrabold text-stone-50">
				{_nFormatter(movies.totalWatchtimeMinutes, 0)}
			</div>
			<h2 class="tracking-wider text-gray-400">Minutes Watched</h2>
		</div>

		<div
			class="relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 640 512"
				class="absolute -right-20 -top-8 w-60 -rotate-[160deg] fill-zinc-900/40"
				><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
					d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"
				/></svg
			>
			<div
				class="flex min-h-48 flex-col justify-center font-archivo text-xl font-semibold tracking-wider text-gray-400"
			>
				<h2 id="directors" class="font-mono text-8xl font-extrabold text-stone-50">
					{movies.totalDirectors}
				</h2>
				<div>Directors Watched.</div>
			</div>
			<span class="h-[1px] border-b-2 border-zinc-400"></span>
			<div class="flex min-h-48 flex-col justify-center font-archivo tracking-wider text-gray-400">
				<h2 class="text-xl font-semibold">Top Directors</h2>
				<div
					id="topDirectors"
					class="mt-1 flex flex-col gap-1 font-archivo text-base font-normal text-stone-50"
				>
					{#if !Object.entries(movies.directors).length <= 0}
						{#each Object.entries(movies.directors).slice(0, 5) as [director, count], i}
							<div class="flex flex-row gap-1">
								<span class="mr-1">{i + 1}.</span>
								<p>{director}</p>
								<span>({count}x)</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div>
				<div>
					<div
						id="movieAverageRating"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(movies.averageRating, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				<h2 class="font-archivo text-sm font-semibold tracking-wider text-gray-400">
					Your Avg Rating
				</h2>
			</div>
			<div>
				<div class="">
					<div
						id="movieAverageRatingIMDB"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(movies.averageRatingIMDB, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				<h2 class=" font-archivo text-sm font-semibold tracking-wider text-gray-400">
					IMDb's Avg Rating
				</h2>
			</div>
		</div>
		<div class="col-span-2 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Top Genres
			</h2>
			<div class="">
				<canvas id="movieTopGenres" class="p-1"></canvas>
			</div>
		</div>

		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800 lg:col-span-2">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Movies Per Rating
			</h2>
			<div class="max-h-48">
				<canvas id="movieRatingsPerScore" class="p-1"></canvas>
			</div>
		</div>
		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Movies Per Year
			</h2>
			<div class="max-h-48">
				<canvas id="moviesPerYear" class="p-1"></canvas>
			</div>
		</div>
	</section>

	<header class="mb-2 mt-14 flex">
		<div class="ml-auto flex flex-row items-center gap-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 640 512"
				height="40px"
				class=" fill-stone-50"
				><!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
					d="M64 64l0 288 512 0 0-288L64 64zM0 64C0 28.7 28.7 0 64 0L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 416c-35.3 0-64-28.7-64-64L0 64zM128 448l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-384 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
				/></svg
			>
			<h2 class=" inline-block font-archivo text-3xl font-bold tracking-wide text-stone-50">
				Shows
			</h2>
		</div>
	</header>

	<section
		class="m-0 mb-4 grid grid-flow-dense grid-cols-2 gap-4 drop-shadow-md lg:grid-cols-4 lg:gap-8"
	>
		<div
			class="flex h-48 flex-col justify-center rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div id="shows" class="font-mono text-6xl font-extrabold text-stone-50">
				{shows.totalMedia}
			</div>
			<h2 class=" font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Shows Watched
			</h2>
		</div>
		<div
			class="flex h-48 flex-col justify-center rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			{#if done}
				<div id="shows" class="font-mono text-6xl font-extrabold text-stone-50">
					{Object.keys(shows.episodes).length}
				</div>
			{/if}
			<h2 class=" font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Episodes Watched
			</h2>
		</div>
		<a
			href="/stats/shows"
			class="flex h-48 items-center rounded-xl bg-blue-400 px-4 font-archivo text-3xl font-semibold text-blue-900 shadow-md shadow-zinc-800 duration-75 ease-in hover:scale-105"
		>
			Click me to get more information.
		</a>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 font-archivo font-medium shadow-md shadow-zinc-800 ~text-sm/base"
		>
			<div id="movieWatchtimeHours" class="font-mono text-5xl font-extrabold text-stone-50">
				{shows.totalWatchtimeHours}
			</div>
			<h2 class="tracking-wider text-gray-400">Hours Watched</h2>
			<div id="movieWatchtimeMinutes" class="font-mono text-5xl font-extrabold text-stone-50">
				{_nFormatter(shows.totalWatchtimeMinutes, 0)}
			</div>
			<h2 class="tracking-wider text-gray-400">Minutes Watched</h2>
		</div>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-6 shadow-md shadow-zinc-800"
		>
			<div>
				<div>
					<div
						id="showAverageRating"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(shows.averageRating, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				<h2 class=" font-archivo text-sm font-semibold tracking-wider text-gray-400">
					Your Avg Rating
				</h2>
			</div>
			<div>
				<div class="">
					<div
						id="showAverageRatingIMDB"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(shows.averageRatingIMDB, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				<h2 class=" font-archivo text-sm font-semibold tracking-wider text-gray-400">
					IMDb's Avg Rating
				</h2>
			</div>
		</div>

		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800 lg:col-span-2">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Shows Per Rating
			</h2>
			<div class="max-h-48">
				<canvas id="showsPerRating" class="p-1"></canvas>
			</div>
		</div>
		<div class="col-span-2 h-48 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Top Genres
			</h2>
			<div class="max-h-48">
				<canvas id="showTopGenres" class="p-1"></canvas>
			</div>
		</div>
		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-zinc-800 lg:col-span-1">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Shows Per Year
			</h2>
			<div class="max-h-48">
				<canvas id="showsPerYear" class="p-1"></canvas>
			</div>
		</div>
	</section>
</div>
