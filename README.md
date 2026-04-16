# Engagement Invite

A single-page invitation + RSVP collector for **Devin & Jessica's** engagement
party. Editorial / fashion-magazine aesthetic. SvelteKit · Svelte 5 runes ·
Tailwind v4 · Supabase Postgres · Vercel.

---

## What's here

- `/` — the invite. Cover, date, venue, parking, dress code, RSVP form.
- `/admin` — passcode-gated list of all replies (totals + per-party detail).

Guests RSVP for their entire party — couples and families enter each
person's name individually so the headcount is exact.

## Edit event details

Everything that appears on the invite (date, time, venue, dress code, RSVP
deadline, etc.) lives in **one file**:

```
src/lib/config.ts
```

Change a value, save, the whole page updates.

## Local development

```bash
npm install
cp .env.example .env   # fill in real values, see below
npm run dev
```

Open http://localhost:5173 (or whatever port Vite reports).

## Supabase setup (cloud — 5 minutes)

1. Create a free project at <https://supabase.com>.
2. In the project, open **SQL Editor** → **New query** → paste the contents of
   [`sql/schema.sql`](./sql/schema.sql) → **Run**. This creates the `rsvps` and
   `rsvp_guests` tables with row-level security locked down.
3. Open **Project Settings → API**. Copy:
   - `Project URL` → into `SUPABASE_URL`
   - `service_role` key (under "Project API keys") → into
     `SUPABASE_SERVICE_ROLE_KEY`

> The `service_role` key bypasses RLS and is only ever used server-side
> (`src/lib/server/supabase.ts`). It never reaches the browser.

## Environment variables

Put these in `.env` for local dev, and in **Vercel → Settings → Environment
Variables** for production:

| Variable                    | What                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| `SUPABASE_URL`              | Your project URL (from Supabase API settings)                       |
| `SUPABASE_SERVICE_ROLE_KEY` | The `service_role` key (server-only — keep secret)                  |
| `ADMIN_PASSCODE`            | Whatever you'll type to view the RSVP list at `/admin`              |
| `ADMIN_COOKIE_SECRET`       | Random 32+ character string. Generate: `openssl rand -hex 32`       |

## Deploying to Vercel

1. Push this folder to a new GitHub repo.
2. <https://vercel.com/new> → import the repo.
3. Framework auto-detects as SvelteKit. Leave build settings on default.
4. Add the 4 environment variables above in the import screen (or under
   Project → Settings → Environment Variables).
5. Deploy.

### Custom subdomain

In Vercel → Project → **Domains**, add your subdomain (e.g.
`engaged.yourdomain.com`). Vercel shows the CNAME record to add at your DNS
provider; copy it in and the domain goes live in a few minutes.

## Viewing RSVPs

Visit `/admin` on whatever domain you're running on. Enter `ADMIN_PASSCODE`.
You'll see:

- Totals across the top: parties · attending · declining · total guest headcount
- Each party as a card with every guest's name, dietary notes, and any note
  they wrote.

Click **Sign out** in the top right to clear the cookie.

## Tech notes

- **Form actions** (`src/routes/+page.server.ts`) handle the submit. Native
  `<form method="POST">` + Svelte's `use:enhance` give a smooth no-reload
  confirmation when JS is on, and a full-page-POST fallback when it isn't.
- **No client-side database access.** The browser bundle never imports
  `@supabase/supabase-js` — all DB work happens in `+page.server.ts` /
  `admin/+page.server.ts`. The `src/lib/server/` directory is enforced
  server-only by SvelteKit at build time.
- **Admin auth** is a single-passcode HMAC-signed cookie (no users table, no
  third-party auth). See `src/lib/server/auth.ts`.
- **Type-check**: `npm run check`.

## File map

```
src/
├── lib/
│   ├── config.ts              ← event details (edit me)
│   ├── types.ts               ← Rsvp / Guest TypeScript types
│   └── server/
│       ├── supabase.ts        ← service-role client (server-only)
│       └── auth.ts            ← passcode + HMAC cookie helpers
└── routes/
    ├── +layout.svelte         ← wraps the app, loads layout.css
    ├── layout.css             ← Tailwind theme tokens + global styles
    ├── +page.svelte           ← the invite UI + RSVP form
    ├── +page.server.ts        ← submitRsvp form action
    └── admin/
        ├── +page.svelte       ← passcode form OR list view
        └── +page.server.ts    ← cookie auth + load RSVP list
sql/
└── schema.sql                 ← run this in Supabase SQL Editor
```
