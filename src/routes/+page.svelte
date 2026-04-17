<script lang="ts">
    import { enhance } from "$app/forms";
    import { event } from "$lib/config";
    import type { ActionData } from "./$types";

    let { form }: { form: ActionData } = $props();

    type GuestRow = { name: string; dietary: string };

    let attending = $state<"yes" | "no">("yes");
    let guests = $state<GuestRow[]>([{ name: "", dietary: "" }]);
    let note = $state("");
    let submitting = $state(false);
    let submitted = $state(false);
    let errorMsg = $state<string | null>(null);

    const guestsJson = $derived(JSON.stringify(guests));
    const totalAttending = $derived(attending === "yes" ? guests.length : 0);

    function addGuest() {
        guests.push({ name: "", dietary: "" });
    }
    function removeGuest(i: number) {
        guests.splice(i, 1);
    }

    function rsvpDeadlinePassed(): boolean {
        return Date.now() > new Date(event.rsvp.deadlineIso).getTime();
    }
    const deadlinePassed = rsvpDeadlinePassed();
</script>

<svelte:head>
    <title>{event.couple.first} & {event.couple.second} — An Engagement</title>
    <meta
        name="description"
        content="You are cordially invited to celebrate the engagement of {event
            .couple.first} & {event.couple.second}, {event.date
            .monthLabel} {event.date.dayNumber}, {event.date
            .yearLabel}, in {event.cityShort}."
    />
    <meta property="og:type" content="website" />
    <meta
        property="og:title"
        content="{event.couple.first} & {event.couple.second} — Engagement"
    />
    <meta
        property="og:description"
        content="An evening to celebrate. {event.date.monthLabel} {event.date
            .dayNumber}, {event.date.yearLabel} · {event.cityShort}"
    />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="You're Invited — Devin & Jessica" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/og-image.png" />
</svelte:head>

