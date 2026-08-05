"use client";

import dynamic from "next/dynamic";
import { type Loc } from "../data/locuri";

/* Leaflet atinge `window` la import, deci harta se incarca DOAR pe client.
   `ssr: false` e permis numai intr-o componenta client — de asta traieste aici,
   la fel ca in Explorator. */
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

/* Preview-ul de harta din hero-ul homepage-ului: pinurile reale, dar harta e
   inghetata. Optiunile de interactiune sunt oprite din Leaflet (`interactiv={false}`),
   iar clasa `.harta-statica` scoate pointer-events de pe panourile hartii — vezi
   globals.css. Atributia ramane clicabila, e cerinta OSM/CARTO.
   `aria-hidden` pentru ca e strict decorativ: harta reala e la /harta, iar butonul
   de sub preview duce acolo. */
export default function HartaPreview({ locuri }: Props) {
  return (
    <div
      aria-hidden="true"
      className="harta-statica h-[300px] w-full overflow-hidden rounded-[13px] border border-line bg-plaster-2 sm:h-[360px]"
    >
      <Harta locuri={locuri} interactiv={false} />
    </div>
  );
}
