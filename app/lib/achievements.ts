import type { Loc, Stil, Tip } from "../data/locuri";

/* Nume tematice pentru achievements — un nume per tip de loc, per stil arhitectural,
   plus unul special pentru locurile nerenovate. Folosite atat pentru cardurile din
   Profil, cat si pentru toast-urile declansate la deblocare. */
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

export type CategorieAchievement = "tip" | "stil" | "special";

export type Achievement = {
  id: string;
  categorie: CategorieAchievement;
  nume: string;
  eticheta: string;
  descriere: string;
  vizitate: number;
  total: number;
};

/* Calculeaza toate categoriile de achievement (tip, stil, nerenovat) si progresul
   utilizatorului in fiecare — folosit atat pentru grila din Profil, cat si pentru
   a detecta o categorie nou-completata dupa un toggle (vezi VisitedContext). */
export function calculeazaAchievements(locuri: Loc[], visited: Set<string>): Achievement[] {
  const grupuri: {
    id: string;
    categorie: CategorieAchievement;
    nume: string;
    eticheta: string;
    descriere: string;
    locuriGrup: Loc[];
  }[] = [];

  for (const tip of new Set(locuri.map((l) => l.tip))) {
    const locuriGrup = locuri.filter((l) => l.tip === tip);
    grupuri.push({
      id: `tip:${tip}`,
      categorie: "tip",
      nume: NUME_ACHIEVEMENT_TIP[tip],
      eticheta: tip,
      descriere: `Vizitează toate cele ${locuriGrup.length} locuri de tip ${tip}.`,
      locuriGrup,
    });
  }

  for (const stil of new Set(locuri.map((l) => l.stil).filter((s): s is Stil => s !== null))) {
    const locuriGrup = locuri.filter((l) => l.stil === stil);
    grupuri.push({
      id: `stil:${stil}`,
      categorie: "stil",
      nume: NUME_ACHIEVEMENT_STIL[stil],
      eticheta: stil,
      descriere: `Vizitează toate cele ${locuriGrup.length} locuri în stil ${stil}.`,
      locuriGrup,
    });
  }

  const nerenovate = locuri.filter((l) => l.nerenovat);
  if (nerenovate.length > 0) {
    grupuri.push({
      id: ACHIEVEMENT_NERENOVAT_ID,
      categorie: "special",
      nume: NUME_ACHIEVEMENT_NERENOVAT,
      eticheta: "Nerenovat",
      descriere: `Vizitează toate cele ${nerenovate.length} locuri nerenovate.`,
      locuriGrup: nerenovate,
    });
  }

  return grupuri.map((g) => ({
    id: g.id,
    categorie: g.categorie,
    nume: g.nume,
    eticheta: g.eticheta,
    descriere: g.descriere,
    total: g.locuriGrup.length,
    vizitate: g.locuriGrup.filter((l) => visited.has(l.nume)).length,
  }));
}
