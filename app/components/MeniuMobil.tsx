"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { esteActiv, LINKURI_NAV } from "../data/navigatie";
import { useVisited } from "../store/VisitedContext";

/* Navigatia de sub `md`: un buton hamburger care deschide un panou sub header,
   cu aceleasi intrari ca bara de pe desktop plus "Autentificare" (care pe desktop
   sta separat, in dreapta). Panoul se inchide la navigare, la Escape si la click
   pe fundal. Contorul de vizitate e ascuns in header pe mobil, asa ca il aratam
   aici — altfel ar fi invizibil pe telefon. */
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
        className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-line bg-card text-ink transition hover:border-brand"
      >
        {deschis ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
      </button>

      {deschis && (
        <>
          {/* Fundalul prinde click-urile din afara panoului; sub panou ca z-index. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setDeschis(false)}
            className="fixed inset-0 z-40 cursor-default bg-ink/20"
          />
          <div
            id="meniu-mobil"
            className="absolute inset-x-0 top-full z-50 border-b border-line bg-card shadow-card"
          >
            <nav className="flex flex-col px-4 py-2">
              {LINKURI_NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={esteActiv(pathname, l.href) ? "page" : undefined}
                  className={`border-b border-line/60 py-3 text-sm font-medium uppercase tracking-[0.16em] transition last:border-b-0 ${
                    esteActiv(pathname, l.href) ? "text-brand" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-3 border-t border-line bg-plaster-2 px-4 py-3">
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
        </>
      )}
    </div>
  );
}
