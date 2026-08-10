"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { esteActiv, LINKURI_NAV } from "../data/navigatie";
import { useVisited } from "../store/VisitedContext";

/* Navigatia de sub `md`: un buton hamburger care deschide un panou PE TOT ECRANUL
   (fixed inset-0, fundal opac — culoarea de fundal a site-ului, nu o dunga sub
   header cu un backdrop translucid). Un panou doar sub header + backdrop
   semi-transparent lasa continutul paginii sa se vada prin zona translucida —
   de-asta e "fixed inset-0" opac, nu "absolute top-full" cu overlay pe dedesubt.

   z-index-ul e mult peste orice altceva din pagina (Leaflet foloseste z-index
   pana la ~700 pentru panourile hartii, modalurile de locatie/galerie merg pana
   la z-[1100]) — 2000 il pune deasupra tuturor, iar butonul de comutare ramane
   la 2010, ca sa poata inchide meniul cat timp panoul e deschis peste el.

   Cat timp panoul e deschis, scroll-ul paginii din spate e blocat (overflow
   hidden pe body) — altfel body-ul s-ar deruala vizibil pe sub panoul opac. */
export default function MeniuMobil({ loggedIn }: { loggedIn: boolean }) {
  const [deschis, setDeschis] = useState(false);
  const pathname = usePathname();
  const butonRef = useRef<HTMLButtonElement>(null);
  const { visited, total } = useVisited();

  /* Navigarea inseamna ca utilizatorul a terminat cu meniul. Ajustarea se face in
     timpul render-ului, nu dintr-un efect: un `setState` in efect ar mai randa o
     data cu meniul inca deschis, si s-ar vedea cum se inchide dupa schimbarea paginii. */
  const [pathAnterior, setPathAnterior] = useState(pathname);
  if (pathname !== pathAnterior) {
    setPathAnterior(pathname);
    setDeschis(false);
  }

  useEffect(() => {
    if (!deschis) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [deschis]);

  useEffect(() => {
    if (!deschis) return;
    const laTasta = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDeschis(false);
        /* Focusul se intoarce pe buton, altfel ramane pe body dupa inchidere. */
        butonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", laTasta);
    return () => document.removeEventListener("keydown", laTasta);
  }, [deschis]);

  return (
    <div className="md:hidden">
      <button
        ref={butonRef}
        type="button"
        onClick={() => setDeschis((v) => !v)}
        aria-expanded={deschis}
        aria-controls="meniu-mobil"
        aria-label={deschis ? "Închide meniul" : "Deschide meniul"}
        className="relative z-[2010] flex h-10 w-10 items-center justify-center rounded-[9px] border border-line bg-card text-ink transition hover:border-brand"
      >
        {deschis ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
      </button>

      {deschis && (
        <div
          id="meniu-mobil"
          className="fixed inset-0 z-[2000] flex h-[100dvh] flex-col overflow-y-auto bg-plaster pt-[64px]"
        >
          <nav className="flex flex-col px-4 py-2">
            {LINKURI_NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={esteActiv(pathname, l.href) ? "page" : undefined}
                className={`border-b border-line py-4 text-base font-medium uppercase tracking-[0.16em] transition ${
                  esteActiv(pathname, l.href) ? "text-brand" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line bg-plaster-2 px-4 py-4">
            <span className="text-xs text-ink-soft">
              {visited.size} / {total} vizitate
            </span>
            {!loggedIn && (
              <Link
                href="/autentificare"
                className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-plaster-2 transition hover:bg-brand-hover"
              >
                Autentificare
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
