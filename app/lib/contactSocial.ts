import { supabase } from "./supabase";

export type ContactSocial = {
  instagramUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  /* Username afisat langa iconita (ex. "@bucquest"), separat de URL — optional,
     independent de el: un URL fara username arata doar iconita, ca inainte. */
  instagramUsername: string | null;
  tiktokUsername: string | null;
  facebookUsername: string | null;
};

/* Randul unic din `contact_social` — un URL gol/null e tratat identic (dezactivat).
   `select("*")` in loc de lista de coloane: daca o coloana noua inca nu exista in
   Supabase (codul e pe productie inainte sa fie rulat SQL-ul), o lista explicita ar
   intoarce eroare si ar pica TOATE iconitele. Asa, doar cea lipsa iese null. */
export async function getContactSocial(): Promise<ContactSocial> {
  const { data, error } = await supabase
    .from("contact_social")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Nu s-au putut incarca link-urile sociale din Supabase: ${error.message}`);
  }

  return {
    instagramUrl: data?.instagram_url || null,
    tiktokUrl: data?.tiktok_url || null,
    facebookUrl: data?.facebook_url || null,
    instagramUsername: data?.instagram_username || null,
    tiktokUsername: data?.tiktok_username || null,
    facebookUsername: data?.facebook_username || null,
  };
}
