"use client";

import { useEffect, useMemo, useState } from "react";
import type { PozaGalerie } from "../lib/galerie";

type Props = {
  poze: PozaGalerie[];
};

/* Galeria foto: taburi pe categorie (acelasi limbaj vizual ca chip-urile de la
   filtrele hartii) + grid de poze; click deschide poza mărită intr-un lightbox
   pe fundal intunecat, in acelasi stil ca modalul de detaliu al locatiilor. */
export default function GalerieClient({ poze }: Props) {
  const categorii = useMemo(() => [...new Set(poze.map((p) => p.categorie))], [poze]);
  const [activa, setActiva] = useState(categorii[0] ?? "");
  const [deschisa, setDeschisa] = useState<PozaGalerie | null>(null);

  const pozeActive = poze.filter((p) => p.categorie === activa);

  useEffect(() => {
    if (!deschisa) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDeschisa(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [deschisa]);

  if (categorii.length === 0) {
    return <p className="mt-6 text-sm text-ink-soft">Momentan nu sunt poze în galerie.</p>;
  }

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-2">
        {categorii.map((c) => (
          <button
            key={c}
            onClick={() => setActiva(c)}
            className={`flex-none whitespace-nowrap rounded-full border px-3.5 py-[6px] text-[13px] font-medium transition ${
              activa === c
                ? "border-ink bg-ink text-plaster-2"
                : "border-line bg-card text-ink-soft hover:border-enamel"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {pozeActive.map((p) => (
          <button
            key={p.id}
            onClick={() => setDeschisa(p)}
            className="group overflow-hidden rounded-[13px] border border-line bg-card text-left transition hover:border-enamel hover:shadow-card"
          >
            <div className="relative h-[140px] overflow-hidden bg-plaster-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- poza vine din Supabase Storage, nu din /public */}
              <img
                src={p.url}
                alt={p.nume}
                className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.04]"
              />
            </div>
            <div className="px-3 py-2.5 text-[13px] font-medium text-ink">{p.nume}</div>
          </button>
        ))}
      </div>

      {deschisa && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(20,18,14,0.55)] p-5 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeschisa(null);
          }}
        >
          <div className="animate-[pop_.18s_ease] max-h-[90vh] w-[min(900px,100%)] overflow-hidden rounded-2xl bg-plaster shadow-card">
            <div className="relative flex max-h-[70vh] items-center justify-center bg-[#14120e]">
              {/* eslint-disable-next-line @next/next/no-img-element -- poza vine din Supabase Storage, nu din /public */}
              <img
                src={deschisa.url}
                alt={deschisa.nume}
                className="max-h-[70vh] w-full object-contain"
              />
              <button
                aria-label="Închide"
                onClick={() => setDeschisa(null)}
                className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(20,18,14,0.55)] text-lg text-white"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="plaque text-[16px]">{deschisa.nume}</div>
              <div className="mt-1.5 text-[12.5px] text-ink-soft">{deschisa.categorie}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
