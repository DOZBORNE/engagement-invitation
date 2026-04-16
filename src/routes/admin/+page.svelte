<script lang="ts">
	import { event } from '$lib/config';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const summary = $derived.by(() => {
		if (!data.authed || !data.rsvps) return null;
		let attending = 0;
		let declining = 0;
		let headcount = 0;
		for (const r of data.rsvps) {
			if (r.attending) {
				attending += 1;
				headcount += r.guests.length;
			} else {
				declining += 1;
			}
		}
		return { parties: data.rsvps.length, attending, declining, headcount };
	});

	function fmtDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Admin — RSVPs</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="relative z-10 px-6 py-10 sm:px-12 sm:py-16">
	<header class="mb-10 flex items-baseline justify-between">
		<div>
			<div class="eyebrow-ink">Admin</div>
			<h1 class="mt-1 font-display text-4xl italic sm:text-5xl">
				Replies for {event.couple.first} &amp; {event.couple.second}
			</h1>
		</div>
		{#if data.authed}
			<form method="POST" action="?/logout">
				<button
					type="submit"
					class="font-mono text-[0.625rem] tracking-[0.22em] uppercase text-[var(--color-clay)] hover:text-[var(--color-rust)]"
				>
					Sign out
				</button>
			</form>
		{/if}
	</header>

	<hr class="hairline mb-12" />

	{#if !data.authed}
		<div class="mx-auto max-w-md">
			<p class="eyebrow mb-4">Enter passcode</p>
			<form method="POST" action="?/login" class="space-y-6">
				<input
					type="password"
					name="passcode"
					required
					autocomplete="current-password"
					placeholder="••••••••"
					class="w-full border-0 border-b border-[var(--color-ink)]/40 bg-transparent pb-2 font-display text-2xl italic tracking-widest placeholder:text-[var(--color-clay)] focus:border-[var(--color-rust)]"
				/>
				{#if form?.message}
					<p class="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-rust-deep)]">
						{form.message}
					</p>
				{/if}
				<button
					type="submit"
					class="w-full bg-[var(--color-ink)] py-4 font-mono text-xs tracking-[0.28em] uppercase text-[var(--color-cream)] hover:opacity-90"
				>
					Enter
				</button>
			</form>
		</div>
	{:else}
		{#if data.loadError}
			<p class="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-rust-deep)]">
				Could not load RSVPs: {data.loadError}
			</p>
		{:else if summary}
			<!-- Totals -->
			<section class="mb-16 grid grid-cols-2 gap-px border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/15 sm:grid-cols-4">
				<div class="bg-[var(--color-cream)] p-6">
					<div class="eyebrow">Parties</div>
					<div class="mt-2 font-display text-5xl italic">{summary.parties}</div>
				</div>
				<div class="bg-[var(--color-cream)] p-6">
					<div class="eyebrow">Attending</div>
					<div class="mt-2 font-display text-5xl italic text-[var(--color-rust)]">
						{summary.attending}
					</div>
				</div>
				<div class="bg-[var(--color-cream)] p-6">
					<div class="eyebrow">Declining</div>
					<div class="mt-2 font-display text-5xl italic">{summary.declining}</div>
				</div>
				<div class="bg-[var(--color-cream)] p-6">
					<div class="eyebrow">Total guests</div>
					<div class="mt-2 font-display text-5xl italic text-[var(--color-rust)]">
						{summary.headcount}
					</div>
				</div>
			</section>

			<!-- List -->
			<section class="space-y-px bg-[var(--color-ink)]/15">
				{#if data.rsvps && data.rsvps.length === 0}
					<div class="bg-[var(--color-cream)] p-8 text-center font-display italic text-[var(--color-clay)]">
						No replies yet.
					</div>
				{/if}

				{#each data.rsvps ?? [] as rsvp (rsvp.id)}
					<article class="bg-[var(--color-cream)] p-6 sm:p-8">
						<div class="flex flex-wrap items-baseline justify-between gap-3">
							<div class="flex items-baseline gap-3">
								<span
									class="font-mono text-[0.625rem] tracking-[0.22em] uppercase {rsvp.attending
										? 'text-[var(--color-rust)]'
										: 'text-[var(--color-clay)]'}"
								>
									{rsvp.attending ? 'Attending' : 'Declined'}
								</span>
								<span class="eyebrow">
									{rsvp.guests.length}
									{rsvp.guests.length === 1 ? 'guest' : 'guests'}
								</span>
							</div>
							<span class="eyebrow">{fmtDate(rsvp.created_at)}</span>
						</div>

						<ul class="mt-4 space-y-2">
							{#each rsvp.guests as g (g.id)}
								<li class="flex flex-wrap items-baseline gap-3 border-t border-[var(--color-ink)]/10 pt-2">
									<span class="font-display text-2xl italic">
										{g.name}
									</span>
									{#if g.is_primary}
										<span class="font-mono text-[0.625rem] tracking-[0.18em] uppercase text-[var(--color-clay)]">
											Primary
										</span>
									{/if}
									{#if g.dietary}
										<span class="font-display text-base text-[var(--color-ink-soft)] italic">
											— {g.dietary}
										</span>
									{/if}
								</li>
							{/each}
						</ul>

						{#if rsvp.note}
							<blockquote
								class="mt-4 border-l-2 border-[var(--color-rust)] pl-4 font-display text-lg italic text-[var(--color-ink-soft)]"
							>
								"{rsvp.note}"
							</blockquote>
						{/if}
					</article>
				{/each}
			</section>
		{/if}
	{/if}
</main>
