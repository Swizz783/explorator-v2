-- Ruleaza in Supabase Dashboard -> SQL Editor, dupa schema.sql.
-- Bucket public de Storage + tabel cu metadate pentru poze (nume loc, categorie, ordine).
-- Poza in sine se urca manual, din Dashboard -> Storage -> galerie (pastreaza exact
-- numele original al fisierului, ca sa se potriveasca `poza_path` din galerie_seed.sql).

insert into storage.buckets (id, name, public)
values ('galerie', 'galerie', true)
on conflict (id) do nothing;

create table if not exists public.galerie_poze (
  id bigint generated always as identity primary key,
  nume text not null,
  categorie text not null,
  poza_path text not null,
  ordine integer not null default 0,
  created_at timestamptz not null default now()
);

-- RLS: metadatele sunt publice (aceleasi conditii ca la locatii/articole).
-- Fara politici de insert/update/delete pentru anon/authenticated => scrierea
-- ramane manuala, din dashboard. Bucket-ul de Storage e deja `public`, deci
-- fisierele se servesc direct prin URL public, fara sa mai fie nevoie de
-- politici RLS separate pe storage.objects pentru citire.
alter table public.galerie_poze enable row level security;

drop policy if exists "Galeria e vizibila public" on public.galerie_poze;
create policy "Galeria e vizibila public"
  on public.galerie_poze
  for select
  to anon, authenticated
  using (true);
