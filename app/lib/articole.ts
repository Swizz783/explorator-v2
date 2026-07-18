import { supabase } from "./supabase";

export type Articol = {
  id: number;
  titlu: string;
  pozaUrl: string | null;
  rezumat: string;
  continut: string;
  dataPublicare: string;
};

type ArticolRow = {
  id: number;
  titlu: string;
  poza_url: string | null;
  rezumat: string;
  continut: string;
  data_publicare: string;
};

function mapRow(row: ArticolRow): Articol {
  return {
    id: row.id,
    titlu: row.titlu,
    pozaUrl: row.poza_url,
    rezumat: row.rezumat,
    continut: row.continut,
    dataPublicare: row.data_publicare,
  };
}

export async function getArticole(): Promise<Articol[]> {
  const { data, error } = await supabase
    .from("articole")
    .select("*")
    .order("data_publicare", { ascending: false });

  if (error) {
    throw new Error(`Nu s-au putut incarca articolele din Supabase: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}

export async function getUltimeleArticole(n: number): Promise<Articol[]> {
  const { data, error } = await supabase
    .from("articole")
    .select("*")
    .order("data_publicare", { ascending: false })
    .limit(n);

  if (error) {
    throw new Error(`Nu s-au putut incarca articolele din Supabase: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}

export async function getArticolById(id: number): Promise<Articol | null> {
  const { data, error } = await supabase.from("articole").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Nu s-a putut incarca articolul din Supabase: ${error.message}`);
  }

  return data ? mapRow(data) : null;
}
