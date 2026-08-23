-- Ruleaza in Supabase Dashboard -> SQL Editor, dupa schema.sql.
-- Tabel pentru atribuirile de credit foto adaugate din /admin/locatii si
-- /admin/articole, pentru pozele care nu apartin arhivei proprii. Scrierea
-- se face din server actions (getSupabaseAdmin(), dupa esteAdmin()), citirea
-- dinamica din app/credite se face tot prin getSupabaseAdmin() — tabela nu
-- are nevoie de politii de insert/select pentru anon/authenticated.

create table if not exists public.credite (
  id bigint generated always as identity primary key,
  poza_url text not null,
  referinta text not null,
  autor text not null,
  licenta text,
  licenta_url text,
  sursa_url text,
  created_at timestamptz not null default now()
);

alter table public.credite enable row level security;
