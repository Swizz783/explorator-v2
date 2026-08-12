"use server";

import { revalidatePath } from "next/cache";
import { esteAdmin } from "../../lib/admin";
import { getSupabaseAdmin } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";

export type StareFormular = { ok: boolean; mesaj: string } | null;

function extensieSigura(numeFisier: string): string {
  const punct = numeFisier.lastIndexOf(".");
  const bruta = punct !== -1 ? numeFisier.slice(punct + 1) : "";
  const curata = bruta.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return curata || "jpg";
}

export async function adaugaArticol(
  _stareAnterioara: StareFormular,
  formData: FormData,
): Promise<StareFormular> {
  // Reverificam permisiunea aici, server-side — Server Action-urile sunt accesibile
  // direct prin POST, nu doar din UI-ul care ascunde pagina din navigatie.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!esteAdmin(user?.email)) {
    return { ok: false, mesaj: "Nu ai permisiunea sa faci asta." };
  }

  const titlu = String(formData.get("titlu") ?? "").trim();
  const rezumat = String(formData.get("rezumat") ?? "").trim();
  const continut = String(formData.get("continut") ?? "").trim();
  const dataPublicare = String(formData.get("dataPublicare") ?? "").trim();

  if (!titlu) return { ok: false, mesaj: "Titlul e obligatoriu." };
  if (!rezumat) return { ok: false, mesaj: "Rezumatul e obligatoriu." };
  if (!continut) return { ok: false, mesaj: "Conținutul e obligatoriu." };
  if (!dataPublicare) return { ok: false, mesaj: "Data publicării e obligatorie." };

  const supabaseAdmin = getSupabaseAdmin();

  const poza = formData.get("poza");
  let pozaUrl: string | null = null;

  if (poza instanceof File && poza.size > 0) {
    const cale = `${crypto.randomUUID()}.${extensieSigura(poza.name)}`;
    const { error: eroareUpload } = await supabaseAdmin.storage
      .from("articole")
      .upload(cale, poza, { contentType: poza.type || undefined });

    if (eroareUpload) {
      return { ok: false, mesaj: `Nu s-a putut urca poza "${poza.name}": ${eroareUpload.message}` };
    }

    pozaUrl = supabaseAdmin.storage.from("articole").getPublicUrl(cale).data.publicUrl;
  }

  const { error: eroareInsert } = await supabaseAdmin.from("articole").insert({
    titlu,
    rezumat,
    continut,
    data_publicare: dataPublicare,
    poza_url: pozaUrl,
  });

  if (eroareInsert) {
    return { ok: false, mesaj: `Nu s-a putut salva articolul: ${eroareInsert.message}` };
  }

  revalidatePath("/");
  revalidatePath("/blog");

  return { ok: true, mesaj: `„${titlu}" a fost adăugat.` };
}
