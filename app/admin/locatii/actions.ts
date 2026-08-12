"use server";

import { revalidatePath } from "next/cache";
import { CULOARE_STIL, CULOARE_TIP, type Stil, type Tip } from "../../data/locuri";
import { esteAdmin } from "../../lib/admin";
import { getSupabaseAdmin } from "../../lib/supabase/admin";
import { createClient } from "../../lib/supabase/server";

export type StareFormular = { ok: boolean; mesaj: string } | null;

const TIPURI = Object.keys(CULOARE_TIP) as Tip[];
const STILURI = Object.keys(CULOARE_STIL) as Stil[];

/* "45,5" sau "45.5" -> 45.5; camp gol -> null; text nenumeric -> NaN (semnaleaza eroare). */
function parseNumarOptional(valoare: FormDataEntryValue | null): number | null {
  const text = String(valoare ?? "").trim().replace(",", ".");
  if (!text) return null;
  const numar = Number(text);
  return Number.isFinite(numar) ? numar : NaN;
}

function extensieSigura(numeFisier: string): string {
  const punct = numeFisier.lastIndexOf(".");
  const bruta = punct !== -1 ? numeFisier.slice(punct + 1) : "";
  const curata = bruta.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return curata || "jpg";
}

export async function adaugaLocatie(
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

  const nume = String(formData.get("nume") ?? "").trim();
  const adresa = String(formData.get("adresa") ?? "").trim();
  const an = String(formData.get("an") ?? "").trim();
  const arhitect = String(formData.get("arhitect") ?? "").trim();
  const tip = String(formData.get("tip") ?? "");
  const stilBrut = String(formData.get("stil") ?? "");
  const stil = stilBrut || null;
  const nerenovat = formData.get("nerenovat") === "on";
  const descriereScurta = String(formData.get("descriereScurta") ?? "").trim();
  const descriereLunga = String(formData.get("descriereLunga") ?? "").trim();

  if (!nume) return { ok: false, mesaj: "Numele e obligatoriu." };
  if (!adresa) return { ok: false, mesaj: "Adresa e obligatorie." };
  if (!TIPURI.includes(tip as Tip)) return { ok: false, mesaj: "Alege un tip valid." };
  if (stil && !STILURI.includes(stil as Stil)) return { ok: false, mesaj: "Alege un stil valid." };
  if (!descriereScurta) return { ok: false, mesaj: "Descrierea scurta e obligatorie." };
  if (!descriereLunga) return { ok: false, mesaj: "Descrierea lunga e obligatorie." };

  const lat = parseNumarOptional(formData.get("lat"));
  const lng = parseNumarOptional(formData.get("lng"));
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { ok: false, mesaj: "Latitudinea si longitudinea trebuie sa fie numere." };
  }

  const supabaseAdmin = getSupabaseAdmin();

  const poze = formData
    .getAll("poze")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const urlPoze: string[] = [];
  for (const poza of poze) {
    const cale = `${crypto.randomUUID()}.${extensieSigura(poza.name)}`;
    const { error: eroareUpload } = await supabaseAdmin.storage
      .from("locatii")
      .upload(cale, poza, { contentType: poza.type || undefined });

    if (eroareUpload) {
      return { ok: false, mesaj: `Nu s-a putut urca poza "${poza.name}": ${eroareUpload.message}` };
    }

    urlPoze.push(supabaseAdmin.storage.from("locatii").getPublicUrl(cale).data.publicUrl);
  }

  const { error: eroareInsert } = await supabaseAdmin.from("locatii").insert({
    nume,
    tip,
    stil,
    nerenovat,
    lat,
    lng,
    adresa,
    an,
    arhitect,
    descriere_scurta: descriereScurta,
    descriere_lunga: descriereLunga,
    poze: urlPoze,
  });

  if (eroareInsert) {
    const mesaj =
      eroareInsert.code === "23505"
        ? `Există deja o locație cu numele „${nume}".`
        : `Nu s-a putut salva locația: ${eroareInsert.message}`;
    return { ok: false, mesaj };
  }

  revalidatePath("/", "layout");

  return { ok: true, mesaj: `„${nume}" a fost adăugată.` };
}
