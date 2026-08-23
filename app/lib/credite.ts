import { getSupabaseAdmin } from "./supabase/admin";

export type CreditDinamic = {
  id: number;
  poza_url: string;
  referinta: string;
  autor: string;
  licenta: string | null;
  licenta_url: string | null;
  sursa_url: string | null;
  created_at: string;
};

/* Credite adaugate din /admin/locatii si /admin/articole (poze care nu apartin
   arhivei proprii) — tin separat de lista statica din app/data/credite.ts. */
export async function getCrediteDinamice(): Promise<CreditDinamic[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("credite")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Nu s-au putut incarca creditele dinamice:", error.message);
    return [];
  }

  return data ?? [];
}
