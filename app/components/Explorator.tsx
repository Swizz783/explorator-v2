"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { LOCURI, type Stil, type Tip } from "../data/locuri";
import Filtre from "./Filtre";

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

export default function Explorator() {
  const [tip, setTip] = useState<Tip | "toate">("toate");
  const [stil, setStil] = useState<Stil | "toate">("toate");
  const [doarNerenovate, setDoarNerenovate] = useState(false);

  /* Filtrele se combina cu SI logic, ca in proiectul vechi (visibleSet). */
  const locuriFiltrate = useMemo(
    () =>
      LOCURI.filter(
        (l) =>
          (tip === "toate" || l.tip === tip) &&
          (stil === "toate" || l.stil === stil) &&
          (!doarNerenovate || l.nerenovat),
      ),
    [tip, stil, doarNerenovate],
  );

  return (
    <div className="flex h-full w-full flex-col">
      <Filtre
        tip={tip}
        stil={stil}
        doarNerenovate={doarNerenovate}
        onTip={setTip}
        onStil={setStil}
        onNerenovate={() => setDoarNerenovate((v) => !v)}
      />
      <div className="min-h-0 flex-1">
        <Harta locuri={locuriFiltrate} />
      </div>
    </div>
  );
}
