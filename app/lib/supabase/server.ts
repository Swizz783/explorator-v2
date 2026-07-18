import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Lipsesc NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY din .env.local",
  );
}

/* Client Supabase pe server, cu sesiunea citita/scrisa din cookie-uri —
   necesar pentru autentificare (Server Components, Server Actions, Route Handlers).
   Se creeaza din nou la fiecare request, pentru ca `cookies()` e legat de request. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // .set() apelat dintr-o Server Component (fara acces la raspuns) —
          // se poate ignora, `proxy.ts` reimprospateaza oricum sesiunea la fiecare request.
        }
      },
    },
  });
}
