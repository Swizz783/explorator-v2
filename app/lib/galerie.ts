import { supabase } from "./supabase";

export type PozaGalerie = {
  id: number;
  nume: string;
  categorie: string;
  url: string;
  ordine: number;
};

type GaleriePozaRow = {
  id: number;
  nume: string;
  categorie: string;
  poza_path: string;
  ordine: number;
};

function urlPublic(pozaPath: string): string {
  return supabase.storage.from("galerie").getPublicUrl(pozaPath).data.publicUrl;
}

export async function getGaleriePoze(): Promise<PozaGalerie[]> {
  const { data, error } = await supabase
    .from("galerie_poze")
    .select("*")
    .order("categorie", { ascending: true })
    .order("ordine", { ascending: true });

  if (error) {
    throw new Error(`Nu s-au putut incarca pozele din galerie: ${error.message}`);
  }

  return (data ?? []).map((row: GaleriePozaRow) => ({
    id: row.id,
    nume: row.nume,
    categorie: row.categorie,
    ordine: row.ordine,
    url: urlPublic(row.poza_path),
  }));
}
