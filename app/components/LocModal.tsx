"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Loc } from "../data/locuri";
import Placeholder from "./Placeholder";
import Tags from "./Tag";
import VisitButton from "./VisitButton";

type Props = {
  loc: Loc;
  onClose: () => void;
};

/* Modalul de detaliu + carousel, portat din proiectul vechi (openDetail/carSet/carGo).
   Navigare: sageti stanga/dreapta intre poze, Escape inchide modalul. */
export default function LocModal({ loc, onClose }: Props) {
  const poze = loc.poze.length ? loc.poze : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [loc]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (poze.length > 1) {
        if (e.key === "ArrowLeft")
          setIndex((i) => (i - 1 + poze.length) % poze.length);
        if (e.key === "ArrowRight") setIndex((i) => (i + 1) % poze.length);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, poze.length]);

  const meta = [loc.an, loc.arhitect, loc.adresa].filter(Boolean).join(" · ");

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(20,18,14,0.55)] p-5 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-[pop_.18s_ease] max-h-[90vh] w-[min(760px,100%)] overflow-y-auto rounded-2xl bg-plaster shadow-card">
        <div className="relative h-[300px] overflow-hidden bg-plaster-2">
          {poze.length === 0 && <Placeholder label={loc.tip} />}
          {poze.map((poza, i) => (
            <div
              key={poza + i}
              className="absolute inset-0 transition-opacity duration-250"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={`/images/${poza}`}
                  alt={`${loc.nume} — poza ${i + 1}`}
                  fill
                  sizes="760px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
          {poze.length > 1 && (
            <>
              <button
                aria-label="Poza anterioară"
                onClick={() => setIndex((i) => (i - 1 + poze.length) % poze.length)}
                className="absolute left-3 top-1/2 z-[2] flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[22px] text-ink shadow-[0_2px_10px_rgba(0,0,0,.2)] hover:bg-white"
              >
                &#8249;
              </button>
              <button
                aria-label="Poza următoare"
                onClick={() => setIndex((i) => (i + 1) % poze.length)}
                className="absolute right-3 top-1/2 z-[2] flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[22px] text-ink shadow-[0_2px_10px_rgba(0,0,0,.2)] hover:bg-white"
              >
                &#8250;
              </button>
              <div className="absolute inset-x-0 bottom-3 z-[2] flex justify-center gap-[7px]">
                {poze.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Poza ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-[7px] w-[7px] rounded-full ${
                      i === index ? "bg-white" : "bg-white/55"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          <button
            aria-label="Închide"
            onClick={onClose}
            className="absolute right-3.5 top-3.5 z-[3] flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(20,18,14,0.55)] text-lg text-white"
          >
            &times;
          </button>
        </div>
        <div className="p-[22px] pb-7 sm:px-[26px]">
          <div className="plaque mb-3.5 text-[22px]">{loc.nume}</div>
          <Tags loc={loc} />
          {meta && (
            <div className="mb-4 mt-0.5 text-[13px] text-ink-soft">{meta}</div>
          )}
          <div className="text-[15px] leading-[1.7] text-[#3a362d]">
            {loc.descriereLunga || loc.descriereScurta}
          </div>
          <VisitButton nume={loc.nume} className="mt-[22px] max-w-[280px]" />
        </div>
      </div>
    </div>
  );
}
