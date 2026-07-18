import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { Stil } from "../data/locuri";
import { logout } from "../autentificare/actions";
import { calculeazaAchievements } from "../lib/achievements";
import { getLocuri } from "../lib/locatii";
import { createClient } from "../lib/supabase/server";
import { getVizitatePentruUser } from "../lib/vizitat";

export const metadata: Metadata = {
  title: "Profil · Explorator București",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/autentificare");
  }

  const [locuri, vizitateNume] = await Promise.all([
    getLocuri(),
    getVizitatePentruUser(user.id),
  ]);
  const vizitate = new Set(vizitateNume);

  const total = locuri.length;
  const totalVizitate = locuri.filter((l) => vizitate.has(l.nume)).length;
  const pct = total ? Math.round((totalVizitate / total) * 100) : 0;

  const stiluri = [...new Set(locuri.map((l) => l.stil).filter((s): s is Stil => s !== null))].sort();
  const breakdown = stiluri.map((stil) => {
    const dinStil = locuri.filter((l) => l.stil === stil);
    const vizitateDinStil = dinStil.filter((l) => vizitate.has(l.nume));
    return { stil, total: dinStil.length, vizitate: vizitateDinStil.length };
  });

  const realizari = calculeazaAchievements(locuri, vizitate).filter(
    (a) => a.total > 0 && a.vizitate === a.total,
  );

  return (
    <div className="max-w-[720px] py-8 pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Cont
      </div>
      <h2 className="mt-2 text-2xl font-semibold">Profilul tău</h2>
      <p className="mt-2 text-sm text-ink-soft">{user.email}</p>

      <div className="mt-6 rounded-[13px] border border-line bg-card p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink-soft">Progres general</span>
          <span className="text-sm font-semibold text-ink">
            {totalVizitate} / {total} vizitate
          </span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brass transition-[width] duration-[250ms]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {realizari.length > 0 && (
        <div className="mt-7">
          <h3 className="text-xl font-semibold">Realizări</h3>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {realizari.map((r) => (
              <div
                key={r.id}
                className="rounded-full border border-[#e8d2a8] bg-[#f3e7d4] px-3.5 py-2 text-[13px] font-medium text-[#8a5a1f]"
              >
                {r.nume}
                <span className="ml-1.5 font-normal text-[#a97f3e]">
                  — {r.eticheta}: {r.vizitate}/{r.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Pe stiluri arhitecturale</h3>
        <div className="mt-3 flex flex-col gap-2.5">
          {breakdown.map((b) => {
            const bPct = b.total ? Math.round((b.vizitate / b.total) * 100) : 0;
            const complet = b.vizitate === b.total;
            return (
              <div
                key={b.stil}
                className="rounded-[11px] border border-line bg-card px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-medium">{b.stil}</span>
                  <span
                    className={`text-[13px] font-semibold ${
                      complet ? "text-[#2c6a48]" : "text-ink-soft"
                    }`}
                  >
                    {b.vizitate} / {b.total}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full transition-[width] duration-[250ms] ${
                      complet ? "bg-[#2c6a48]" : "bg-brass"
                    }`}
                    style={{ width: `${bPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form action={logout} className="mt-9 border-t border-line pt-6">
        <button
          type="submit"
          className="rounded-[9px] border border-line bg-card px-[22px] py-[13px] text-sm font-semibold text-ink-soft transition hover:border-enamel hover:text-ink"
        >
          Delogare
        </button>
      </form>
    </div>
  );
}
