import { createClient } from "./supabase/server";

/* Numele locatiilor marcate ca vizitate de un utilizator autentificat.
   RLS pe tabelul `vizitat` limiteaza oricum rezultatul la randurile proprii,
   dar filtram explicit dupa user_id pentru claritate. */
export async function getVizitatePentruUser(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vizitat")
    .select("locatie_nume")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Nu s-a putut incarca progresul din Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => row.locatie_nume as string);
}
