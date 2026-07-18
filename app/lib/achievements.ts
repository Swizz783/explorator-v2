import type { Loc, Stil, Tip } from "../data/locuri";

/* Nume tematice pentru achievements — un nume per tip de loc, per stil arhitectural,
   plus unul special pentru locurile nerenovate. Folosite atat pentru badge-urile
   statice din Profil, cat si pentru toast-urile declansate la deblocare. */
export const NUME_ACHIEVEMENT_TIP: Record<Tip, string> = {
  "Cladire": "Cititorul de fațade",
  "Palat": "Printre palate",
  "Parc": "Plămânii orașului",
  "Biserica": "Pelerinul",
  "Muzeu": "Șoarece de muzeu",
  "Loc insolit": "Ochi pentru ciudățenii",
  "Strada": "Hoinarul",
  "Monument": "De neuitat",
  "Cafenea / restaurant": "La un pahar de istorie",
  "Pasaj": "Pe sub oraș",
};

export const NUME_ACHIEVEMENT_STIL: Record<Stil, string> = {
  "Comunist / brutalist": "Beton și tăcere",
  "Interbelic / art deco": "Linia interbelică",
  "Neogotic": "Arcuri frânte",
  "Neoromanesc": "Rădăcini noi",
  "Neoclasic / eclectic": "Coloane și cornișe",
  "Brancovenesc": "Moștenirea brâncovenească",
};

export const NUME_ACHIEVEMENT_NERENOVAT = "Exploratorul ruinelor";

export const ACHIEVEMENT_NERENOVAT_ID = "nerenovat";

export type Achievement = {
  id: string;
  nume: string;
  eticheta: string;
  vizitate: number;
  total: number;
};

/* Calculeaza toate categoriile de achievement (tip, stil, nerenovat) si progresul
   utilizatorului in fiecare — folosit atat pentru lista din Profil, cat si pentru
   a detecta o categorie nou-completata dupa un toggle (vezi VisitedContext). */
export function calculeazaAchievements(locuri: Loc[], visited: Set<string>): Achievement[] {
  const grupuri: { id: string; nume: string; eticheta: string; locuriGrup: Loc[] }[] = [];

  for (const tip of new Set(locuri.map((l) => l.tip))) {
    grupuri.push({
      id: `tip:${tip}`,
      nume: NUME_ACHIEVEMENT_TIP[tip],
      eticheta: tip,
      locuriGrup: locuri.filter((l) => l.tip === tip),
    });
  }

  for (const stil of new Set(locuri.map((l) => l.stil).filter((s): s is Stil => s !== null))) {
    grupuri.push({
      id: `stil:${stil}`,
      nume: NUME_ACHIEVEMENT_STIL[stil],
      eticheta: stil,
      locuriGrup: locuri.filter((l) => l.stil === stil),
    });
  }

  const nerenovate = locuri.filter((l) => l.nerenovat);
  if (nerenovate.length > 0) {
    grupuri.push({
      id: ACHIEVEMENT_NERENOVAT_ID,
      nume: NUME_ACHIEVEMENT_NERENOVAT,
      eticheta: "Nerenovat",
      locuriGrup: nerenovate,
    });
  }

  return grupuri.map((g) => ({
    id: g.id,
    nume: g.nume,
    eticheta: g.eticheta,
    total: g.locuriGrup.length,
    vizitate: g.locuriGrup.filter((l) => visited.has(l.nume)).length,
  }));
}
