import type { Metadata } from "next";
import Link from "next/link";
import ArticolCard from "./components/ArticolCard";
import HartaPreview from "./components/HartaPreview";
import LogoMark from "./components/LogoMark";
import { CULOARE_STIL, CULOARE_TIP, type Stil } from "./data/locuri";
import { ICOANA_TIP } from "./data/iconite";
import { TRASEE } from "./data/trasee";
import { getUltimeleArticole, type Articol } from "./lib/articole";
import { getLocuri } from "./lib/locatii";
import { paginaMetadata } from "./lib/seo";

export const metadata: Metadata = paginaMetadata({
  title: "BucQuest — Discover Bucharest",
  description:
    "Descoperă patrimoniul și locurile ascunse ale Bucureștiului. Hartă interactivă cu filtre pe tip și stil arhitectural, trasee ghidate, articole și galerie foto.",
  path: "/",
});

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
    <div className="mx-auto w-full max-w-[1080px] px-4 pb-12 sm:px-7 sm:pb-16">
      {/* ---------- HERO ---------- */}
      <div className="py-7 sm:py-10">
        <div className="hero-in text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-soft sm:text-[11.5px] sm:tracking-[0.18em]">
          Ghid de arhitectură urbană · București
        </div>
        <h1 className="hero-in mt-4 flex flex-wrap items-baseline gap-x-3 text-[clamp(38px,6vw,74px)] font-semibold leading-[1.02] tracking-[-0.015em] pb-[0.18em] [animation-delay:90ms]">
          {/* Marca e dimensionata in `em`, deci urmareste singura clamp-ul titlului.
              1.233em e ales ca "B"-ul din monograma sa aiba exact cap-height-ul lui
              Playfair (0.716em) — B-ul din marca si cel din "BucQuest" ies identice.
              Aliniat la baseline, un SVG isi pune marginea de jos pe linia de baza,
              iar translate-ul il coboara pana cand baseline-ul monogramei cade pe cel
              al textului; varful pinului ramane atarnat dedesubt, ca un descendent. */}
          <LogoMark
            color="var(--color-brand)"
            className="h-[1.233em] w-auto flex-none translate-y-[0.458em]"
          />
          <span className="text-brand">BucQuest</span>
          <span className="text-[clamp(14px,2vw,20px)] font-medium text-brand-hover">
            Discover Bucharest
          </span>
        </h1>
        <p className="hero-in mt-5 max-w-[52ch] text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-ink-soft [animation-delay:180ms]">
          Descoperă patrimoniul și locurile ascunse ale Bucureștiului.
        </p>
        <div className="hero-in mt-7 [animation-delay:270ms]">
          <HartaPreview locuri={locuri} />
        </div>
        {/* Pe mobil butoanele se stivuiesc pe toata latimea; de la `sm` in sus revin
            unul langa altul, ca inainte. */}
        <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap [animation-delay:360ms]">
          <Link
            href="/harta"
            className="inline-flex w-full items-center justify-center rounded-[9px] bg-brand px-[22px] py-[13px] text-sm font-semibold text-plaster-2 transition hover:bg-brand-hover sm:w-auto sm:justify-start"
          >
            Descoperă harta &rarr;
          </Link>
          <a
            href="#categorii"
            className="inline-flex w-full items-center justify-center rounded-[9px] border border-line px-[22px] py-[13px] text-sm font-semibold text-ink transition hover:border-ink sm:w-auto sm:justify-start"
          >
            Vezi categoriile
          </a>
        </div>
        <div className="hero-in mt-6 text-[12.5px] text-ink-soft sm:text-[13px] [animation-delay:450ms]">
          <b className="mr-1 font-serif text-[18px] font-semibold text-ink sm:text-[20px]">
            {locuri.length}
          </b>
          locuri &nbsp;·&nbsp;
          <b className="mx-1 font-serif text-[18px] font-semibold text-ink sm:text-[20px]">
            {stiluri.length}
          </b>
          stiluri arhitecturale &nbsp;·&nbsp; centrul Bucureștiului
        </div>
      </div>

      {/* ---------- ULTIMELE ARTICOLE ---------- */}
      <section className="mt-10 sm:mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-semibold sm:text-2xl">Ultimele articole</h2>
          <Link href="/blog" className="whitespace-nowrap text-sm font-medium text-brand">
            Toate articolele &rarr;
          </Link>
        </div>
        {articole.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">Momentan nu sunt articole publicate.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articole.map((a) => (
              <ArticolCard key={a.id} articol={a} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- TRASEE ---------- */}
      <section className="mt-11 sm:mt-14">
        <h2 className="text-xl font-semibold sm:text-2xl">Trasee</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRASEE.map((t) => (
            <Link
              key={t.id}
              href={`/harta?traseu=${t.id}`}
              className="flex flex-col rounded-[13px] border border-line bg-card p-4 transition hover:border-brand hover:shadow-card"
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
      <section id="categorii" className="mt-11 scroll-mt-6 sm:mt-14">
        <h2 className="text-xl font-semibold sm:text-2xl">Explorează pe categorii</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tipuri.map((t) => {
            const Iconita = ICOANA_TIP[t];
            return (
              <Link
                key={`tip-${t}`}
                href={`/harta?tip=${encodeURIComponent(t)}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2 text-[13px] font-medium text-ink transition hover:-translate-y-0.5 hover:border-brand hover:text-brand sm:px-4 sm:text-[13.5px]"
              >
                {Iconita && (
                  <Iconita size={15} strokeWidth={2} style={{ color: CULOARE_TIP[t] }} aria-hidden="true" />
                )}
                {t}
              </Link>
            );
          })}
          {stiluri.map((s) => (
            <Link
              key={`stil-${s}`}
              href={`/harta?stil=${encodeURIComponent(s)}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2 text-[13px] font-medium text-ink transition hover:-translate-y-0.5 hover:border-brand hover:text-brand sm:px-4 sm:text-[13.5px]"
            >
              <span
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: CULOARE_STIL[s] }}
              />
              {s}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
