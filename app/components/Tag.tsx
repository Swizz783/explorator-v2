import { CULOARE_TIP, type Loc } from "../data/locuri";

/* Etichetele tip/stil/nerenovat, identice cu proiectul vechi (.tag). */
export default function Tags({ loc }: { loc: Loc }) {
  const culoare = CULOARE_TIP[loc.tip];
  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      <span
        className="whitespace-nowrap rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold"
        style={{ background: `${culoare}22`, color: culoare }}
      >
        {loc.tip}
      </span>
      {loc.stil && (
        <span className="whitespace-nowrap rounded-full bg-[#e7e2d6] px-2.5 py-[3px] text-[10.5px] font-semibold text-[#5a5347]">
          {loc.stil}
        </span>
      )}
      {loc.nerenovat && (
        <span className="whitespace-nowrap rounded-full bg-[#f3e7d4] px-2.5 py-[3px] text-[10.5px] font-semibold text-[#8a5a1f]">
          Nerenovat
        </span>
      )}
    </div>
  );
}
