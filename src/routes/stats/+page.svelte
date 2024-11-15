<script>
	import { onMount } from 'svelte';
	import { _loadData, _nFormatter, _loadCharts, _getFact } from './+page.js';
	import { browser } from '$app/environment';

	let movies = $state({
		totalMedia: 10,
		totalWatchtimeMinutes: 10,
		totalWatchtimeHours: 10,
		totalDirectors: 10,
		totalRating: 10,
		averageRating: 10,
		totalRatingIMDB: 10,
		averageRatingIMDB: 10,
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
		totalMedia: 10,
		totalRating: 10,
		totalAverageRating: 10,
		averageMediaPerWeek: 10,
		averageMediaPerMonth: 10,
		monthsSinceStart: 10,
		weeksSinceStart: 10
	});

	let shows = $state({
		totalMedia: 10,
		totalWatchtimeMinutes: 10,
		totalWatchtimeHours: 10,
		totalRating: 10,
		totalRatingIMDB: 10,
		averageRating: 10,
		averageRatingIMDB: 10,
		perYear: {},
		ratingsPerScore: {},
		genres: {}
	});
	let fact = $state({});

	onMount(async () => {
		generalData = _loadData('generalData');
		$inspect(generalData);
		movies = _loadData('movies');
		shows = _loadData('shows');
		_loadCharts();
		fact = await _getFact();
	});
	async function newFact() {
		fact = await _getFact();
	}
</script>

