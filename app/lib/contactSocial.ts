import { supabase } from "./supabase";

export type ContactSocial = {
  instagramUrl: string | null;
  tiktokUrl: string | null;
};

/* Randul unic din `contact_social` — un URL gol/null e tratat identic (dezactivat). */
export async function getContactSocial(): Promise<ContactSocial> {
  const { data, error } = await supabase
    .from("contact_social")
    .select("instagram_url, tiktok_url")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Nu s-au putut incarca link-urile sociale din Supabase: ${error.message}`);
  }

  return {
    instagramUrl: data?.instagram_url || null,
    tiktokUrl: data?.tiktok_url || null,
  };
}
