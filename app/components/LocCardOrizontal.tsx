"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Loc } from "../data/locuri";
import Placeholder from "./Placeholder";
import Tags from "./Tag";

type Props = {
  loc: Loc;
  activ: boolean;
  onClick: () => void;
};

/* Varianta compacta a LocCard, pentru randul orizontal derulabil de sub harta pe
   mobil (vezi Explorator.tsx): doar poza + nume + etichetele tip/stil — fara
   descriere, arhitect sau butonul de vizitat, ca sa ramana suficient de ingust
   pentru un card de carusel. Detaliile complete si "Bifeaza ca vizitat" raman
   in LocModal, la un tap distanta. */
export default function LocCardOrizontal({ loc, activ, onClick }: Props) {
  const poza = loc.poze[0];
  const ref = useRef<HTMLDivElement>(null);

  /* La selectare (din harta), deruleaza randul ca respectivul card sa fie
     vizibil — centrat, nu doar "cel mai apropiat", ca la un carusel real. */
  useEffect(() => {
    if (activ) {
      ref.current?.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }, [activ]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`w-[78%] flex-none cursor-pointer snap-start overflow-hidden rounded-[13px] border bg-card transition ${
        activ ? "border-brand shadow-card" : "border-line active:border-brand"
      }`}
    >
      <div className="relative h-[110px]">
        {poza ? (
          <Image
            src={`/images/${poza}`}
            alt={loc.nume}
            fill
            sizes="80vw"
            className="object-cover"
          />
        ) : (
          <Placeholder label={loc.tip} small />
        )}
      </div>
      <div className="p-3">
        <h3 className="mb-1.5 truncate text-[15px] font-semibold">{loc.nume}</h3>
        <Tags loc={loc} />
      </div>
    </div>
  );
}
