-- Ruleaza in Supabase Dashboard -> SQL Editor, dupa schema.sql.
-- Tabel pentru blogul aplicatiei. Scrierea se face din /admin/articole.
-- Pe o baza existenta (creata inainte de coloana `poze`), ruleaza si
-- articole_migrare_poze.sql, care migreaza de la poza_url la poze.

create table if not exists public.articole (
  id bigint generated always as identity primary key,
  titlu text not null,
  poze text[] not null default '{}',
  rezumat text not null,
  continut text not null,
  data_publicare date not null default current_date,
  created_at timestamptz not null default now()
);

-- RLS: articolele sunt continut public, citire libera. Fara politici de
-- insert/update/delete pentru anon/authenticated => scrierea ramane manuala,
-- din dashboard (care actioneaza ca owner si nu e supus RLS).
alter table public.articole enable row level security;

drop policy if exists "Articolele sunt vizibile public" on public.articole;
create policy "Articolele sunt vizibile public"
  on public.articole
  for select
  to anon, authenticated
  using (true);
