"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* `/harta` trebuie sa umple exact spatiul ramas intre header si footer, cu
   scroll intern (harta + lista), nu scroll de pagina — de-asta ii dam min-h-0
   (permite flex-item-ului sa se micsoreze sub inaltimea "naturala" a continutului).
   Pe restul paginilor vrem comportamentul implicit: main creste odata cu
   continutul, iar footer-ul il urmeaza normal, mai jos, ca pe orice site. */
export default function MainArea({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullscreen = pathname === "/harta";

  return (
    <main
      className={`flex flex-1 flex-col ${fullscreen ? "min-h-0 overflow-hidden" : ""}`}
    >
      {children}
    </main>
  );
}
