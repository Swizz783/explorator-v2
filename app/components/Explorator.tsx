"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type Loc, type Stil, type Tip } from "../data/locuri";
import type { Traseu } from "../data/trasee";
import Filtre from "./Filtre";
import LegendaStiluri from "./LegendaStiluri";
import LocCard from "./LocCard";
import LocCardOrizontal from "./LocCardOrizontal";
import LocModal from "./LocModal";

/* Leaflet atinge `window` la import, deci harta se incarca DOAR pe client.
   `ssr: false` e permis numai intr-o componenta client — de asta traieste aici. */
const Harta = dynamic(() => import("./Harta"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-plaster-2 text-sm text-ink-soft">
      Se încarcă harta…
    </div>
  ),
});

type Props = {
  locuri: Loc[];
  initialTip?: Tip | null;
  initialStil?: Stil | null;
  traseu?: Traseu | null;
};

export default function Explorator({
  locuri,
  initialTip = null,
  initialStil = null,
  traseu = null,
}: Props) {
  const [tip, setTip] = useState<Tip | "toate">(initialTip ?? "toate");
  const [stil, setStil] = useState<Stil | "toate">(initialStil ?? "toate");
  const [doarNerenovate, setDoarNerenovate] = useState(false);
  const [activLoc, setActivLoc] = useState<Loc | null>(null);

  /* Un traseu activ restrange lista de baza la locurile lui (dupa nume),
     inaintea oricarui filtru de tip/stil — vezi banner-ul de mai jos. */
  const locuriDeBaza = useMemo(
    () => (traseu ? locuri.filter((l) => traseu.locuriNume.includes(l.nume)) : locuri),
    [locuri, traseu],
  );

  /* Valorile filtrelor vin din date (ca in proiectul vechi):
     un tip sau stil nou aparut in Supabase primeste automat chip. */
  const tipuri = useMemo(() => [...new Set(locuriDeBaza.map((l) => l.tip))], [locuriDeBaza]);
  const stiluri = useMemo(
    () => [...new Set(locuriDeBaza.map((l) => l.stil).filter((s): s is Stil => s !== null))],
    [locuriDeBaza],
  );

  /* Filtrele se combina cu SI logic, ca in proiectul vechi (visibleSet).
     Cand un traseu e activ, filtrele de tip/stil nu se mai aplica —
     traseul arata exact lista lui de locuri. */
  const locuriFiltrate = useMemo(
    () =>
      traseu
        ? locuriDeBaza
        : locuriDeBaza.filter(
            (l) =>
              (tip === "toate" || l.tip === tip) &&
              (stil === "toate" || l.stil === stil) &&
              (!doarNerenovate || l.nerenovat),
          ),
    [locuriDeBaza, tip, stil, doarNerenovate, traseu],
  );

  /* Legenda arata doar stilurile chiar prezente pe harta in acest moment. */
  const stiluriVizibile = useMemo(
    () => [...new Set(locuriFiltrate.map((l) => l.stil).filter((s): s is Stil => s !== null))],
    [locuriFiltrate],
  );

  return (
    <div className="flex h-full w-full flex-col">
      {traseu ? (
        <div className="flex items-center justify-between border-b border-line bg-plaster-2 px-4 py-2.5">
          <div>
            <span className="text-[13px] font-semibold text-ink">{traseu.nume}</span>
            <span className="ml-2 text-[12px] text-ink-soft">
              {traseu.durata} · {locuriFiltrate.length} locuri
            </span>
          </div>
          <Link href="/harta" className="text-[12.5px] font-medium text-brand">
            Ieși din traseu
          </Link>
        </div>
      ) : (
        <Filtre
          tip={tip}
          stil={stil}
          tipuri={tipuri}
          stiluri={stiluri}
          doarNerenovate={doarNerenovate}
          onTip={setTip}
          onStil={setStil}
          onNerenovate={() => setDoarNerenovate((v) => !v)}
        />
      )}
      <LegendaStiluri
        stiluri={stiluriVizibile}
        areFaraStil={locuriFiltrate.some((l) => l.stil === null)}
      />
      {/* Pe desktop, harta si lista stau alaturi, ambele umplu inaltimea fixa a
          paginii (min-h-0 flex-1 md:flex-row), cu scroll intern doar pe lista.
          Pe mobil e alt model: harta sta la o inaltime fixa (dvh, nu vh, ca sa
          urmareasca bara de adrese a browserului — vezi comentariul de mai jos),
          iar sub ea locurile apar intr-un rand orizontal derulabil (carusel),
          nu o lista verticala — pagina intreaga se deruleaza normal, ca pe orice
          alta ruta (vezi si MainArea.tsx, care scoate overflow-hidden pe mobil
          pentru exact ruta asta). */}
      <div className="flex flex-col md:min-h-0 md:flex-1 md:flex-row">
        <div className="h-[55dvh] min-w-0 flex-none md:h-auto md:flex-1">
          <Harta locuri={locuriFiltrate} onSelect={setActivLoc} />
        </div>

        {/* Randul orizontal, doar pe mobil. Fiecare card e ~78% din latimea
            ecranului, ca urmatorul sa se vada partial si sa sugereze ca mai sunt
            de derulat — cu scroll-snap, un swipe aterizeaza curat pe cate un card. */}
        <div className="border-t border-line bg-plaster pb-3.5 pt-3 md:hidden">
          <div className="px-3.5 pb-2 text-xs text-ink-soft">
            {locuriFiltrate.length} locuri afișate
          </div>
          <div className="flex snap-x snap-proximity gap-3 overflow-x-auto px-3.5">
            {locuriFiltrate.map((loc) => (
              <LocCardOrizontal
                key={loc.nume}
                loc={loc}
                activ={activLoc?.nume === loc.nume}
                onClick={() => setActivLoc(loc)}
              />
            ))}
          </div>
        </div>

        {/* Lista verticala, doar pe desktop — neschimbata fata de varianta dinainte
            de redesign-ul de mobil (scroll propriu, langa harta). */}
        <div className="hidden min-h-0 flex-1 overflow-y-auto border-l border-line bg-plaster p-3.5 md:block md:w-[400px] md:max-w-[44vw] md:flex-initial">
          <div className="mb-3 px-1 text-xs text-ink-soft">
            {locuriFiltrate.length} locuri afișate
          </div>
          {locuriFiltrate.map((loc) => (
            <LocCard
              key={loc.nume}
              loc={loc}
              activ={activLoc?.nume === loc.nume}
              onClick={() => setActivLoc(loc)}
            />
          ))}
        </div>
      </div>
      {activLoc && (
        <LocModal loc={activLoc} onClose={() => setActivLoc(null)} />
      )}
    </div>
  );
}
