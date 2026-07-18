// Trasee predeterminate — continut placeholder (nume/descrieri de exemplu),
// de inlocuit cu trasee reale mai tarziu. `locuriNume` trebuie sa fie nume
// exacte din app/data/locuri.ts (sau din tabelul `locatii` din Supabase).

export type Traseu = {
  id: string;
  nume: string;
  durata: string;
  descriere: string;
  locuriNume: string[];
};

export const TRASEE: Traseu[] = [
  {
    id: "centrul-vechi",
    nume: "Centrul Vechi pas cu pas",
    durata: "~2 ore",
    descriere: "De la Curtea Veche la Pasajul Macca-Vilacrosse, prin inima istorică a orașului.",
    locuriNume: [
      "Curtea Veche (Palatul Voievodal)",
      "Hanul lui Manuc",
      "Biserica Stavropoleos",
      "Carturesti Carusel",
      "Pasajul Macca-Vilacrosse",
    ],
  },
  {
    id: "calea-victoriei",
    nume: "Pe Calea Victoriei",
    durata: "~2 ore 30 min",
    descriere:
      "Palate, muzee și o biserică brâncovenească, de-a lungul celei mai elegante artere a Bucureștiului.",
    locuriNume: [
      "Palatul CEC",
      "Muzeul National de Istorie a Romaniei",
      "Muzeul National de Arta al Romaniei",
      "Palatul Telefoanelor",
      "Biserica Kretzulescu",
    ],
  },
  {
    id: "bucurestiul-comunist",
    nume: "Bucureștiul brutalist și comunist",
    durata: "~3 ore",
    descriere:
      "De la Casa Presei Libere la Palatul Parlamentului, prin arhitectura regimului comunist.",
    locuriNume: [
      "Casa Presei Libere",
      "Toboganul din beton",
      "Palatul Parlamentului",
      "Catedrala Mantuirii Neamului",
    ],
  },
];
