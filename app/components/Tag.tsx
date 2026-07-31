import { CULOARE_TIP, culoarePentruStil, type Loc } from "../data/locuri";
import { ICOANA_TIP } from "../data/iconite";

/* Etichetele tip/stil/nerenovat, ca in proiectul vechi (.tag) — tipul are acum si
   iconita lui, iar stilul e colorat cu aceeasi culoare ca pinul de pe harta. */
export default function Tags({ loc }: { loc: Loc }) {
  const culoare = CULOARE_TIP[loc.tip];
  const Iconita = ICOANA_TIP[loc.tip];
  const culoareStil = culoarePentruStil(loc.stil);

  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      <span
        className="flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold"
        style={{ background: `${culoare}22`, color: culoare }}
      >
        {Iconita && <Iconita size={11} strokeWidth={2.2} aria-hidden="true" />}
        {loc.tip}
      </span>
      {loc.stil && (
        <span
          className="whitespace-nowrap rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold"
          style={{ background: `${culoareStil}1f`, color: culoareStil }}
        >
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
