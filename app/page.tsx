import Link from "next/link";
import ArticolCard from "./components/ArticolCard";
import { CULOARE_TIP, type Stil } from "./data/locuri";
import { TRASEE } from "./data/trasee";
import { getUltimeleArticole, type Articol } from "./lib/articole";
import { getLocuri } from "./lib/locatii";

export default async function Home() {
  const locuri = await getLocuri();

  let articole: Articol[] = [];
  try {
    articole = await getUltimeleArticole(3);
  } catch {
    articole = [];
  }

  const tipuri = [...new Set(locuri.map((l) => l.tip))];
  const stiluri = [...new Set(locuri.map((l) => l.stil).filter((s): s is Stil => s !== null))];

  return (
    <div className="mx-auto w-full max-w-[1080px] px-7 pb-16">
      {/* ---------- HERO ---------- */}
      <div className="py-10">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          Ghid de arhitectură urbană · București
        </div>
        <h1 className="mt-4 flex flex-wrap items-baseline gap-x-3 text-[clamp(38px,6vw,74px)] font-semibold leading-[1.02] tracking-[-0.015em]">
          <span>BucQuest</span>
          <span className="text-[clamp(14px,2vw,20px)] font-medium text-ink-soft">
            Discover Bucharest
          </span>
        </h1>
        <p className="mt-5 max-w-[52ch] text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-ink-soft">
          Descoperă patrimoniul și locurile ascunse ale Bucureștiului.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/harta"
            className="inline-flex items-center rounded-[9px] bg-ink px-[22px] py-[13px] text-sm font-semibold text-plaster-2 transition hover:bg-enamel-deep"
          >
            Descoperă harta &rarr;
          </Link>
          <a
            href="#categorii"
            className="inline-flex items-center rounded-[9px] border border-line px-[22px] py-[13px] text-sm font-semibold text-ink transition hover:border-ink"
          >
            Vezi categoriile
          </a>
        </div>
        <div className="mt-6 text-[13px] text-ink-soft">
          <b className="mr-1 font-serif text-[20px] font-semibold text-ink">{locuri.length}</b>
          locuri &nbsp;·&nbsp;
          <b className="mx-1 font-serif text-[20px] font-semibold text-ink">{stiluri.length}</b>
          stiluri arhitecturale &nbsp;·&nbsp; centrul Bucureștiului
        </div>
      </div>

      {/* ---------- ULTIMELE ARTICOLE ---------- */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold">Ultimele articole</h2>
          <Link href="/blog" className="whitespace-nowrap text-sm font-medium text-enamel">
            Toate articolele &rarr;
          </Link>
        </div>
        {articole.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">Momentan nu sunt articole publicate.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {articole.map((a) => (
              <ArticolCard key={a.id} articol={a} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- TRASEE ---------- */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Trasee</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRASEE.map((t) => (
            <Link
              key={t.id}
              href={`/harta?traseu=${t.id}`}
              className="flex flex-col rounded-[13px] border border-line bg-card p-4 transition hover:border-enamel hover:shadow-card"
            >
              <h3 className="text-[15px] font-semibold">{t.nume}</h3>
              <div className="mt-1 text-[12px] font-medium text-ink-soft">
                {t.durata} &middot; {t.locuriNume.length} locuri
              </div>
              <p className="mt-2 text-[12.5px] leading-[1.5] text-[#4a463d]">{t.descriere}</p>
            </Link>
          ))}
          <div className="flex flex-col rounded-[13px] border border-dashed border-line bg-plaster-2 p-4 opacity-80">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              În curând
            </span>
            <h3 className="mt-1.5 text-[15px] font-semibold">Trasee AI</h3>
            <p className="mt-2 text-[12.5px] leading-[1.5] text-ink-soft">
              Generează un traseu personalizat pe baza timpului tău disponibil și a intereselor
              tale.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- CATEGORII ---------- */}
      <section id="categorii" className="mt-14 scroll-mt-6">
        <h2 className="text-2xl font-semibold">Explorează pe categorii</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {tipuri.map((t) => (
            <Link
              key={`tip-${t}`}
              href={`/harta?tip=${encodeURIComponent(t)}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[13.5px] font-medium text-ink transition hover:-translate-y-0.5 hover:border-enamel hover:text-enamel"
            >
              <span
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: CULOARE_TIP[t] }}
              />
              {t}
            </Link>
          ))}
          {stiluri.map((s) => (
            <Link
              key={`stil-${s}`}
              href={`/harta?stil=${encodeURIComponent(s)}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[13.5px] font-medium text-ink transition hover:-translate-y-0.5 hover:border-enamel hover:text-enamel"
            >
              <span className="h-[9px] w-[9px] rounded-full bg-enamel" />
              {s}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
