import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";

/* Destinatia redirectTo dupa consimtamantul Google — schimba `code`-ul primit
   pe o sesiune Supabase (cookie), apoi trimite utilizatorul inapoi in aplicatie. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(
    `${origin}/autentificare?eroare=${encodeURIComponent("Autentificarea cu Google a eșuat.")}`,
  );
}
