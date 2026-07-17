"use client";

import { type Stil, type Tip } from "../data/locuri";

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
      className={`flex-none whitespace-nowrap rounded-full border px-3 py-[5px] text-[12.5px] font-medium transition ${
        activ ? activCls : "border-line bg-card text-ink-soft hover:border-enamel"
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
    <div className="border-b border-line bg-plaster-2 px-4 py-2.5">
      <div className="flex items-center gap-2 overflow-x-auto py-[3px]">
        <Eticheta>Stil</Eticheta>
        <Chip activ={stil === "toate"} onClick={() => onStil("toate")}>
          Toate
        </Chip>
        {stiluri.map((s) => (
          <Chip key={s} activ={stil === s} onClick={() => onStil(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <div className="mt-1.5 flex items-center gap-2 overflow-x-auto py-[3px]">
        <Eticheta>Tip</Eticheta>
        <Chip activ={tip === "toate"} onClick={() => onTip("toate")}>
          Toate
        </Chip>
        {tipuri.map((t) => (
          <Chip key={t} activ={tip === t} onClick={() => onTip(t)}>
            {t}
          </Chip>
        ))}
        <div className="ml-auto flex-none pl-2">
          <Chip activ={doarNerenovate} varianta="neren" onClick={onNerenovate}>
            Doar nerenovate
          </Chip>
        </div>
      </div>
    </div>
  );
}
