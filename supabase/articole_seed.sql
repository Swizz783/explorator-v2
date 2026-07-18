-- Ruleaza dupa articole.sql, direct in Supabase Dashboard -> SQL Editor.
-- 3 articole PLACEHOLDER, ca sa poti testa sectiunile de blog — inlocuieste-le
-- cu continut real oricand direct din Table Editor.

insert into public.articole (titlu, poza_url, rezumat, continut, data_publicare)
values
  (
    'Articol placeholder #1 — de inlocuit cu continut real',
    null,
    'Acesta este un rezumat placeholder de o propozitie-doua, cat sa vezi cum arata un card de articol pe homepage si pe /blog.',
    'Acesta este continutul complet placeholder al articolului. Inlocuieste acest text din Supabase Table Editor cu materialul real — de exemplu povestea unei cladiri, un ghid de cartier sau un interviu.

Poti folosi paragrafe multiple; ele se pastreaza la afisare.',
    '2026-07-01'
  ),
  (
    'Articol placeholder #2 — de inlocuit cu continut real',
    null,
    'Al doilea rezumat placeholder, pentru a verifica randul de "Ultimele articole" cu mai multe carduri.',
    'Continut placeholder pentru al doilea articol. Aici ar putea sta, de exemplu, o cronologie a unui stil arhitectural sau un traseu comentat.',
    '2026-06-20'
  ),
  (
    'Articol placeholder #3 — de inlocuit cu continut real',
    null,
    'Al treilea rezumat placeholder, ca homepage-ul sa afiseze exact 3 articole in "Ultimele articole".',
    'Continut placeholder pentru al treilea articol.',
    '2026-06-05'
  );
