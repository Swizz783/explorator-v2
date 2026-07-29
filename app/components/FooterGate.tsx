"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* `/harta` e fullscreen (vezi MainArea) — footer-ul nu are ce cauta acolo, ar
   rupe umplerea exacta a spatiului ramas intre header si continut. Pe restul
   paginilor footer-ul (primit ca `children`, ramane Server Component) apare normal. */
export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/harta") return null;
  return <>{children}</>;
}
