// Genereaza supabase/seed.sql din app/data/locuri.ts, ca alternativa la
// scripts/migrate-locatii.ts pentru cazul in care nu vrei sa folosesti
// service_role key. Fisierul rezultat se ruleaza direct in Supabase SQL Editor
// (dupa supabase/schema.sql) — Editorul scrie ca owner, deci RLS nu blocheaza.
//
// Ruleaza cu: npm run generate:seed-sql

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { LOCURI } from "../app/data/locuri";

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlNullableString(value: string | null): string {
  return value === null ? "null" : sqlString(value);
}

function sqlNullableNumber(value: number | null): string {
  return value === null ? "null" : String(value);
}

function sqlStringArray(values: string[]): string {
  if (values.length === 0) return "'{}'";
  return `array[${values.map(sqlString).join(", ")}]`;
}

const rows = LOCURI.map((loc) => {
  const values = [
    sqlString(loc.nume),
    sqlString(loc.tip),
    sqlNullableString(loc.stil),
    loc.nerenovat ? "true" : "false",
    sqlNullableNumber(loc.lat),
    sqlNullableNumber(loc.lng),
    sqlString(loc.adresa),
    sqlString(loc.an),
    sqlString(loc.arhitect),
    sqlString(loc.descriereScurta),
    sqlString(loc.descriereLunga),
    sqlStringArray(loc.poze),
  ];
  return `  (${values.join(", ")})`;
}).join(",\n");

const sql = `-- Generat automat din app/data/locuri.ts de scripts/generate-seed-sql.ts.
-- Ruleaza dupa supabase/schema.sql, direct in Supabase Dashboard -> SQL Editor.

insert into public.locatii
  (nume, tip, stil, nerenovat, lat, lng, adresa, an, arhitect, descriere_scurta, descriere_lunga, poze)
values
${rows}
on conflict (nume) do update set
  tip = excluded.tip,
  stil = excluded.stil,
  nerenovat = excluded.nerenovat,
  lat = excluded.lat,
  lng = excluded.lng,
  adresa = excluded.adresa,
  an = excluded.an,
  arhitect = excluded.arhitect,
  descriere_scurta = excluded.descriere_scurta,
  descriere_lunga = excluded.descriere_lunga,
  poze = excluded.poze;
`;

const outPath = join(process.cwd(), "supabase", "seed.sql");
writeFileSync(outPath, sql, "utf-8");
console.log(`Scris ${LOCURI.length} locatii in ${outPath}`);
