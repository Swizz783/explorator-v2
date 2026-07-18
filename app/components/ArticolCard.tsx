import Link from "next/link";
import type { Articol } from "../lib/articole";
import Placeholder from "./Placeholder";

function formatData(dataPublicare: string): string {
  return new Date(dataPublicare).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Card de articol, in acelasi limbaj vizual ca .card de la locatii
   (thumbnail + titlu + rezumat), folosit pe homepage si pe /blog. */
export default function ArticolCard({ articol }: { articol: Articol }) {
  return (
    <Link
      href={`/blog/${articol.id}`}
      className="block overflow-hidden rounded-[13px] border border-line bg-card transition hover:border-enamel hover:shadow-card"
    >
      <div className="relative h-[150px]">
        {articol.pozaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- poza_url e completata manual din dashboard, poate fi orice domeniu
          <img
            src={articol.pozaUrl}
            alt={articol.titlu}
            className="h-full w-full object-cover"
          />
        ) : (
          <Placeholder label="Articol" />
        )}
      </div>
      <div className="p-3.5 pb-4">
        <div className="text-[11px] text-ink-soft">{formatData(articol.dataPublicare)}</div>
        <h3 className="mt-1 text-[16px] font-semibold">{articol.titlu}</h3>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-[#4a463d]">{articol.rezumat}</p>
      </div>
    </Link>
  );
}
