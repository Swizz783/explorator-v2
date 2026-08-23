"use server";

import { revalidatePath } from "next/cache";
import { esteAdmin } from "../../lib/admin";
import { getSupabaseAdmin } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";

export type StareFormular = { ok: boolean; mesaj: string } | null;

type MetaCredit = { necesitaCredit: boolean; autor: string; sursaUrl: string; licenta: string };

/* Parseaza array-ul JSON de metadate de credit trimis din formular — un
   element per poza, in aceeasi ordine ca urlPoze. Intrare invalida -> []. */
function parseCrediteMeta(formData: FormData): MetaCredit[] {
  try {
    const parsat = JSON.parse(String(formData.get("crediteMeta") ?? "[]"));
    return Array.isArray(parsat) ? parsat : [];
  } catch {
    return [];
  }
}

/* Insereaza in tabela "credite" atribuirile pentru pozele marcate manual ca
   avand nevoie de credit — esecul nu blocheaza salvarea articolului, deja
   facuta; doar il logam. */
async function insereazaCredite(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  urlPoze: string[],
  crediteMeta: MetaCredit[],
  referinta: string,
) {
  for (let i = 0; i < urlPoze.length; i++) {
    const meta = crediteMeta[i];
    if (!meta?.necesitaCredit) continue;

    const autor = String(meta.autor ?? "").trim();
    if (!autor) continue;

    const { error } = await supabaseAdmin.from("credite").insert({
      poza_url: urlPoze[i],
      referinta,
      autor,
      licenta: String(meta.licenta ?? "").trim() || null,
      licenta_url: null,
      sursa_url: String(meta.sursaUrl ?? "").trim() || null,
    });

    if (error) {
      console.error(`Nu s-a putut salva creditul pentru poza "${urlPoze[i]}":`, error.message);
    }
  }
}

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

  const poze = formData
    .getAll("poze")
    .filter((f): f is File => f instanceof File && f.size > 0);

  let urlPoze: string[];
  try {
    urlPoze = await Promise.all(
      poze.map(async (poza) => {
        const cale = `${crypto.randomUUID()}.${extensieSigura(poza.name)}`;
        const { error: eroareUpload } = await supabaseAdmin.storage
          .from("articole")
          .upload(cale, poza, { contentType: poza.type || undefined });

        if (eroareUpload) {
          throw new Error(`Nu s-a putut urca poza "${poza.name}": ${eroareUpload.message}`);
        }

        return supabaseAdmin.storage.from("articole").getPublicUrl(cale).data.publicUrl;
      }),
    );
  } catch (eroare) {
    const mesaj = eroare instanceof Error ? eroare.message : "Nu s-a putut urca una dintre poze.";
    return { ok: false, mesaj };
  }

  const { error: eroareInsert } = await supabaseAdmin.from("articole").insert({
    titlu,
    rezumat,
    continut,
    data_publicare: dataPublicare,
    poze: urlPoze,
  });

  if (eroareInsert) {
    return { ok: false, mesaj: `Nu s-a putut salva articolul: ${eroareInsert.message}` };
  }

  const crediteMeta = parseCrediteMeta(formData);
  await insereazaCredite(supabaseAdmin, urlPoze, crediteMeta, titlu);

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/credite");

  return { ok: true, mesaj: `„${titlu}" a fost adăugat.` };
}
