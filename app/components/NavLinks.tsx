"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/harta", label: "Harta" },
  { href: "/blog", label: "Blog" },
  { href: "/galerie", label: "Galerie" },
  { href: "/despre", label: "Despre" },
  { href: "/profil", label: "Profil" },
];

/* Navigatia principala, in stilul firmelor stradale din proiectul vechi (.mainnav):
   text spatiat, subliniere discreta pe intrarea activa. */
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6 sm:gap-9">
      {LINKS.map((l) => {
        const activ = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`border-b pb-1.5 text-xs font-medium uppercase tracking-[0.22em] transition ${
              activ
                ? "border-brass text-ink"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
