import { CULOARE_FARA_STIL, CULOARE_STIL, type Stil } from "../data/locuri";

type Props = {
  /* Stilurile prezente in lista curenta de locuri — legenda arata doar ce se vede pe harta. */
  stiluri: Stil[];
  /* Exista in lista si locuri fara stil declarat? Atunci aratam si culoarea neutra. */
  areFaraStil: boolean;
};

/* Cheia de culori a pinurilor: fiecare stil arhitectural cu culoarea lui, ca
   utilizatorul sa inteleaga harta fara sa deschida fiecare pin. */
export default function LegendaStiluri({ stiluri, areFaraStil }: Props) {
  if (stiluri.length === 0 && !areFaraStil) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-b border-line bg-plaster px-4 py-2">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        Culoarea pinului
      </span>
      {stiluri.map((s) => (
        <span key={s} className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
          <span
            className="h-2.5 w-2.5 flex-none rounded-full"
            style={{ background: CULOARE_STIL[s] }}
          />
          {s}
        </span>
      ))}
      {areFaraStil && (
        <span className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
          <span
            className="h-2.5 w-2.5 flex-none rounded-full"
            style={{ background: CULOARE_FARA_STIL }}
          />
          Fără stil declarat
        </span>
      )}
    </div>
  );
}
