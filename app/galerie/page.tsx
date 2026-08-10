import type { Metadata } from "next";
import { cache } from "react";
import GalerieClient from "../components/GalerieClient";
import { getGaleriePoze, type PozaGalerie } from "../lib/galerie";
import { paginaMetadata } from "../lib/seo";

const TITLU = "Galerie foto · BucQuest";
const DESCRIERE =
  "Fotografii realizate de creatorul site-ului, organizate pe categorii — biserici, palate, clădiri și locuri insolite din București.";

/* cache() dedubleaza apelul catre Supabase — generateMetadata si pagina
   cer amandoua aceleasi poze, in acelasi request. */
const incarcaPoze = cache(async (): Promise<PozaGalerie[]> => {
  try {
    return await getGaleriePoze();
  } catch {
    return [];
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const poze = await incarcaPoze();
  // Prima poza din galerie (deja ordonata pe categorie + ordine) — daca nu exista
  // inca nicio poza urcata, paginaMetadata cade pe imaginea hero implicita.
  return paginaMetadata({
    title: TITLU,
    description: DESCRIERE,
    path: "/galerie",
    imagine: poze[0]?.url,
  });
}

export default async function GaleriePage() {
  const poze = await incarcaPoze();

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-7 pb-12 sm:px-7 sm:py-8 sm:pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Galerie
      </div>
      <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Poze din București</h2>
      <p className="mt-2 text-[13px] text-ink-soft">
        Fotografii realizate de creatorul site-ului.
      </p>

      <GalerieClient poze={poze} />
    </div>
  );
}
