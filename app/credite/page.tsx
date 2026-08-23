import Image from "next/image";
import type { Metadata } from "next";
import { CREDITE } from "../data/credite";
import { getCrediteDinamice } from "../lib/credite";
import { paginaMetadata } from "../lib/seo";

export const metadata: Metadata = paginaMetadata({
  title: "Credite foto · BucQuest",
  description:
    "Atribuirile complete pentru fotografiile folosite în BucQuest — autori, licențe și surse, pentru fiecare imagine din arhivă sau de pe Wikimedia Commons.",
  path: "/credite",
});

/* Continut portat identic din proiectul vechi (sectiunea #credite / buildCredite()).
   Sursa originala: Explorator_Bucuresti_credite_poze.xlsx -> credite_data.js — toate
   cele 72 de atribuiri, neomise si neprescurtate (informatie cu relevanta legala). */
export default async function CreditePage() {
  const crediteDinamice = await getCrediteDinamice();

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-7 pb-12 sm:px-7 sm:py-8 sm:pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Atribuiri
      </div>
      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Credite foto</h2>

      <p className="mt-4 max-w-[70ch] text-sm leading-[1.6] text-ink-soft">
        Fotografiile provin din arhiva proprie sau de pe Wikimedia Commons si
        sunt folosite conform licentelor indicate de autori.
      </p>

      {crediteDinamice.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-[13px] border border-line bg-card">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-plaster-2">
                <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Poza
                </th>
                <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Referință
                </th>
                <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Autor
                </th>
                <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Licenta
                </th>
                <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Sursa
                </th>
              </tr>
            </thead>
            <tbody>
              {crediteDinamice.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-3.5 py-2.5">
                    <div className="relative h-16 w-24 overflow-hidden rounded-md bg-plaster-2">
                      {/* eslint-disable-next-line @next/next/no-img-element -- URL complet din Supabase Storage, nu un asset local optimizabil de next/image */}
                      <img
                        src={c.poza_url}
                        alt={c.referinta}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5">{c.referinta}</td>
                  <td className="px-3.5 py-2.5">{c.autor}</td>
                  <td className="px-3.5 py-2.5">
                    {c.licenta_url ? (
                      <a
                        href={c.licenta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand"
                      >
                        {c.licenta ?? "—"}
                      </a>
                    ) : (
                      c.licenta ?? "—"
                    )}
                  </td>
                  <td className="px-3.5 py-2.5">
                    {c.sursa_url ? (
                      <a
                        href={c.sursa_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand"
                      >
                        Sursă
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-[13px] border border-line bg-card">
        <table className="w-full min-w-[760px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-plaster-2">
              <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Poza
              </th>
              <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Fisier
              </th>
              <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Loc
              </th>
              <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Autor
              </th>
              <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Licenta
              </th>
              <th className="px-3.5 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Sursa
              </th>
            </tr>
          </thead>
          <tbody>
            {CREDITE.map((c) => (
              <tr key={c.file} className="border-t border-line">
                <td className="px-3.5 py-2.5">
                  <div className="relative h-16 w-24 overflow-hidden rounded-md bg-plaster-2">
                    <Image
                      src={`/images/${c.file}`}
                      alt={c.loc}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-3.5 py-2.5 font-mono text-[11.5px] text-ink-soft">
                  {c.file}
                </td>
                <td className="px-3.5 py-2.5">{c.loc}</td>
                <td className="px-3.5 py-2.5">{c.autor}</td>
                <td className="px-3.5 py-2.5">
                  {c.licentaUrl ? (
                    <a
                      href={c.licentaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand"
                    >
                      {c.licenta}
                    </a>
                  ) : (
                    c.licenta
                  )}
                </td>
                <td className="px-3.5 py-2.5">
                  {c.sursaUrl ? (
                    <a
                      href={c.sursaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand"
                    >
                      Wikimedia Commons
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-soft">
        Sursa listei: <b>Explorator_Bucuresti_credite_poze.xlsx</b> — după
        orice modificare, rulează <b>python genereaza_locuri.py</b>.
      </p>
    </div>
  );
}
