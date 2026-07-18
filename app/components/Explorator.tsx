"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type Loc, type Stil, type Tip } from "../data/locuri";
import type { Traseu } from "../data/trasee";
import Filtre from "./Filtre";
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
          <Link href="/harta" className="text-[12.5px] font-medium text-enamel">
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
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <Harta locuri={locuriFiltrate} onSelect={setActivLoc} />
        </div>
        <div className="w-[400px] max-w-[44vw] scroll-smooth overflow-y-auto border-l border-line bg-plaster p-3.5">
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