<main class="relative z-10">
    <!-- Masthead -->
    <header class="px-6 pt-6 sm:px-12 sm:pt-10">
        <div class="flex items-center justify-between gap-4">
            <span class="eyebrow-ink">{event.issueLabel}</span>
            <span class="eyebrow hidden sm:inline">{event.cityShort}</span>
            <span class="eyebrow">{event.romanYear}</span>
        </div>
        <hr class="hairline mt-4" />
    </header>

    <!-- Cover -->
    <section
        class="relative flex min-h-[92dvh] flex-col justify-between px-6 pt-10 pb-10 sm:px-12 sm:pt-16"
    >
        <div class="grid flex-1 grid-cols-12 items-center gap-4">
            <div class="col-span-12 sm:col-span-2">
                <div class="eyebrow">An invitation to celebrate the</div>
                <div
                    class="mt-1 font-mono text-[0.625rem] tracking-[0.2em] text-[var(--color-rust)]"
                >
                    ⁂ ENGAGEMENT ⁂
                </div>
            </div>

            <div class="col-span-12 sm:col-span-10">
                <h1 class="font-display leading-[0.82] tracking-[-0.02em]">
                    <span
                        class="name-rise block text-[clamp(4.2rem,16vw,15rem)] italic font-[350]"
                        style="animation-delay: 0.1s"
                    >
                        {event.couple.first}
                    </span>
                    <span
                        class="name-rise ml-[10%] block text-[clamp(3rem,11vw,10rem)] italic font-[300] text-[var(--color-rust)]"
                        style="animation-delay: 0.45s"
                    >
                        &amp;
                    </span>
                    <span
                        class="name-rise block text-right text-[clamp(4.2rem,16vw,15rem)] italic font-[350]"
                        style="animation-delay: 0.8s"
                    >
                        {event.couple.second}
                    </span>
                </h1>
            </div>
        </div>

        <div
            class="mt-12 flex items-end justify-between gap-6"
            style="opacity: 0; animation: nameRise 1.2s cubic-bezier(0.2,0.7,0.2,1) 1.4s forwards;"
        >
            <div class="max-w-[20rem]">
                <div class="eyebrow mb-2">The Occasion</div>
                <p class="font-display text-base leading-snug sm:text-lg">
                    request the pleasure of your company at a celebration
                    of their engagement.
                </p>
            </div>
            <a
                href="#rsvp"
                class="group flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase"
            >
                <span class="border-b border-[var(--color-ink)] pb-0.5"
                    >Reply</span
                >
                <span class="transition-transform group-hover:translate-y-0.5"
                    >↓</span
                >
            </a>
        </div>
    </section>

    <!-- The Date -->
    <section
        class="border-t border-b border-[var(--color-ink)]/15 px-6 sm:px-12"
    >
        <div class="grid grid-cols-12 items-stretch gap-0 py-12 sm:py-20">
            <div class="col-span-12 flex flex-col justify-center sm:col-span-5">
                <div class="eyebrow mb-3">The Date</div>
                <div
                    class="font-display text-7xl leading-none italic sm:text-8xl"
                >
                    {event.date.dayNumber}
                </div>
                <div
                    class="mt-2 font-display text-2xl tracking-tight italic sm:text-3xl"
                >
                    {event.date.monthLabel}, {event.date.yearLabel}
                </div>
                <div class="mt-1 eyebrow">{event.date.dayLabel}</div>
            </div>

            <div
                class="col-span-12 mt-10 flex flex-col justify-center border-t border-[var(--color-ink)]/15 pt-10 sm:col-span-7 sm:mt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-12"
            >
                <div class="eyebrow mb-3">The Hour</div>
                <div class="font-display text-6xl italic sm:text-7xl">
                    {event.date.timeLabel}
                </div>
                <p
                    class="mt-6 max-w-md font-display text-lg leading-snug text-[var(--color-ink-soft)]"
                >
                    An evening of cocktails, supper, and unhurried conversation,
                    set against the soft hush of a Birmingham spring.
                </p>
            </div>
        </div>
    </section>

    <!-- Decorative ornament -->
    <div class="flex items-center justify-center py-12">
        <svg
            class="text-[var(--color-rust)]"
            width="180"
            height="40"
            viewBox="0 0 180 40"
            fill="none"
            stroke="currentColor"
            stroke-width="0.6"
        >
            <line x1="0" y1="20" x2="60" y2="20" />
            <circle cx="90" cy="20" r="3" />
            <circle cx="78" cy="20" r="1" />
            <circle cx="102" cy="20" r="1" />
            <line x1="120" y1="20" x2="180" y2="20" />
        </svg>
    </div>

    <!-- Venue -->
    <section class="px-6 sm:px-12">
        <div class="grid grid-cols-12 gap-6 py-16 sm:py-24">
            <div class="col-span-12 sm:col-span-7">
                <div class="eyebrow mb-3">The Venue</div>
                <div
                    class="font-display text-4xl leading-tight italic sm:text-6xl"
                >
                    {event.venue.name}
                </div>
                <div
                    class="mt-6 font-display text-xl text-[var(--color-ink-soft)] sm:text-2xl"
                >
                    {event.venue.addressLine1}<br />
                    {event.venue.addressLine2}
                </div>
            </div>

            <div
                class="col-span-12 mt-8 grid grid-cols-1 gap-8 sm:col-span-5 sm:mt-0 sm:border-l sm:border-[var(--color-ink)]/15 sm:pl-12"
            >
                <div>
                    <div class="eyebrow mb-2">Parking</div>
                    <p class="font-display text-base leading-snug">
                        {event.parking}
                    </p>
                </div>
                <div>
                    <div class="eyebrow mb-2">Dress</div>
                    <p class="font-display text-base leading-snug">
                        {event.dressCode}
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- RSVP -->
    <section
        id="rsvp"
        class="relative bg-[var(--color-cream-deep)] px-6 py-20 sm:px-12 sm:py-28"
    >
        <div class="mx-auto max-w-3xl">
            <div class="text-center">
                <div class="eyebrow mb-3">Reply</div>
                <h2 class="font-display text-5xl italic sm:text-7xl">
                    Will you be there?
                </h2>
                <p
                    class="mt-6 font-display text-base text-[var(--color-ink-soft)]"
                >
                    {#if deadlinePassed}
                        The reply window has closed — but please reach out to us
                        directly.
                    {:else}
                        Kindly reply by <em>{event.rsvp.deadlineLabel}</em>.
                    {/if}
                </p>
            </div>

            {#if submitted || form?.success}
                <div
                    class="mt-16 border border-[var(--color-rust)] bg-[var(--color-cream)] p-10 text-center"
                >
                    <div class="eyebrow text-[var(--color-rust)]">
                        Reply received
                    </div>
                    <p class="mt-6 font-display text-3xl italic sm:text-4xl">
                        {#if attending === "yes" || form?.attending}
                            Thank you. We'll see you in {event.date.monthLabel}.
                        {:else}
                            Thank you for letting us know. You'll be missed.
                        {/if}
                    </p>
                    <p
                        class="mt-4 font-display text-base text-[var(--color-ink-soft)]"
                    >
                        {#if (attending === "yes" || form?.attending) && totalAttending > 0}
                            Counting <strong
                                >{form?.guestCount ?? totalAttending}</strong
                            >
                            {(form?.guestCount ?? totalAttending) === 1
                                ? "seat"
                                : "seats"} in your name.
                        {/if}
                    </p>
                </div>
            {:else}
                <form
                    method="POST"
                    action="?/submit"
                    class="mt-16 space-y-12"
                    use:enhance={() => {
                        submitting = true;
                        errorMsg = null;
                        return async ({ result, update }) => {
                            submitting = false;
                            if (result.type === "success") {
                                submitted = true;
                            } else if (result.type === "failure") {
                                errorMsg =
                                    (result.data?.message as
                                        | string
                                        | undefined) ??
                                    "Something went wrong. Please try again.";
                            }
                            await update({ reset: false });
                        };
                    }}
                >
                    <input
                        type="hidden"
                        name="guests_json"
                        value={guestsJson}
                    />
                    <input type="hidden" name="attending" value={attending} />
                    <input type="hidden" name="note" value={note} />

                    <!-- Toggle -->
                    <fieldset>
                        <legend class="eyebrow mb-4">Your reply</legend>
                        <div
                            class="grid grid-cols-2 border border-[var(--color-ink)] divide-x divide-[var(--color-ink)]"
                        >
                            <button
                                type="button"
                                onclick={() => (attending = "yes")}
                                class="px-4 py-5 text-center transition-colors {attending ===
                                'yes'
                                    ? 'bg-[var(--color-ink)] text-[var(--color-cream)]'
                                    : 'bg-transparent hover:bg-[var(--color-ink)]/5'}"
                            >
                                <div
                                    class="font-mono text-[0.625rem] tracking-[0.22em] uppercase opacity-70"
                                >
                                    Joyfully
                                </div>
                                <div
                                    class="mt-1 font-display text-2xl italic sm:text-3xl"
                                >
                                    accepts
                                </div>
                            </button>
                            <button
                                type="button"
                                onclick={() => (attending = "no")}
                                class="px-4 py-5 text-center transition-colors {attending ===
                                'no'
                                    ? 'bg-[var(--color-ink)] text-[var(--color-cream)]'
                                    : 'bg-transparent hover:bg-[var(--color-ink)]/5'}"
                            >
                                <div
                                    class="font-mono text-[0.625rem] tracking-[0.22em] uppercase opacity-70"
                                >
                                    Regretfully
                                </div>
                                <div
                                    class="mt-1 font-display text-2xl italic sm:text-3xl"
                                >
                                    declines
                                </div>
                            </button>
                        </div>
                    </fieldset>

                    {#if attending === "yes"}
                        <!-- Guests -->
                        <fieldset>
                            <div
                                class="mb-4 flex items-baseline justify-between"
                            >
                                <legend class="eyebrow">Who is joining?</legend>
                                <span
                                    class="font-mono text-xs tracking-[0.18em] uppercase text-[var(--color-clay)]"
                                >
                                    {guests.length}
                                    {guests.length === 1 ? "guest" : "guests"}
                                </span>
                            </div>

                            <div class="space-y-6">
                                {#each guests as guest, i (i)}
                                    <div
                                        class="border-t border-[var(--color-ink)]/15 pt-6"
                                    >
                                        <div
                                            class="flex items-baseline justify-between"
                                        >
                                            <div class="eyebrow">
                                                {i === 0
                                                    ? "Primary guest"
                                                    : `Guest ${i + 1}`}
                                            </div>
                                            {#if guests.length > 1}
                                                <button
                                                    type="button"
                                                    onclick={() =>
                                                        removeGuest(i)}
                                                    class="font-mono text-[0.625rem] tracking-[0.18em] uppercase text-[var(--color-clay)] hover:text-[var(--color-rust)]"
                                                >
                                                    Remove
                                                </button>
                                            {/if}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            bind:value={guests[i].name}
                                            autocomplete={i === 0
                                                ? "name"
                                                : "off"}
                                            required={i === 0}
                                            class="mt-2 w-full border-0 border-b border-[var(--color-ink)]/40 bg-transparent pb-2 font-display text-2xl italic placeholder:text-[var(--color-clay)] focus:border-[var(--color-rust)] sm:text-3xl"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Dietary restrictions or allergies (optional)"
                                            bind:value={guests[i].dietary}
                                            class="mt-3 w-full border-0 border-b border-[var(--color-ink)]/15 bg-transparent pb-2 font-display text-base text-[var(--color-ink-soft)] placeholder:text-[var(--color-clay)] focus:border-[var(--color-rust)]"
                                        />
                                    </div>
                                {/each}
                            </div>

                            <button
                                type="button"
                                onclick={addGuest}
                                class="mt-6 inline-flex items-center gap-2 border border-[var(--color-ink)] px-5 py-3 font-mono text-[0.625rem] tracking-[0.22em] uppercase hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
                            >
                                <span>+</span>
                                <span>Add another guest</span>
                            </button>
                        </fieldset>

                        <!-- Note -->
                        <fieldset>
                            <legend class="eyebrow mb-3"
                                >A note for the couple <span
                                    class="text-[var(--color-clay)]"
                                    >(optional)</span
                                ></legend
                            >
                            <textarea
                                bind:value={note}
                                rows="3"
                                placeholder="A wish, a memory, anything…"
                                class="w-full border border-[var(--color-ink)]/30 bg-[var(--color-cream)] p-4 font-display text-lg italic placeholder:text-[var(--color-clay)] focus:border-[var(--color-rust)]"
                            ></textarea>
                        </fieldset>
                    {:else}
                        <!-- Declining: just collect a name so we know who -->
                        <fieldset>
                            <legend class="eyebrow mb-4">Your name</legend>
                            <input
                                type="text"
                                placeholder="Full name"
                                bind:value={guests[0].name}
                                required
                                class="w-full border-0 border-b border-[var(--color-ink)]/40 bg-transparent pb-2 font-display text-2xl italic placeholder:text-[var(--color-clay)] focus:border-[var(--color-rust)] sm:text-3xl"
                            />
                        </fieldset>

                        <fieldset>
                            <legend class="eyebrow mb-3"
                                >A note for the couple <span
                                    class="text-[var(--color-clay)]"
                                    >(optional)</span
                                ></legend
                            >
                            <textarea
                                bind:value={note}
                                rows="3"
                                placeholder="We'll miss you — but please write a line."
                                class="w-full border border-[var(--color-ink)]/30 bg-[var(--color-cream)] p-4 font-display text-lg italic placeholder:text-[var(--color-clay)] focus:border-[var(--color-rust)]"
                            ></textarea>
                        </fieldset>
                    {/if}

                    {#if errorMsg}
                        <p
                            class="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-rust-deep)]"
                        >
                            {errorMsg}
                        </p>
                    {/if}

                    <div class="border-t border-[var(--color-ink)]/15 pt-8">
                        <button
                            type="submit"
                            disabled={submitting || deadlinePassed}
                            class="w-full bg-[var(--color-ink)] py-6 text-center font-mono text-xs tracking-[0.28em] uppercase text-[var(--color-cream)] transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                            {submitting
                                ? "Sending…"
                                : deadlinePassed
                                  ? "Replies closed"
                                  : "Send reply"}
                        </button>
                    </div>
                </form>
            {/if}
        </div>
    </section>

    <!-- Colophon -->
    <footer class="px-6 py-10 sm:px-12">
        <hr class="hairline mb-6" />
        <div class="flex flex-wrap items-center justify-between gap-3">
            <span class="eyebrow"
                >Set in Fraunces · Birmingham · {event.romanYear}</span
            >
            <span class="eyebrow"
                >{event.couple.first} &amp; {event.couple.second}</span
            >
        </div>
    </footer>
</main>
