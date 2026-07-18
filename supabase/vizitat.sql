-- Ruleaza in Supabase Dashboard -> SQL Editor, dupa schema.sql.
-- Leaga fiecare utilizator autentificat de locatiile pe care le-a marcat ca vizitate.

create table if not exists public.vizitat (
  user_id uuid not null references auth.users (id) on delete cascade,
  locatie_nume text not null references public.locatii (nume) on delete cascade,
  vizitat_la timestamptz not null default now(),
  primary key (user_id, locatie_nume)
);

-- Row Level Security: fiecare utilizator vede si modifica DOAR propriile randuri.
-- Fara politici pentru rolul anon => vizitatorii neautentificati nu au niciun acces
-- (progresul lor ramane local, in localStorage, ca inainte).
alter table public.vizitat enable row level security;

drop policy if exists "Utilizatorii isi vad propriul progres" on public.vizitat;
create policy "Utilizatorii isi vad propriul progres"
  on public.vizitat for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Utilizatorii isi adauga propriul progres" on public.vizitat;
create policy "Utilizatorii isi adauga propriul progres"
  on public.vizitat for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Utilizatorii isi sterg propriul progres" on public.vizitat;
create policy "Utilizatorii isi sterg propriul progres"
  on public.vizitat for delete
  to authenticated
  using (auth.uid() = user_id);
