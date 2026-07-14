"use client";

import { useVisited } from "../store/VisitedContext";

/* Buton "Bifeaza ca vizitat", identic cu .visit / .visit.done din proiectul vechi. */
export default function VisitButton({
  nume,
  className = "",
}: {
  nume: string;
  className?: string;
}) {
  const { visited, toggle } = useVisited();
  const done = visited.has(nume);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(nume);
      }}
      className={`flex w-full items-center justify-center gap-[7px] rounded-lg border px-[9px] py-[9px] text-[12.5px] font-semibold transition ${
        done
          ? "border-[#c2ddca] bg-[#e7f0ea] text-[#2c6a48]"
          : "border-line bg-plaster-2 text-ink hover:border-verdigris"
      } ${className}`}
    >
      {done ? "✓ Vizitat" : "+ Bifează ca vizitat"}
    </button>
  );
}
