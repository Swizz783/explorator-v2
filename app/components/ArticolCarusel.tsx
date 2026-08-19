"use client";

import { useEffect, useState } from "react";

type Props = {
  poze: string[];
  titlu: string;
};

/* Carousel de poze pentru pagina de articol — aceeasi interactie ca la
   LocModal.tsx (sageti stanga/dreapta, bulinute, navigare cu tastatura, click
   pe poza curenta deschide un lightbox fullscreen), dar fara modalul in sine:
   aici carousel-ul e inline in pagina, nu un popup, deci n-are buton de
   inchidere propriu — doar lightbox-ul are unul.
   Pozele vin deja ca URL-uri complete din Supabase Storage (nu nume de
   fisiere locale din /public/images), deci <img src={poza}> direct. */
export default function ArticolCarusel({ poze, titlu }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        return;
      }
      if (poze.length > 1) {
        if (e.key === "ArrowLeft")
          setIndex((i) => (i - 1 + poze.length) % poze.length);
        if (e.key === "ArrowRight") setIndex((i) => (i + 1) % poze.length);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [poze.length, lightboxOpen]);

  if (poze.length === 0) return null;

  return (
    <>
      <div className="relative mt-5 h-[280px] overflow-hidden rounded-[13px] border border-line bg-plaster-2 sm:h-[420px]">
        {poze.map((poza, i) => (
          <div
            key={poza + i}
            className={`absolute inset-0 transition-opacity duration-250 ${
              i === index ? "cursor-zoom-in" : "pointer-events-none"
            }`}
            style={{ opacity: i === index ? 1 : 0 }}
            onClick={i === index ? () => setLightboxOpen(true) : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- poza vine din Supabase Storage, nu din /public */}
            <img
              src={poza}
              alt={`${titlu} — poza ${i + 1}`}
              className="h-full w-full object-cover"
            />
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
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(10,9,7,0.94)] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- poza vine din Supabase Storage, nu din /public */}
          <img
            src={poze[index]}
            alt={`${titlu} — poza ${index + 1}, marita`}
            className="h-full w-full object-contain"
          />
          {poze.length > 1 && (
            <>
              <button
                aria-label="Poza anterioară"
                onClick={() => setIndex((i) => (i - 1 + poze.length) % poze.length)}
                className="absolute left-3 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-ink shadow-[0_2px_10px_rgba(0,0,0,.35)] hover:bg-white sm:left-6"
              >
                &#8249;
              </button>
              <button
                aria-label="Poza următoare"
                onClick={() => setIndex((i) => (i + 1) % poze.length)}
                className="absolute right-3 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-ink shadow-[0_2px_10px_rgba(0,0,0,.35)] hover:bg-white sm:right-6"
              >
                &#8250;
              </button>
              <div className="absolute inset-x-0 bottom-5 z-[2] flex justify-center gap-2">
                {poze.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Poza ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 w-2 rounded-full ${
                      i === index ? "bg-white" : "bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          <button
            aria-label="Închide poza mărită"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-3.5 top-3.5 z-[3] flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(20,18,14,0.6)] text-xl text-white hover:bg-[rgba(20,18,14,0.8)] sm:right-6 sm:top-6"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
