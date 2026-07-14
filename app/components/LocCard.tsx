"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Loc } from "../data/locuri";
import Placeholder from "./Placeholder";
import Tags from "./Tag";
import VisitButton from "./VisitButton";

type Props = {
  loc: Loc;
  activ: boolean;
  onClick: () => void;
};

/* Cardul de locatie, identic cu proiectul vechi (.card): thumbnail, tag-uri, descriere scurta. */
export default function LocCard({ loc, activ, onClick }: Props) {
  const poza = loc.poze[0];
  const ref = useRef<HTMLDivElement>(null);

  /* La selectare (din harta sau din lista), deruleaza banda de carduri
     ca respectivul card sa fie vizibil, cu scroll lin. */
  useEffect(() => {
    if (activ) {
      // fara `behavior` explicit: browserul foloseste scroll-behavior din CSS
      // (.scroll-smooth pe containerul listei) — mai fiabil decat behavior:'smooth' aici.
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [activ]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`mb-3 cursor-pointer overflow-hidden rounded-[13px] border bg-card transition ${
        activ
          ? "border-enamel shadow-card"
          : "border-line hover:border-enamel hover:shadow-card"
      }`}
    >
      <div className="relative h-[120px]">
        {poza ? (
          <Image
            src={`/images/${poza}`}
            alt={loc.nume}
            fill
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <Placeholder label={loc.tip} small />
        )}
      </div>
      <div className="p-3.5 pb-4">
        <h3 className="mb-1.5 text-[16.5px] font-semibold">{loc.nume}</h3>
        <Tags loc={loc} />
        <p className="text-[13px] leading-[1.5] text-[#4a463d]">
          {loc.descriereScurta}
        </p>
        {loc.arhitect && (
          <p className="mb-3 mt-2 text-[11.5px] text-ink-soft">
            Arhitect: {loc.arhitect}
          </p>
        )}
        <VisitButton nume={loc.nume} className={loc.arhitect ? "" : "mt-3"} />
      </div>
    </div>
  );
}
