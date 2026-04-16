<script lang="ts">
	import { event } from '$lib/config';
</script>

<svelte:head>
	<title>OG — {event.couple.first} & {event.couple.second}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="og-stage">
	<div class="og-card">
		<!-- Inset hairline frame -->
		<div class="og-frame"></div>

		<!-- Masthead -->
		<header class="og-masthead">
			<span class="eyebrow-ink">{event.issueLabel}</span>
			<span class="eyebrow">{event.cityShort}</span>
			<span class="eyebrow">{event.romanYear}</span>
		</header>
		<hr class="hairline og-rule-top" />

		<!-- Hero -->
		<div class="og-hero">
			<h1 class="og-hero-title">
				<span class="og-youre">You&rsquo;re</span>
				<span class="og-invited">Invited</span>
			</h1>

			<div class="og-asterism">⁂</div>

			<div class="og-names">
				<span>{event.couple.first}</span>
				<span class="og-amp">&amp;</span>
				<span>{event.couple.second}</span>
			</div>

			<div class="og-date">
				<span>{event.date.dayLabel}</span>
				<span class="og-dot">·</span>
				<span>{event.date.monthLabel} {event.date.dayNumber}</span>
				<span class="og-dot">·</span>
				<span>{event.romanYear}</span>
			</div>
		</div>

		<!-- Footer -->
		<hr class="hairline og-rule-bot" />
		<footer class="og-foot">
			<span class="eyebrow">{event.venue.addressLine1}</span>
			<span class="eyebrow">{event.date.timeLabel} · Cocktail Attire</span>
		</footer>
	</div>
</div>

<style>
	.og-stage {
		position: relative;
		z-index: 10;
		width: 1200px;
		height: 630px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-cream);
	}

	.og-card {
		position: relative;
		width: 1200px;
		height: 630px;
		padding: 48px 80px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.og-frame {
		position: absolute;
		inset: 24px;
		border: 1px solid var(--color-ink);
		opacity: 0.18;
		pointer-events: none;
	}

	.og-masthead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 24px;
		font-size: 14px;
	}

	.og-masthead :global(.eyebrow),
	.og-masthead :global(.eyebrow-ink) {
		font-size: 14px;
		letter-spacing: 0.24em;
	}

	.og-rule-top {
		margin: 16px 0 0;
	}

	.og-hero {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0;
	}

	.og-hero-title {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 350;
		line-height: 0.86;
		letter-spacing: -0.02em;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.og-youre {
		font-size: 110px;
		display: block;
	}

	.og-invited {
		font-size: 150px;
		display: block;
		margin-top: -8px;
	}

	.og-asterism {
		font-family: var(--font-mono);
		color: var(--color-rust);
		font-size: 22px;
		letter-spacing: 0.4em;
		margin: 22px 0 18px;
		padding-left: 0.4em;
	}

	.og-names {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 350;
		font-size: 56px;
		letter-spacing: 0.01em;
		display: flex;
		align-items: baseline;
		gap: 22px;
	}

	.og-amp {
		color: var(--color-rust);
		font-weight: 300;
		font-size: 60px;
	}

	.og-date {
		margin-top: 22px;
		font-family: var(--font-mono);
		font-size: 14px;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--color-ink);
		display: flex;
		gap: 14px;
		font-weight: 500;
	}

	.og-dot {
		color: var(--color-clay);
	}

	.og-rule-bot {
		margin: 0 0 16px;
	}

	.og-foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 13px;
	}

	.og-foot :global(.eyebrow) {
		font-size: 13px;
		letter-spacing: 0.22em;
	}

	/* Hide grain/vignette overlays so the screenshot is clean — we still want a hint of paper, so reduce not eliminate. */
	:global(body::before) {
		opacity: 0.05 !important;
	}
	:global(body::after) {
		display: none !important;
	}
</style>
