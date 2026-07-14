import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Despre · Explorator București",
};

/* Continut portat identic din proiectul vechi (explorator_bucuresti_4.html, sectiunea #despre). */
export default function DesprePage() {
  return (
    <div className="max-w-[820px] py-8 pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Despre proiect
      </div>
      <h2 className="mt-2 text-2xl font-semibold">
        Un ghid de arhitectură al Bucureștiului
      </h2>

      <p className="mt-5 text-[15px] leading-[1.75] text-[#3a362d]">
        Explorator București este o hartă a orașului, clădire cu clădire: palate
        Belle Époque, beton brutalist, art deco interbelic, biserici ascunse
        prin curți și străzi întregi rămase ca acum o sută de ani. Pentru
        fiecare loc am adunat povestea lui — cine l-a construit, când și de ce
        merită să te oprești în fața lui.
      </p>

      <h3 className="mt-8 text-xl font-semibold">De ce există</h3>
      <p className="mt-2.5 text-[15px] leading-[1.75] text-[#3a362d]">
        Pentru că Bucureștiul e un oraș mult mai divers și mai frumos decât
        reputația lui. Straturile lui — neoclasic, neoromânesc, modernist,
        comunist — stau unele peste altele, de multe ori pe aceeași stradă.
        Multe dintre cele mai spectaculoase locuri nu apar în niciun ghid și
        sunt necunoscute chiar și celor care trec zilnic pe lângă ele. Mi-am
        dorit un loc în care poveștile astea să fie adunate și ușor de găsit.
      </p>

      <h3 className="mt-8 text-xl font-semibold">Pentru cine e</h3>
      <ul className="mt-2.5 list-disc space-y-1 pl-[22px] text-[15px] leading-[1.75] text-[#3a362d]">
        <li>
          <b>Localnici curioși</b>, care vor să-și vadă orașul cu alți ochi.
        </li>
        <li>
          <b>Turiști</b> care vor mai mult decât traseul clasic Centrul Vechi –
          Palatul Parlamentului.
        </li>
        <li>
          <b>Pasionați de arhitectură</b>, care caută stilurile, arhitecții și
          anii din spatele fațadelor.
        </li>
      </ul>

      <h3 className="mt-8 text-xl font-semibold">Ce poți face pe site</h3>
      <ul className="mt-2.5 list-disc space-y-1 pl-[22px] text-[15px] leading-[1.75] text-[#3a362d]">
        <li>
          Explorezi harta și filtrezi locurile pe categorii — tip (palat,
          biserică, muzeu, parc...) și stil arhitectural.
        </li>
        <li>Citești povestea fiecărei clădiri, cu fotografii, an, arhitect și adresă.</li>
        <li>Bifezi locurile pe care le-ai vizitat și îți vezi progresul.</li>
      </ul>

      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-[9px] bg-ink px-[22px] py-[13px] text-sm font-semibold text-plaster-2 transition hover:bg-enamel-deep"
      >
        Descoperă harta &rarr;
      </Link>

      <p className="mt-9 border-t border-line pt-4 text-[13px] leading-[1.6] text-ink-soft">
        Fotografiile din aplicație sunt fie făcute de mine, fie preluate de pe
        Wikimedia Commons — lista completă a autorilor și licențelor e în
        secțiunea de{" "}
        <Link href="/credite" className="text-enamel">
          credite foto
        </Link>
        .
      </p>
    </div>
  );
}
