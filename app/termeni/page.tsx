import Link from "next/link";
import type { Metadata } from "next";
import { paginaMetadata } from "../lib/seo";

export const metadata: Metadata = paginaMetadata({
  title: "Termeni și condiții · BucQuest",
  description:
    "Regulile de folosire a BucQuest: serviciu gratuit, informații orientative, conduită, conturi, vârstă minimă și drepturi de autor.",
  path: "/termeni",
});

const ULTIMA_ACTUALIZARE = "28 septembrie 2026";

const P = "mt-2.5 text-[15px] leading-[1.75] text-[#3a362d]";
const UL = "mt-2.5 list-disc space-y-1 pl-[22px] text-[15px] leading-[1.75] text-[#3a362d]";
const H3 = "mt-8 text-xl font-semibold";

/* Acelasi layout ca /despre si /confidentialitate. */
export default function TermeniPage() {
  return (
    <div className="mx-auto w-full max-w-[820px] px-4 py-7 pb-12 sm:px-7 sm:py-8 sm:pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Informații legale
      </div>
      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
        Termeni și condiții
      </h2>
      <p className="mt-2 text-[13px] text-ink-soft">
        Ultima actualizare: {ULTIMA_ACTUALIZARE}
      </p>

      <p className="mt-5 text-[15px] leading-[1.75] text-[#3a362d]">
        Folosind BucQuest (site-ul și, dacă îți faci, contul tău) accepți
        termenii de mai jos. Dacă nu ești de acord cu ei, te rugăm să nu
        folosești site-ul. Pentru întrebări ne găsești la{" "}
        <a href="mailto:contactbucquest@gmail.com" className="text-brand">
          contactbucquest@gmail.com
        </a>
        .
      </p>

      <h3 className={H3}>Folosire gratuită</h3>
      <p className={P}>
        BucQuest este gratuit. Harta, articolele și galeria pot fi folosite
        fără cont; contul e opțional și servește doar la salvarea progresului
        între dispozitive. Putem modifica, extinde sau opri oricând
        funcționalități ale site-ului, fără obligația de a le menține.
      </p>

      <h3 className={H3}>Informații orientative</h3>
      <p className={P}>
        Informațiile despre locuri (istoric, arhitecți, ani, adrese, poziții pe
        hartă) sunt adunate cu grijă, dar au <b>caracter orientativ</b>. Pot
        exista erori sau date depășite: o clădire poate fi în renovare, închisă
        publicului sau pe o proprietate privată. Verifică înainte de a merge,
        respectă regulile locului și proprietatea privată. BucQuest nu răspunde
        pentru decizii luate exclusiv pe baza informațiilor de pe site. Dacă
        găsești o greșeală, spune-ne și o corectăm.
      </p>

      <h3 className={H3}>Conduită</h3>
      <p className={P}>Când folosești site-ul, te rugăm să nu:</p>
      <ul className={UL}>
        <li>încerci să accesezi conturile altor utilizatori sau zone restricționate;</li>
        <li>
          perturbi funcționarea site-ului (atacuri, trafic automat excesiv,
          exploatarea unor vulnerabilități);
        </li>
        <li>
          copiezi în masă conținutul (scraping) sau îl republici ca și cum ar
          fi al tău;
        </li>
        <li>folosești site-ul în scopuri ilegale.</li>
      </ul>

      <h3 className={H3}>Conturi</h3>
      <p className={P}>
        Ești responsabil pentru păstrarea confidențialității parolei tale. Ne
        rezervăm <b>dreptul de a suspenda sau șterge conturile</b> care încalcă
        acești termeni sau care sunt folosite abuziv. Poți cere oricând
        ștergerea contului tău scriindu-ne pe email.
      </p>

      <h3 className={H3}>Vârsta minimă</h3>
      <p className={P}>
        Pentru a-ți crea cont trebuie să ai <b>cel puțin 16 ani</b>. Dacă ai
        sub 16 ani, poți crea cont doar cu acordul părinților sau al
        tutorelui legal.
      </p>

      <h3 className={H3}>Drepturi de autor</h3>
      <p className={P}>
        Textele, descrierile, articolele, designul și selecția locurilor de pe
        BucQuest aparțin BucQuest și sunt protejate de legea drepturilor de
        autor. Le poți cita pe scurt, cu menționarea sursei și link către
        site; pentru orice altă reutilizare, cere-ne acordul.
      </p>
      <p className={P}>
        Fotografiile sunt fie proprii, fie preluate de pe Wikimedia Commons
        sub licențele indicate de autorii lor. Autorul, licența și sursa
        fiecărei imagini sunt listate pe pagina de{" "}
        <Link href="/credite" className="text-brand">
          credite foto
        </Link>
        ; dacă vrei să refolosești o fotografie, respectă licența ei. Dacă
        ești autorul unei imagini și consideri că nu e folosită corect,
        scrie-ne și rezolvăm.
      </p>

      <h3 className={H3}>Date personale</h3>
      <p className={P}>
        Modul în care prelucrăm datele tale e descris în{" "}
        <Link href="/confidentialitate" className="text-brand">
          Politica de confidențialitate
        </Link>
        .
      </p>

      <h3 className={H3}>Modificări și legea aplicabilă</h3>
      <p className={P}>
        Putem actualiza acești termeni; versiunea curentă e întotdeauna cea de
        pe această pagină, cu data de mai sus. Termenii sunt guvernați de legea
        română.
      </p>
    </div>
  );
}
