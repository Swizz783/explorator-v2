import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Lipsesc NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY din .env.local",
  );
}

/* Client Supabase de browser — sesiunea vine din acelasi cookie folosit pe server
   (@supabase/ssr), asa ca scrierile din client (ex. toggle vizitat) sunt autentificate. */
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
