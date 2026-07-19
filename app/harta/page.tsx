import type { Stil, Tip } from "../data/locuri";
import Explorator from "../components/Explorator";
import { TRASEE } from "../data/trasee";
import { getLocuri } from "../lib/locatii";

type Props = {
  searchParams: Promise<{ tip?: string; stil?: string; traseu?: string }>;
};

export default async function HartaPage({ searchParams }: Props) {
  const locuri = await getLocuri();
  const { tip, stil, traseu } = await searchParams;

  const traseuActiv = traseu ? (TRASEE.find((t) => t.id === traseu) ?? null) : null;

  const tipuriValide = new Set(locuri.map((l) => l.tip));
  const stiluriValide = new Set(locuri.map((l) => l.stil).filter((s): s is Stil => s !== null));
  const initialTip = tip && tipuriValide.has(tip as Tip) ? (tip as Tip) : null;
  const initialStil = stil && stiluriValide.has(stil as Stil) ? (stil as Stil) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Explorator
        locuri={locuri}
        initialTip={initialTip}
        initialStil={initialStil}
        traseu={traseuActiv}
      />
    </div>
  );
}
