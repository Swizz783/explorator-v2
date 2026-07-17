"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { type Loc, type Stil, type Tip } from "../data/locuri";
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
};

export default function Explorator({ locuri }: Props) {
  const [tip, setTip] = useState<Tip | "toate">("toate");
  const [stil, setStil] = useState<Stil | "toate">("toate");
  const [doarNerenovate, setDoarNerenovate] = useState(false);
  const [activLoc, setActivLoc] = useState<Loc | null>(null);

  /* Valorile filtrelor vin din date (ca in proiectul vechi):
     un tip sau stil nou aparut in Supabase primeste automat chip. */
  const tipuri = useMemo(() => [...new Set(locuri.map((l) => l.tip))], [locuri]);
  const stiluri = useMemo(
    () => [...new Set(locuri.map((l) => l.stil).filter((s): s is Stil => s !== null))],
    [locuri],
  );

  /* Filtrele se combina cu SI logic, ca in proiectul vechi (visibleSet).
     Cardurile si pinurile folosesc aceeasi lista filtrata. */
  const locuriFiltrate = useMemo(
    () =>
      locuri.filter(
        (l) =>
          (tip === "toate" || l.tip === tip) &&
          (stil === "toate" || l.stil === stil) &&
          (!doarNerenovate || l.nerenovat),
      ),
    [locuri, tip, stil, doarNerenovate],
  );

  return (
    <div className="flex h-full w-full flex-col">
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
