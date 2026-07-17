-- Ruleaza in Supabase Dashboard -> SQL Editor (o singura data).
-- Creeaza tabelul `locatii` cu aceleasi campuri ca app/data/locuri.ts.

create table if not exists public.locatii (
  id bigint generated always as identity primary key,
  nume text not null unique,
  tip text not null,
  stil text,
  nerenovat boolean not null default false,
  lat double precision,
  lng double precision,
  adresa text not null default '',
  an text not null default '',
  arhitect text not null default '',
  descriere_scurta text not null default '',
  descriere_lunga text not null default '',
  poze text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Row Level Security: datele despre locatii sunt publice (afisate tuturor
-- vizitatorilor site-ului), dar doar citirea e permisa prin cheia anon.
-- Scrierea (insert/update/delete) ramane blocata pentru anon/authenticated;
-- se face doar din Supabase Dashboard sau cu service_role key (vezi scripts/migrate-locatii.ts).
alter table public.locatii enable row level security;

drop policy if exists "Locatiile sunt vizibile public" on public.locatii;
create policy "Locatiile sunt vizibile public"
  on public.locatii
  for select
  to anon, authenticated
  using (true);