<div class="relative mx-auto mb-32 max-w-screen-lg animate-slide-up pl-4 pr-4">
	<header class="mb-2 flex flex-col items-end pt-4 md:flex-row">
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
		<h2 class="ml-auto inline-block font-archivo text-3xl font-bold tracking-wide text-stone-50">
			<i class="fa-solid fa-globe mr-1"></i> General
		</h2>
	</header>

	<div
		class="m-0 mb-4 grid grid-flow-dense grid-cols-2 gap-4 drop-shadow-md md:grid-cols-4 md:gap-8"
	>
		<div
			class="relative col-span-2 row-span-2 flex min-h-48 flex-col gap-1 overflow-hidden rounded-xl bg-zinc-800 p-4 shadow-md shadow-stone-800 md:min-h-96"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="absolute -bottom-28 -right-28 w-72 fill-zinc-900 opacity-40 md:-left-28"
				viewBox="0 0 512 512"
			>
				<path
					d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
				/>
			</svg>
			<div class="flex flex-col font-archivo text-xl font-semibold tracking-wider text-gray-400">
				<div class="inline-block font-mono text-8xl font-extrabold text-stone-50">
					{movies.totalWatchtimeHours + shows.totalWatchtimeHours}
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
				of a year
				<svg
					class="inline-block h-6 w-6 fill-stone-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
				>
					<path
						d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm176.4-80a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM256 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
					/>
				</svg>
			</div>
		</div>

		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="totalMedia" class="font-mono text-5xl font-extrabold text-stone-50">
					{generalData.totalMedia}
				</div>
				Media Watched
			</h2>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div>
					<div
						id="totalAverageRating"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(generalData.totalAverageRating, 1)}
					</div>
					<div class="inline-block font-mono text-xl text-stone-50">/10</div>
				</div>
				Average Rating
			</h2>
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
					<h1 class=" font-heebo text-4xl font-semibold tracking-wider text-zinc-700">Fact</h1>
					<p class="font-archivo text-base font-medium text-zinc-900">
						{fact.description}
					</p>
				</div>
			</div>
		</div>
		<div class="col-span-2 max-h-48 rounded-xl bg-zinc-800 shadow-md shadow-stone-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Media Per Release Year
			</h2>
			<div class="max-h-48">
				<canvas id="mediaPerReleaseYear" class="p-1"></canvas>
			</div>
		</div>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div class="flex flex-row items-center gap-1">
					<i class="fa-solid fa-trophy fa-2xl text-accent"></i>
					<div id="highestStreak" class="font-mono text-5xl font-extrabold text-stone-50">
						{generalData.streak.highestStreak}
					</div>
				</div>
				Highest Streak
			</h2>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div class="ml-1 flex flex-row items-center gap-2">
					<i class="fa-solid fa-fire fa-2xl self-center text-red-600"></i>
					<div id="currentStreak" class="font-mono text-5xl font-extrabold text-stone-50">
						{generalData.streak.currentStreak}
					</div>
				</div>
				Current Streak
			</h2>
		</div>

		<div
			class="flex h-48 flex-col justify-center gap-2 rounded-xl bg-zinc-800 p-4 px-6 shadow-md shadow-stone-800 md:col-span-2"
		>
			<div id="longest flex gap-1">
				<h2 class="font-archivo text-sm font-normal tracking-wider text-gray-300">Longest Title</h2>
				<a
					href="https://www.imdb.com/title/{generalData.titleData.longest.ID}"
					id="longestTitle"
					class="line-clamp-2 font-mono text-base font-semibold text-stone-50"
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
					class="line-clamp-2 font-mono text-base font-semibold text-stone-50"
					target="_blank"
					rel="noopener"
				>
					{generalData.titleData.shortest.title}
				</a>
			</div>
		</div>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800 md:col-span-2"
		>
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Most Votes
				<div class="flex flex-row items-center gap-1">
					<i class="fa-solid fa-up-long md:fa-xl text-green-600"></i>
					<div class="flex flex-row items-end">
						<div id="mostVotes" class="font-mono text-2xl font-extrabold text-stone-50 md:text-4xl">
							{_nFormatter(generalData.numVotes.highest.votes)}
						</div>
						<div
							id="mostVotesTitle"
							class="line-clamp-1 pl-1 font-mono text-base font-bold text-gray-400 md:text-xl"
						>
							{generalData.numVotes.highest.title}
						</div>
					</div>
				</div>
			</h2>
			<h3 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Least Votes
				<div class="flex flex-row items-center gap-1">
					<i class="fa-solid fa-down-long md:fa-xl text-red-600"></i>
					<div class="flex flex-row items-end">
						<div
							id="leastVotes"
							class="font-mono text-2xl font-extrabold text-stone-50 md:text-4xl"
						>
							{generalData.numVotes.lowest.votes}
						</div>
						<div
							id="leastVotesTitle"
							class="line-clamp-1 pl-1 font-mono text-base font-bold text-gray-400 md:text-xl"
						>
							{generalData.numVotes.lowest.title}
						</div>
					</div>
				</div>
			</h3>
		</div>
		<div
			class="col-span-1 flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="mediaPerWeek" class="font-mono text-5xl font-extrabold text-stone-50">
					{_nFormatter(generalData.averageMediaPerWeek, 1)}
				</div>
				~ media/ww
			</h2>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="mediaPerMonth" class="font-mono text-5xl font-extrabold text-stone-50">
					{_nFormatter(generalData.averageMediaPerMonth, 1)}
				</div>
				~ media/mm
			</h2>
		</div>
		<div
			class="col-span-1 flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div
					id="accountAge"
					class="flex flex-col flex-wrap gap-1 font-mono text-2xl font-extrabold text-stone-50"
				>
					<div class="flex gap-1">
						<span id="accountAgeYears"
							>{(generalData.weeksSinceStart / 52.177457).toString().split('.')[0]}</span
						><span class="self-end font-archivo text-xl text-stone-50"> years </span>
					</div>
					<div class="flex gap-1">
						<span id="accountAgeMonths"
							>{generalData.monthsSinceStart -
								(generalData.weeksSinceStart / 52.177457).toString().split('.')[0] * 12}</span
						><span class="self-end font-archivo text-xl text-stone-50"> months</span>
					</div>
				</div>
				Account Age
			</h2>
		</div>
	</div>

	<header class="mb-2 mt-14 flex flex-row">
		<h2 class="ml-auto inline-block font-archivo text-3xl font-bold tracking-wide text-stone-50">
			<i class="fa-solid fa-film mr-1"></i> Movies
		</h2>
	</header>
	<div
		class="m-0 mb-3 grid grid-flow-dense grid-cols-2 gap-4 drop-shadow-md md:grid-cols-4 md:gap-8"
	>
		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="movies" class="font-mono text-6xl font-extrabold text-stone-50">
					{movies.totalMedia}
				</div>
				Movies Watched
			</h2>
		</div>

		<div
			class="flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="movieWatchtimeHours" class="font-mono text-5xl font-extrabold text-stone-50">
					{movies.totalWatchtimeHours}
				</div>
				Hours Watched
			</h2>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="movieWatchtimeMinutes" class="font-mono text-5xl font-extrabold text-stone-50">
					{_nFormatter(movies.totalWatchtimeMinutes, 0)}
				</div>
				Minutes Watched
			</h2>
		</div>

		<div
			class="> flex h-48 flex-col justify-center gap-1 rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-sm font-semibold tracking-wider text-gray-400">
				<div>
					<div
						id="movieAverageRating"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(movies.averageRating, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				Your Avg Rating
			</h2>
			<h2 class="px-2 font-archivo text-sm font-semibold tracking-wider text-gray-400">
				<div class="">
					<div
						id="movieAverageRatingIMDB"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(movies.averageRatingIMDB, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				IMDb's Avg Rating
			</h2>
		</div>
		<div
			class="col-start-2 row-span-2 row-start-1 flex flex-col justify-between rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800 md:col-start-auto md:row-start-auto"
		>
			<h2
				class="flex min-h-48 flex-col justify-center px-2 font-archivo text-base font-semibold tracking-wider text-gray-400"
			>
				<div id="directors" class="font-mono text-6xl font-extrabold text-stone-50">
					{movies.totalDirectors}
				</div>
				Directors Watched
			</h2>
			<span class="h-[1px] border-b-2 border-zinc-400"></span>
			<h2
				class="flex min-h-48 flex-col justify-center px-2 font-archivo text-xl font-semibold tracking-wider text-gray-400"
			>
				Top Directors
				<div
					id="topDirectors"
					class="mt-1 flex flex-col gap-1 font-archivo text-base font-normal text-stone-50 *:line-clamp-1"
				>
					{#if !Object.entries(movies.directors).length <= 0}
						{#each Object.entries(movies.directors).slice(0, 5) as [director, count], i}
							<p><span class="mr-1">{i + 1}.</span>{director}</p>
						{/each}
					{/if}
				</div>
			</h2>
		</div>

		<div class="col-span-2 rounded-xl bg-zinc-800 shadow-md shadow-stone-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Top Genres
			</h2>
			<div class="">
				<canvas id="movieTopGenres" class="p-1"></canvas>
			</div>
		</div>

		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-stone-800 md:col-span-2">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Movies Per Rating
			</h2>
			<div class="max-h-48">
				<canvas id="movieRatingsPerScore" class="p-1"></canvas>
			</div>
		</div>
		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-stone-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Movies Per Year
			</h2>
			<div class="max-h-48">
				<canvas id="moviesPerYear" class="p-1"></canvas>
			</div>
		</div>
	</div>

	<header class="mb-2 mt-14 flex flex-row">
		<h2 class="ml-auto inline-block font-archivo text-3xl font-bold tracking-wide text-stone-50">
			<i class="fa-solid fa-display mr-1"></i> Shows
		</h2>
	</header>

	<div
		class="m-0 mb-4 grid grid-flow-dense grid-cols-2 gap-4 drop-shadow-md md:grid-cols-4 md:gap-8"
	>
		<div class="flex h-48 items-center rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800">
			<h2 class="px-3 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				<div id="shows" class="font-mono text-6xl font-extrabold text-stone-50">
					{shows.totalMedia}
				</div>
				Shows Watched
			</h2>
		</div>
		<a
			href="/stats/shows"
			class="flex h-48 items-center rounded-xl bg-blue-400 px-4 font-archivo text-3xl font-semibold text-blue-900 shadow-md shadow-stone-800 duration-75 ease-in hover:scale-105"
		>
			Click me to get more information.
		</a>
		<div
			class="flex h-48 flex-col justify-center rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="showWatchtimeHours" class="font-mono text-5xl font-extrabold text-stone-50">
					{shows.totalWatchtimeHours}
				</div>
				Hours Watched
			</h2>
			<h2 class="px-2 font-archivo text-base font-semibold tracking-wider text-gray-400">
				<div id="showWatchtimeMinutes" class="font-mono text-5xl font-extrabold text-stone-50">
					{_nFormatter(shows.totalWatchtimeMinutes)}
				</div>
				Minutes Watched
			</h2>
		</div>
		<div
			class="flex h-48 flex-col justify-center rounded-xl bg-zinc-800 px-4 shadow-md shadow-stone-800"
		>
			<h2 class="px-2 pt-1 font-archivo text-sm font-semibold tracking-wider text-gray-400">
				<div>
					<div
						id="showAverageRating"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(shows.averageRating, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				Your Avg Rating
			</h2>
			<h2 class="px-2 pb-1 font-archivo text-sm font-semibold tracking-wider text-gray-400">
				<div class="">
					<div
						id="showAverageRatingIMDB"
						class="inline-block font-mono text-5xl font-extrabold text-stone-50"
					>
						{_nFormatter(shows.averageRatingIMDB, 1)}
					</div>
					<div class="inline-block font-mono text-2xl text-stone-50">/10</div>
				</div>
				IMDb's Avg Rating
			</h2>
		</div>

		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-stone-800 md:col-span-2">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Shows Per Rating
			</h2>
			<div class="max-h-48">
				<canvas id="showsPerRating" class="p-1"></canvas>
			</div>
		</div>
		<div class="col-span-2 h-48 rounded-xl bg-zinc-800 shadow-md shadow-stone-800">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Top Genres
			</h2>
			<div class="max-h-48">
				<canvas id="showTopGenres" class="p-1"></canvas>
			</div>
		</div>
		<div class="h-48 rounded-xl bg-zinc-800 shadow-md shadow-stone-800 md:col-span-1">
			<h2 class="px-2 font-archivo text-lg font-semibold tracking-wider text-gray-400">
				Shows Per Year
			</h2>
			<div class="max-h-48">
				<canvas id="showsPerYear" class="p-1"></canvas>
			</div>
		</div>
	</div>
</div>
