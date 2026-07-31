// Genereaza app/data/iconite-pin.ts din datele lucide-react.
//
// Pin-urile de pe harta sunt construite cu L.divIcon, care primeste HTML ca STRING —
// nu putem randa acolo componente React. Ca sa nu depindem la runtime de interne
// nedocumentate ale pachetului (`__iconNode`), extragem markup-ul o singura data,
// aici, intr-un fisier commis. Ruleaza din nou doar daca schimbi maparea sau
// actualizezi lucide-react: npm run generate:iconite-pin

import { writeFileSync } from "node:fs";
import { join } from "node:path";

/* Numele fisierelor kebab-case din lucide, in ordinea tipurilor din app/data/locuri.ts. */
const MAPARE: Record<string, string> = {
  "Biserica": "church",
  "Cafenea / restaurant": "coffee",
  "Cladire": "building-2",
  "Loc insolit": "sparkles",
  "Monument": "award",
  "Muzeu": "university",
  "Palat": "landmark",
  "Parc": "trees",
  "Pasaj": "door-open",
  "Strada": "signpost",
};

type IconNode = [string, Record<string, string | number>][];

function atributeSvg(attrs: Record<string, string | number>): string {
  return Object.entries(attrs)
    .filter(([nume]) => nume !== "key")
    .map(([nume, val]) => `${nume}="${val}"`)
    .join(" ");
}

async function main() {
  const randuri: string[] = [];

  for (const [tip, fisier] of Object.entries(MAPARE)) {
    const modul = await import(`lucide-react/dist/esm/icons/${fisier}.mjs`);
    const iconNode = modul.__iconNode as IconNode;
    if (!Array.isArray(iconNode)) {
      throw new Error(`Nu am gasit __iconNode pentru "${fisier}" (s-a schimbat structura lucide-react?)`);
    }
    const markup = iconNode.map(([tag, attrs]) => `<${tag} ${atributeSvg(attrs)}/>`).join("");
    randuri.push(`  ${JSON.stringify(tip)}: ${JSON.stringify(markup)},`);
  }

  const continut = `// GENERAT AUTOMAT de scripts/generate-iconite-pin.ts — nu edita manual.
// Sursa: lucide-react (licenta ISC). Regenereaza cu: npm run generate:iconite-pin
//
// Continutul interior al fiecarei icoane lucide (viewBox 24x24), ca string —
// folosit de Harta.tsx, care construieste pin-urile ca HTML pentru L.divIcon.

import type { Tip } from "./locuri";

export const ICONITA_PIN_SVG: Record<Tip, string> = {
${randuri.join("\n")}
};
`;

  const cale = join(process.cwd(), "app", "data", "iconite-pin.ts");
  writeFileSync(cale, continut, "utf-8");
  console.log(`Scris ${Object.keys(MAPARE).length} icoane in ${cale}`);
}

main();
