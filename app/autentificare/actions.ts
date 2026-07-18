"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

/* Traduceri pentru cele mai frecvente mesaje de eroare Supabase Auth;
   restul mesajelor (mai rare) sunt afisate asa cum vin de la API. */
function traduError(mesaj: string): string {
  const harta: Record<string, string> = {
    "Invalid login credentials": "Email sau parolă incorectă.",
    "Email not confirmed": "Trebuie să confirmi emailul înainte de a te autentifica.",
    "User already registered": "Există deja un cont cu acest email.",
  };
  return harta[mesaj] ?? mesaj;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const parola = String(formData.get("parola") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parola,
  });

  if (error) {
    redirect(`/autentificare?eroare=${encodeURIComponent(traduError(error.message))}`);
  }

  // Fara asta, layout-ul (header-ul) poate ramane cu starea veche de autentificare
  // in cache-ul de rutare al Next.js dupa redirect — vezi nota din docs la `redirect`.
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const parola = String(formData.get("parola") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: parola,
  });

  if (error) {
    redirect(`/autentificare?eroare=${encodeURIComponent(traduError(error.message))}`);
  }

  // Daca proiectul Supabase are dezactivata confirmarea prin email,
  // signUp autentifica direct utilizatorul (sesiune disponibila imediat).
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  redirect(
    `/autentificare?mesaj=${encodeURIComponent(
      "Cont creat! Verifică-ți emailul ca să confirmi contul, apoi autentifică-te.",
    )}`,
  );
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/autentificare?eroare=${encodeURIComponent(traduError(error.message))}`);
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
