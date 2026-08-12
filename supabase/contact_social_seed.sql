-- Ruleaza dupa contact_social.sql, direct in Supabase Dashboard -> SQL Editor.
-- Randul unic, cu URL-urile si username-urile goale — completeaza-le oricand direct
-- din Table Editor (inclusiv de pe telefon): un URL gol => iconita apare dezactivata
-- in footer; un username gol (dar URL completat) => apare doar iconita, fara text.

insert into public.contact_social
  (instagram_url, tiktok_url, facebook_url, instagram_username, tiktok_username, facebook_username)
values ('', '', '', '', '', '');
