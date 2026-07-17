// Muta toate locatiile din app/data/locuri.ts in tabelul `locatii` din Supabase.
//
// Necesita SUPABASE_SERVICE_ROLE_KEY (nu cheia anon!), pentru ca RLS blocheaza
// scrierea publica pe tabelul `locatii` (vezi supabase/schema.sql). Cheia se ia din
// Supabase Dashboard -> Project Settings -> API -> service_role secret key, se
// adauga temporar in .env.local (NU cu prefix NEXT_PUBLIC_, ca sa nu ajunga in
// bundle-ul de browser) si se poate sterge dupa ce rulezi scriptul.
//
// Ruleaza cu: npm run migrate:locatii
//
// Alternativa fara cheie: npm run generate:seed-sql, apoi ruleaza
// supabase/schema.sql si supabase/seed.sql direct in Supabase SQL Editor.

import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
import { LOCURI } from "../app/data/locuri";

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Lipseste NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Adauga SUPABASE_SERVICE_ROLE_KEY (din Supabase Dashboard -> Settings -> API) si reincearca,\n" +
      "sau foloseste `npm run generate:seed-sql` pentru varianta fara cheie.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function main() {
  const rows = LOCURI.map((loc) => ({
    nume: loc.nume,
    tip: loc.tip,
    stil: loc.stil,
    nerenovat: loc.nerenovat,
    lat: loc.lat,
    lng: loc.lng,
    adresa: loc.adresa,
    an: loc.an,
    arhitect: loc.arhitect,
    descriere_scurta: loc.descriereScurta,
    descriere_lunga: loc.descriereLunga,
    poze: loc.poze,
  }));

  const { data, error } = await supabase
    .from("locatii")
    .upsert(rows, { onConflict: "nume" })
    .select("nume");

  if (error) {
    console.error("Migrarea a esuat:", error.message);
    process.exit(1);
  }

  console.log(`${data?.length ?? 0} locatii scrise in Supabase (upsert dupa "nume").`);
}

main();
