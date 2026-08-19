-- Ruleaza in Supabase Dashboard -> SQL Editor (o singura data).
-- Migreaza `articole` de la o singura poza (poza_url: text) la mai multe
-- (poze: text[]), la fel ca la `locatii`. Idempotent — poate fi rulat din nou
-- fara efecte secundare.

alter table public.articole add column if not exists poze text[] not null default '{}';

-- Backfill: articolele care aveau deja o poza_url devin un array cu un singur element.
update public.articole
set poze = array[poza_url]
where poza_url is not null and poze = '{}';

-- Coloana veche nu mai e folosita de aplicatie (inlocuita de `poze`).
alter table public.articole drop column if exists poza_url;
