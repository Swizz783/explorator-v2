"use client";

import dynamic from "next/dynamic";

/* Leaflet atinge `window` la import, deci harta se incarca DOAR pe client.
   `ssr: false` e permis numai intr-o componenta client — de asta exista
   acest wrapper, nu se poate direct in page.tsx (Server Component). */
const Harta = dynamic(() => import("./Harta"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-plaster-2 text-sm text-ink-soft">
      Se încarcă harta…
    </div>
  ),
});

export default Harta;
