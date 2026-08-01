"use client";

import { useId } from "react";

type Props = {
  className?: string;
  /* culoarea monogramei; contra-formele (ochiurile lui B si al lui Q) raman
     transparente, ca marca sa mearga peste orice fundal */
  color: string;
};

/* Monograma BucQuest: doua litere unite, "B" + "Q".
   - B-ul serif in stanga, cu bucla de jos intrand sub inelul lui Q;
   - Q desenat ca un O gros, iar coada lui se prelungeste in jos in varf de
     picatura, asa incat cercul + coada citesc impreuna ca un pin de harta.
   Geometria e in coordonate absolute (viewBox 93x105): cercul are centrul in
   (63.8, 48.9) cu raza 26, iar varful pinului cade in (63.8, 100) — laturile
   sunt exact tangentele din varf la cerc, ca racordarea sa fie continua.
   Vezi si app/icon.svg pentru varianta autonoma (favicon), cu aceleasi trasee. */

/* conturul exterior al lui B */
const B = "M3 5H32C43.2 6 45 20 32.5 32.3C45 34.4 47 51 33 66H3V61.5H6.5V9.5H3Z";
/* ochiul de sus si ochiul de jos ale lui B */
const B_OCHI_SUS = "M14.5 10.5H30C37.5 12 38.5 27 30 29H14.5Z";
const B_OCHI_JOS = "M14.5 35.5H31C40.5 37.5 42 58 31 60.5H14.5Z";
/* silueta pinului: arcul mare al lui Q + cele doua tangente spre varf */
const PIN = "M41.42 62.14A26 26 0 1 1 86.18 62.14L63.8 100Z";

export default function LogoMark({ className, color }: Props) {
  /* useId poate contine ":", care nu e valid intr-o referinta url(#...) */
  const id = `bq-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 93 105"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="93" height="105">
        <rect width="93" height="105" fill="#fff" />
        <path d={B_OCHI_SUS} fill="#000" />
        <path d={B_OCHI_JOS} fill="#000" />
        <circle cx="63.8" cy="47.5" r="17.5" fill="#000" />
      </mask>
      <g mask={`url(#${id})`} fill={color}>
        <path d={B} />
        <path d={PIN} />
      </g>
    </svg>
  );
}
