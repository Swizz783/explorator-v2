"use client";

import { useVisited } from "../store/VisitedContext";

/* Contorul de progres din header, identic cu .prog din proiectul vechi
   (ascuns pe mobil, ca si acolo — .site-head .prog{display:none}). */
export default function ProgressBar() {
  const { visited, total } = useVisited();
  const done = visited.size;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="hidden items-center gap-2.5 sm:flex">
      <span className="whitespace-nowrap text-xs text-ink-soft">
        {done} / {total} vizitate
      </span>
      <div className="h-1.5 w-[120px] overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brass transition-[width] duration-[250ms]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
