-- Engagement Invite — Supabase schema
-- Run in Supabase SQL Editor.

create table if not exists rsvps (
  id          uuid primary key default gen_random_uuid(),
  attending   boolean not null,
  note        text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists rsvp_guests (
  id          uuid primary key default gen_random_uuid(),
  rsvp_id     uuid not null references rsvps(id) on delete cascade,
  name        text not null,
  dietary     text not null default '',
  is_primary  boolean not null default false,
  sort_order  int not null default 0
);

create index if not exists idx_rsvp_guests_rsvp on rsvp_guests(rsvp_id);
create index if not exists idx_rsvps_created_at on rsvps(created_at desc);

-- RLS: lock down direct client access; only the service role (used server-side) can read/write.
alter table rsvps enable row level security;
alter table rsvp_guests enable row level security;
-- (no policies — anon role gets nothing; service-role bypasses RLS)
