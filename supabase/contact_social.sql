-- Ruleaza in Supabase Dashboard -> SQL Editor, dupa schema.sql.
-- Un singur rand cu link-urile de social media afisate in footer.
-- Editare: direct din Table Editor (si de pe telefon) — fara cod, fara deploy.

create table if not exists public.contact_social (
  id bigint generated always as identity primary key,
  instagram_url text,
  tiktok_url text,
  updated_at timestamptz not null default now()
);

-- RLS: citire publica (footer-ul e vizibil pe orice pagina, pentru orice vizitator).
-- Fara politici de insert/update/delete pentru anon/authenticated => scrierea ramane
-- manuala, din dashboard (care actioneaza ca owner si nu e supus RLS).
alter table public.contact_social enable row level security;

drop policy if exists "Contactul social e vizibil public" on public.contact_social;
create policy "Contactul social e vizibil public"
  on public.contact_social
  for select
  to anon, authenticated
  using (true);
