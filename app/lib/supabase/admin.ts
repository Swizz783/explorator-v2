import { createClient } from "@supabase/supabase-js";

/* Client cu cheia service_role — trece peste RLS. Creat abia la apel (nu la
   import), ca modulul sa nu esueze la incarcare intr-un mediu unde
   SUPABASE_SERVICE_ROLE_KEY nu e configurata dar care oricum nu ajunge sa
   foloseasca /admin/locatii. Foloseste-l DOAR in cod care ruleaza garantat pe
   server si care a verificat deja permisiunile (Server Action din
   /admin/locatii, dupa esteAdmin()). Nu importa niciodata acest fisier
   dintr-o Client Component. */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Lipsesc NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY din .env.local",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
