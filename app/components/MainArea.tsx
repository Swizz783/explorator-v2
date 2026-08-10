"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* Pe desktop, `/harta` trebuie sa umple exact spatiul ramas intre header si
   footer, cu scroll intern (harta + lista), nu scroll de pagina — de-asta ii dam
   min-h-0 (permite flex-item-ului sa se micsoreze sub inaltimea "naturala" a
   continutului) + overflow-hidden, dar DOAR de la `md` in sus: pe mobil, harta
   sta la o inaltime fixa si restul paginii (randul orizontal de carduri, footer)
   se deruleaza normal, ca pe orice alta pagina — de-asta fullscreen-ul e legat
   de breakpoint, nu doar de ruta. Pe restul paginilor (si pe /harta pe mobil)
   vrem comportamentul implicit: main creste odata cu continutul, iar footer-ul
   il urmeaza normal, mai jos. */
export default function MainArea({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullscreen = pathname === "/harta";

  return (
    <main
      className={`flex flex-1 flex-col ${fullscreen ? "md:min-h-0 md:overflow-hidden" : ""}`}
    >
      {children}
    </main>
  );
}
