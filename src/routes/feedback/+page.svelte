<script>
	import { page } from '$app/stores';
</script>

<section class="mx-auto max-w-screen-lg p-4">
	<form
		method="POST"
		class=" space-y-6 rounded-xl bg-zinc-800 p-8 font-archivo shadow-md shadow-zinc-800"
	>
		<h2 class="mb-4 font-archivo text-3xl font-bold tracking-wider text-stone-50">
			Share Your Feedback
		</h2>

		<div class="space-y-2">
			<label for="name" class="font-archivo text-sm font-semibold tracking-wider text-gray-400">
				Name
			</label>
			<input
				id="name"
				name="name"
				required
				class="w-full rounded-lg bg-zinc-700 p-3 text-stone-50 outline-none focus:ring-2 focus:ring-yellow-400"
			/>
		</div>

		<div class="space-y-2">
			<label for="category" class="font-archivo text-sm font-semibold tracking-wider text-gray-400">
				Category
			</label>
			<div class="relative">
				<select
					id="category"
					name="category"
					required
					class="w-full appearance-none rounded-lg bg-zinc-700 p-3 text-stone-50 outline-none focus:ring-2 focus:ring-yellow-400"
				>
					<option value="" disabled selected>Select a category</option>
					<option value="Praise">Praise</option>
					<option value="Bug Report">Bug Report</option>
					<option value="Feature Request">Feature Request</option>
					<option value="User Experience">User Experience</option>
					<option value="Performance">Performance</option>
					<option value="Other">Other</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<label for="message" class="font-archivo text-sm font-semibold tracking-wider text-gray-400">
				Message
			</label>
			<textarea
				id="message"
				name="message"
				required
				rows="4"
				class="w-full rounded-lg bg-zinc-700 p-3 text-stone-50 outline-none focus:ring-2 focus:ring-yellow-400"
			></textarea>
		</div>
		{#if $page.form?.error}
			<div
				class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
				role="alert"
			>
				<strong class="font-bold">Error: </strong>
				<span class="block sm:inline">{$page.form.error}</span>
			</div>
		{/if}
		<button
			class="w-full rounded-lg bg-gradient-to-r from-red-500 via-orange-500
                   to-yellow-400 py-3 font-archivo font-bold text-stone-50
                   transition-opacity duration-300 hover:opacity-90"
		>
			Submit Feedback
		</button>
	</form>
</section>
