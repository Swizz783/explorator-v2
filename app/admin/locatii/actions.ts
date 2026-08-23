"use server";

import { revalidatePath } from "next/cache";
import { CULOARE_STIL, CULOARE_TIP, type Stil, type Tip } from "../../data/locuri";
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
   avand nevoie de credit — esecul nu blocheaza salvarea locatiei/articolului,
   deja facuta; doar il logam. */
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

export type UrlUrcare = { cale: string; signedUrl: string; token: string; publicUrl: string };
export type RezultatUrlUrcare =
  | { ok: true; urlUri: UrlUrcare[] }
  | { ok: false; mesaj: string };

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

/* Genereaza URL-uri de urcare semnate pentru bucket-ul "locatii" — pozele se
   urca apoi direct din browser catre Supabase Storage, ca sa ocolim limita
   fixa de 4.5MB per request pentru Server Actions pe Vercel. */
export async function obtineUrlUrcare(numeFisiere: string[]): Promise<RezultatUrlUrcare> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!esteAdmin(user?.email)) {
    return { ok: false, mesaj: "Nu ai permisiunea sa faci asta." };
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    const urlUri = await Promise.all(
      numeFisiere.map(async (numeFisier) => {
        const cale = `${crypto.randomUUID()}.${extensieSigura(numeFisier)}`;
        const { data, error } = await supabaseAdmin.storage
          .from("locatii")
          .createSignedUploadUrl(cale);

        if (error || !data) {
          throw new Error(
            `Nu s-a putut genera URL de urcare pentru "${numeFisier}": ${error?.message ?? "eroare necunoscuta"}`,
          );
        }

        const publicUrl = supabaseAdmin.storage.from("locatii").getPublicUrl(cale).data.publicUrl;

        return { cale, signedUrl: data.signedUrl, token: data.token, publicUrl };
      }),
    );

    return { ok: true, urlUri };
  } catch (eroare) {
    const mesaj =
      eroare instanceof Error ? eroare.message : "Nu s-au putut genera URL-urile de urcare.";
    return { ok: false, mesaj };
  }
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

  const urlPoze = formData
    .getAll("poze")
    .map((v) => String(v).trim())
    .filter(Boolean);

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

  const crediteMeta = parseCrediteMeta(formData);
  await insereazaCredite(supabaseAdmin, urlPoze, crediteMeta, nume);

  revalidatePath("/", "layout");

  return { ok: true, mesaj: `„${nume}" a fost adăugată.` };
}
