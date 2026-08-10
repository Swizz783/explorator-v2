"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* `/harta` e fullscreen doar de la `md` in sus (vezi MainArea): pe desktop
   footer-ul n-are ce cauta acolo, ar rupe umplerea exacta a spatiului ramas intre
   header si continut. Pe mobil insa pagina se deruleaza normal, ca oricare alta —
   footer-ul apare la capat, la fel ca pe restul site-ului. De-asta nu mai
   ascundem complet (return null), ci doar cu `hidden md:hidden` — invers, vizibil
   sub `md`, ascuns de la `md` in sus. Pe restul paginilor footer-ul (primit ca
   `children`, ramane Server Component) apare normal la toate dimensiunile. */
export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const paginaHarta = pathname === "/harta";
  return <div className={paginaHarta ? "block md:hidden" : undefined}>{children}</div>;
}
