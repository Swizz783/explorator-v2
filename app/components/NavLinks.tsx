"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { esteActiv, LINKURI_NAV } from "../data/navigatie";

/* Navigatia principala, in stilul firmelor stradale din proiectul vechi (.mainnav):
   text spatiat, subliniere discreta pe intrarea activa. Sub `md` nu incape si e
   inlocuita de MeniuMobil — de-asta e ascunsa aici, nu doar ingustata. */
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden gap-4 md:flex lg:gap-9">
      {LINKURI_NAV.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`border-b pb-1.5 text-xs font-medium uppercase tracking-[0.22em] transition ${
            esteActiv(pathname, l.href)
              ? "border-brass text-ink"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
