"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CULOARE_FARA_STIL, CULOARE_STIL, type Stil } from "../data/locuri";

type Props = {
  /* Stilurile prezente in lista curenta de locuri — legenda arata doar ce se vede pe harta. */
  stiluri: Stil[];
  /* Exista in lista si locuri fara stil declarat? Atunci aratam si culoarea neutra. */
  areFaraStil: boolean;
};

/* Cheia de culori a pinurilor: fiecare stil arhitectural cu culoarea lui, ca
   utilizatorul sa inteleaga harta fara sa deschida fiecare pin.

   Pe mobil ar manca prea mult din inaltimea fixa a ecranului (se rupe pe 3-4
   randuri), asa ca sub `md` sta pliata dupa un buton "Legendă". De la `md` in sus
   e afisata mereu, ca inainte — de-asta continutul are `md:flex`, care bate
   `hidden`-ul de cand e inchisa. */
export default function LegendaStiluri({ stiluri, areFaraStil }: Props) {
  const [deschis, setDeschis] = useState(false);

  if (stiluri.length === 0 && !areFaraStil) return null;

  return (
    <div className="border-b border-line bg-plaster px-4 py-2">
      <button
        type="button"
        onClick={() => setDeschis((v) => !v)}
        aria-expanded={deschis}
        aria-controls="legenda-continut"
        className="-my-1 flex min-h-[32px] items-center gap-1.5 py-1 pr-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft transition hover:text-ink md:hidden"
      >
        Legendă
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform ${deschis ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="legenda-continut"
        className={`flex-wrap items-center gap-x-3.5 gap-y-1.5 md:mt-0 md:flex ${
          deschis ? "mt-2 flex" : "hidden"
        }`}
      >
        <span className="hidden text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft md:inline">
          Culoarea pinului
        </span>
        {stiluri.map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
            <span
              className="h-2.5 w-2.5 flex-none rounded-full"
              style={{ background: CULOARE_STIL[s] }}
            />
            {s}
          </span>
        ))}
        {areFaraStil && (
          <span className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
            <span
              className="h-2.5 w-2.5 flex-none rounded-full"
              style={{ background: CULOARE_FARA_STIL }}
            />
            Fără stil declarat
          </span>
        )}
      </div>
    </div>
  );
}
