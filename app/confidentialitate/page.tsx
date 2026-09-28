import Link from "next/link";
import type { Metadata } from "next";
import { paginaMetadata } from "../lib/seo";

export const metadata: Metadata = paginaMetadata({
  title: "Politica de confidențialitate · BucQuest",
  description:
    "Ce date personale colectează BucQuest, de ce, cât timp le păstrăm, cui le transmitem și ce drepturi ai conform GDPR.",
  path: "/confidentialitate",
});

const ULTIMA_ACTUALIZARE = "28 septembrie 2026";

const P = "mt-2.5 text-[15px] leading-[1.75] text-[#3a362d]";
const UL = "mt-2.5 list-disc space-y-1 pl-[22px] text-[15px] leading-[1.75] text-[#3a362d]";
const H3 = "mt-8 text-xl font-semibold";

/* Acelasi layout ca /despre. Destinatarii de mai jos corespund serviciilor folosite
   efectiv in cod (Supabase, Vercel + Vercel Analytics, Google OAuth, Stadia Maps) —
   daca adaugi un serviciu nou care primeste date de la vizitatori, adauga-l si aici
   si actualizeaza ULTIMA_ACTUALIZARE. */
export default function ConfidentialitatePage() {
  return (
    <div className="mx-auto w-full max-w-[820px] px-4 py-7 pb-12 sm:px-7 sm:py-8 sm:pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Informații legale
      </div>
      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
        Politica de confidențialitate
      </h2>
      <p className="mt-2 text-[13px] text-ink-soft">
        Ultima actualizare: {ULTIMA_ACTUALIZARE}
      </p>

      <p className="mt-5 text-[15px] leading-[1.75] text-[#3a362d]">
        Pagina asta explică ce date personale prelucrează BucQuest când
        folosești site-ul, de ce, cât timp le păstrăm și ce drepturi ai conform
        Regulamentului (UE) 2016/679 (GDPR). Am încercat să colectăm cât mai
        puțin: poți folosi harta, articolele și galeria fără cont.
      </p>

      <h3 className={H3}>Cine este operatorul</h3>
      <p className={P}>
        Operatorul datelor este <b>BucQuest</b>. Pentru orice întrebare sau
        cerere legată de datele tale ne poți scrie la{" "}
        <a href="mailto:contactbucquest@gmail.com" className="text-brand">
          contactbucquest@gmail.com
        </a>
        .
      </p>

      <h3 className={H3}>Ce date colectăm</h3>
      <ul className={UL}>
        <li>
          <b>Date de cont</b>, doar dacă îți creezi cont: adresa de email și
          parola (stocată criptat, noi nu o putem vedea). Dacă te autentifici cu
          Google, primim de la Google adresa de email, numele și poza de profil
          asociate contului tău Google.
        </li>
        <li>
          <b>Progresul tău</b>, doar dacă ai cont: lista locurilor pe care le-ai
          marcat ca vizitate și data la care le-ai marcat.
        </li>
        <li>
          <b>Date tehnice de conectare</b>: data ultimei autentificări și,
          în jurnalele de securitate ale furnizorilor noștri, adresa IP și tipul
          de browser.
        </li>
        <li>
          <b>Statistici de trafic anonime</b>: ce pagini sunt vizitate, țara,
          tipul de dispozitiv și browser, agregate, fără cookies și fără să te
          putem identifica individual.
        </li>
      </ul>
      <p className={P}>
        Dacă nu ai cont, progresul de vizitare rămâne doar în browserul tău
        (vezi secțiunea despre cookies și localStorage) și nu ajunge la noi.
      </p>

      <h3 className={H3}>De ce le folosim și pe ce temei legal</h3>
      <ul className={UL}>
        <li>
          <b>Crearea și administrarea contului</b>, salvarea progresului și
          sincronizarea lui între dispozitive — temei:{" "}
          <b>executarea serviciului</b> pe care ni-l ceri când îți faci cont
          (art. 6 alin. (1) lit. b GDPR).
        </li>
        <li>
          <b>Securitatea site-ului și prevenirea abuzurilor</b> (jurnale
          tehnice) și <b>statistici anonime de trafic</b>, ca să știm ce pagini
          sunt utile — temei: <b>interesul nostru legitim</b> de a ține site-ul
          funcțional și sigur (art. 6 alin. (1) lit. f GDPR).
        </li>
      </ul>
      <p className={P}>
        Nu folosim datele tale pentru publicitate, nu le vindem și nu facem
        profilare.
      </p>

      <h3 className={H3}>Cui transmitem datele</h3>
      <p className={P}>
        Folosim câțiva furnizori care prelucrează date în numele nostru, strict
        pentru funcționarea site-ului:
      </p>
      <ul className={UL}>
        <li>
          <b>Supabase</b> — baza de date, autentificarea și stocarea
          fotografiilor. Aici sunt păstrate contul și progresul tău.
        </li>
        <li>
          <b>Vercel</b> — găzduirea site-ului și Vercel Web Analytics
          (statistici de trafic fără cookies).
        </li>
        <li>
          <b>Google</b> — doar dacă alegi „Continuă cu Google”: Google
          confirmă identitatea ta și ne transmite datele de profil menționate
          mai sus.
        </li>
        <li>
          <b>Stadia Maps</b> — furnizorul imaginilor hărții. Când deschizi
          harta, browserul tău cere imaginile direct de la Stadia Maps, care
          primește astfel adresa ta IP.
        </li>
      </ul>
      <p className={P}>
        Unii dintre acești furnizori pot prelucra date și în afara Spațiului
        Economic European; în aceste cazuri transferul se face pe baza
        garanțiilor prevăzute de GDPR (de exemplu, clauzele contractuale
        standard aprobate de Comisia Europeană). Fonturile site-ului sunt
        găzduite pe serverul nostru, nu sunt încărcate de la Google.
      </p>

      <h3 className={H3}>Cât timp păstrăm datele</h3>
      <p className={P}>
        Datele de cont și progresul le păstrăm <b>cât timp contul tău este
        activ</b>. Dacă ne ceri ștergerea contului, îl ștergem împreună cu
        progresul asociat. Jurnalele tehnice ale furnizorilor sunt păstrate
        pentru perioade scurte, conform politicilor acestora.
      </p>

      <h3 className={H3}>Drepturile tale</h3>
      <p className={P}>Conform GDPR, ai dreptul:</p>
      <ul className={UL}>
        <li>să afli ce date avem despre tine și să primești o copie (acces);</li>
        <li>să ceri corectarea datelor inexacte (rectificare);</li>
        <li>să ceri ștergerea contului și a datelor („dreptul de a fi uitat”);</li>
        <li>să ceri restricționarea prelucrării;</li>
        <li>să primești datele într-un format structurat (portabilitate);</li>
        <li>
          să te opui prelucrării bazate pe interesul nostru legitim.
        </li>
      </ul>
      <p className={P}>
        Pentru oricare dintre ele, scrie-ne la{" "}
        <a href="mailto:contactbucquest@gmail.com" className="text-brand">
          contactbucquest@gmail.com
        </a>{" "}
        de pe adresa asociată contului. Răspundem în cel mult o lună.
      </p>

      <h3 className={H3}>Dreptul de a depune plângere</h3>
      <p className={P}>
        Dacă consideri că datele tale nu sunt prelucrate corect, poți depune o
        plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor
        cu Caracter Personal (ANSPDCP), B-dul G-ral. Gheorghe Magheru 28-30,
        București,{" "}
        <a
          href="https://www.dataprotection.ro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand"
        >
          www.dataprotection.ro
        </a>
        . Te rugăm totuși să ne scrii mai întâi — probabil putem rezolva
        direct.
      </p>

      <h3 className={H3}>Cookies și localStorage</h3>
      <p className={P}>
        BucQuest folosește doar stocare <b>strict necesară</b> pentru
        funcționarea site-ului, motiv pentru care nu îți cerem consimțământul
        printr-un banner:
      </p>
      <ul className={UL}>
        <li>
          <b>Cookies de sesiune Supabase</b> — setate doar când te
          autentifici, ca să rămâi logat de la o pagină la alta. Dispar când te
          deconectezi.
        </li>
        <li>
          <b>localStorage</b> (cheia <code>explorer2_visited</code>) — dacă nu
          ai cont, lista locurilor bifate ca vizitate e salvată doar în
          browserul tău. Nu e trimisă nicăieri; o poți șterge oricând din
          setările browserului.
        </li>
      </ul>
      <p className={P}>
        Statisticile de trafic (Vercel Web Analytics) funcționează{" "}
        <b>fără cookies</b> și fără identificatori persistenți. Nu folosim
        cookies de publicitate sau de urmărire.
      </p>

      <h3 className={H3}>Modificări</h3>
      <p className={P}>
        Dacă schimbăm modul în care prelucrăm datele, actualizăm pagina asta și
        data de mai sus. Vezi și{" "}
        <Link href="/termeni" className="text-brand">
          Termenii și condițiile
        </Link>
        .
      </p>
    </div>
  );
}
