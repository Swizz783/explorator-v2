import { supabase } from "./supabase";
import type { Loc, Stil, Tip } from "../data/locuri";

type LocatieRow = {
  nume: string;
  tip: string;
  stil: string | null;
  nerenovat: boolean;
  lat: number | null;
  lng: number | null;
  adresa: string;
  an: string;
  arhitect: string;
  descriere_scurta: string;
  descriere_lunga: string;
  poze: string[];
};

function mapRow(row: LocatieRow): Loc {
  return {
    nume: row.nume,
    tip: row.tip as Tip,
    stil: row.stil as Stil | null,
    nerenovat: row.nerenovat,
    lat: row.lat,
    lng: row.lng,
    adresa: row.adresa,
    an: row.an,
    arhitect: row.arhitect,
    descriereScurta: row.descriere_scurta,
    descriereLunga: row.descriere_lunga,
    poze: row.poze ?? [],
  };
}

export async function getLocuri(): Promise<Loc[]> {
  const { data, error } = await supabase
    .from("locatii")
    .select("*")
    .order("nume", { ascending: true });

  if (error) {
    throw new Error(`Nu s-au putut incarca locatiile din Supabase: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}
