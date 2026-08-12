-- Ruleaza in Supabase Dashboard -> SQL Editor (o singura data).
-- Bucket public de Storage pentru pozele urcate din /admin/locatii.
-- Upload-ul se face doar din Server Action (app/admin/locatii/actions.ts), cu
-- SUPABASE_SERVICE_ROLE_KEY — care trece peste RLS, deci nu e nevoie de politici
-- de insert pe storage.objects. Bucket-ul e `public`, ca fisierele sa fie
-- servite direct prin URL public (acelasi model ca bucket-ul `galerie`).

insert into storage.buckets (id, name, public)
values ('locatii', 'locatii', true)
on conflict (id) do nothing;
