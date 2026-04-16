<svelte:head>
	<title>Favicon preview</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="fav-stage">
	<span class="fav-amp">&amp;</span>
</div>

<style>
	.fav-stage {
		position: fixed;
		inset: 0;
		background: var(--color-cream);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	.fav-amp {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 350;
		color: var(--color-rust);
		font-size: 380px;
		line-height: 1;
		/* Optical centering — italic ampersand sits slightly right of geometric center */
		transform: translate(-12px, -8px);
	}
	:global(body::before),
	:global(body::after) {
		display: none !important;
	}
</style>
