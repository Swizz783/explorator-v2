"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type Loc, type Stil, type Tip } from "../data/locuri";
import type { Traseu } from "../data/trasee";
import Filtre from "./Filtre";
import LegendaStiluri from "./LegendaStiluri";
import LocCard from "./LocCard";
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
      {/* Sub `md` harta si lista se stivuiesc: harta sus, pe majoritatea ecranului,
          lista dedesubt cu scroll propriu. Inaltimea hartii e in `dvh`, nu `vh`, ca
          sa urmareasca bara de adrese a browserului mobil (cu `vh` harta ar fi
          taiata de bara). De la `md` in sus revin una langa alta, ca inainte. */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="h-[55dvh] min-w-0 flex-none md:h-auto md:flex-1">
          <Harta locuri={locuriFiltrate} onSelect={setActivLoc} />
        </div>
        {/* Zona listei arata clar ca un panou cu scroll propriu, separat de harta
            de deasupra (nu pagina intreaga): umbra + bordura mai groasa sus, un
            "maner" vizual (ca la un bottom sheet) si un header cu contorul, lipit
            de sus cat timp lista se deruleaza (sticky), ca reperul sa ramana mereu
            vizibil. Pe desktop dispar toate astea trei — header-ul revine la eticheta
            discreta de dinainte, fara sticky/bordura/maner. */}
        <div className="relative min-h-0 flex-1 scroll-smooth overflow-y-auto border-t-2 border-line bg-plaster shadow-[0_-6px_14px_rgba(33,30,24,0.09)] md:w-[400px] md:max-w-[44vw] md:flex-initial md:border-t-0 md:border-l md:shadow-none">
          <div className="flex justify-center pt-2 md:hidden" aria-hidden="true">
            <span className="h-1 w-9 rounded-full bg-line" />
          </div>
          <div className="sticky top-0 z-10 border-b border-line bg-plaster px-3.5 py-2.5 text-[13px] font-semibold text-ink md:static md:mb-3 md:border-b-0 md:bg-transparent md:px-1 md:pb-0 md:pt-3.5 md:text-xs md:font-normal md:text-ink-soft">
            {locuriFiltrate.length} locuri afișate
          </div>
          <div className="px-3.5 pb-3.5 pt-3 md:px-3.5 md:pb-3.5 md:pt-0">
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
      </div>
      {activLoc && (
        <LocModal loc={activLoc} onClose={() => setActivLoc(null)} />
      )}
    </div>
  );
}
