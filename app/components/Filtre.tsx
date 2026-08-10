"use client";

import { CULOARE_STIL, type Stil, type Tip } from "../data/locuri";
import { ICOANA_TIP } from "../data/iconite";

type Props = {
  tip: Tip | "toate";
  stil: Stil | "toate";
  tipuri: Tip[];
  stiluri: Stil[];
  doarNerenovate: boolean;
  onTip: (t: Tip | "toate") => void;
  onStil: (s: Stil | "toate") => void;
  onNerenovate: () => void;
};

function Chip({
  activ,
  varianta,
  onClick,
  children,
}: {
  activ: boolean;
  varianta?: "neren";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activCls =
    varianta === "neren"
      ? "border-brass bg-brass text-white"
      : "border-ink bg-ink text-plaster-2";
  return (
    <button
      onClick={onClick}
      className={`flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-[5px] text-[12.5px] font-medium transition ${
        activ ? activCls : "border-line bg-card text-ink-soft hover:border-brand"
      }`}
    >
      {children}
    </button>
  );
}

function Eticheta({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-11 flex-none text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
      {children}
    </span>
  );
}

export default function Filtre({
  tip,
  stil,
  tipuri,
  stiluri,
  doarNerenovate,
  onTip,
  onStil,
  onNerenovate,
}: Props) {
  return (
    /* Pe mobil inaltimea e resursa rara (harta + lista impart un ecran fix), deci
       spatierea verticala e mai stransa. Derularea orizontala ramane neschimbata. */
    <div className="border-b border-line bg-plaster-2 px-4 py-1.5 sm:py-2.5">
      <div className="flex items-center gap-2 overflow-x-auto py-[3px]">
        <Eticheta>Stil</Eticheta>
        <Chip activ={stil === "toate"} onClick={() => onStil("toate")}>
          Toate
        </Chip>
        {stiluri.map((s) => (
          <Chip key={s} activ={stil === s} onClick={() => onStil(s)}>
            <span
              className="h-2 w-2 flex-none rounded-full"
              style={{ background: CULOARE_STIL[s] }}
              aria-hidden="true"
            />
            {s}
          </Chip>
        ))}
      </div>
      <div className="mt-1 flex items-center gap-2 overflow-x-auto py-[3px] sm:mt-1.5">
        <Eticheta>Tip</Eticheta>
        <Chip activ={tip === "toate"} onClick={() => onTip("toate")}>
          Toate
        </Chip>
        {tipuri.map((t) => {
          const Iconita = ICOANA_TIP[t];
          return (
            <Chip key={t} activ={tip === t} onClick={() => onTip(t)}>
              {Iconita && <Iconita size={13} strokeWidth={2} aria-hidden="true" />}
              {t}
            </Chip>
          );
        })}
        <div className="ml-auto flex-none pl-2">
          <Chip activ={doarNerenovate} varianta="neren" onClick={onNerenovate}>
            Doar nerenovate
          </Chip>
        </div>
      </div>
    </div>
  );
}
