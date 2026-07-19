import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "../autentificare/actions";
import AchievementCard from "../components/AchievementCard";
import { calculeazaAchievements } from "../lib/achievements";
import { getLocuri } from "../lib/locatii";
import { createClient } from "../lib/supabase/server";
import { getVizitatePentruUser } from "../lib/vizitat";

export const metadata: Metadata = {
  title: "Profil · BucQuest",
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

  const achievements = calculeazaAchievements(locuri, vizitate);
  const dupaTip = achievements.filter((a) => a.categorie === "tip").sort((a, b) => a.eticheta.localeCompare(b.eticheta));
  const dupaStil = achievements.filter((a) => a.categorie === "stil").sort((a, b) => a.eticheta.localeCompare(b.eticheta));
  const speciale = achievements.filter((a) => a.categorie === "special");

  return (
    <div className="mx-auto w-full max-w-[880px] px-7 py-8 pb-16">
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

      <div className="mt-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
          Pe tip de loc
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dupaTip.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
          Pe stil arhitectural
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dupaStil.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>

      {speciale.length > 0 && (
        <div className="mt-8">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Speciale
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {speciale.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>
      )}

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
