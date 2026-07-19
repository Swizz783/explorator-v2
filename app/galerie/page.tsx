import type { Metadata } from "next";
import GalerieClient from "../components/GalerieClient";
import { getGaleriePoze, type PozaGalerie } from "../lib/galerie";

export const metadata: Metadata = {
  title: "Galerie · BucQuest",
};

export default async function GaleriePage() {
  let poze: PozaGalerie[] = [];
  try {
    poze = await getGaleriePoze();
  } catch {
    poze = [];
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-7 py-8 pb-16">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        Galerie
      </div>
      <h2 className="mt-2 text-2xl font-semibold">Poze din București</h2>
      <p className="mt-2 text-[13px] text-ink-soft">
        Fotografii realizate de creatorul site-ului.
      </p>

      <GalerieClient poze={poze} />
    </div>
  );
}
