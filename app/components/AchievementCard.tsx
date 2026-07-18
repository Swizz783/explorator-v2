import type { Achievement } from "../lib/achievements";

/* Card de achievement — stil neutru cand e incomplet, accent auriu +
   bifa cand e complet (aceeasi paleta ca toast-ul de deblocare). */
export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { nume, descriere, eticheta, vizitate, total } = achievement;
  const complet = total > 0 && vizitate === total;
  const pct = total ? Math.round((vizitate / total) * 100) : 0;

  return (
    <div
      className={`rounded-[13px] border p-4 transition ${
        complet ? "border-[#e8d2a8] bg-[#f3e7d4]" : "border-line bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className={`text-[14.5px] font-semibold ${complet ? "text-[#5a3f16]" : "text-ink"}`}>
          {nume}
        </h4>
        {complet && (
          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#8a5a1f] text-[11px] font-bold text-[#f3e7d4]">
            ✓
          </span>
        )}
      </div>

      <p
        className={`mt-1 text-[12px] leading-[1.5] ${
          complet ? "text-[#8a6a30]" : "text-ink-soft"
        }`}
      >
        {descriere}
      </p>

      <div className="mt-3 flex items-center justify-between text-[12px] font-medium">
        <span className={complet ? "text-[#8a5a1f]" : "text-ink-soft"}>{eticheta}</span>
        <span className={complet ? "text-[#8a5a1f]" : "text-ink-soft"}>
          {vizitate}/{total}
        </span>
      </div>
      <div
        className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${
          complet ? "bg-[#e8d2a8]" : "bg-line"
        }`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-[250ms] ${
            complet ? "bg-[#8a5a1f]" : "bg-brass"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
