import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getArticolById } from "../../lib/articole";
import { paginaMetadata } from "../../lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

/* cache() dedubleaza apelul catre Supabase — generateMetadata si pagina
   cer amandoua acelasi articol, in acelasi request. */
const incarcaArticol = cache(async (id: string) => {
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) return null;
  try {
    return await getArticolById(idNum);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const articol = await incarcaArticol(id);

  if (!articol) {
    return { title: "Articol negăsit · BucQuest" };
  }

  return paginaMetadata({
    title: `${articol.titlu} · BucQuest`,
    description: articol.rezumat,
    path: `/blog/${id}`,
    imagine: articol.poze[0] ?? undefined,
  });
}

export default async function ArticolPage({ params }: Props) {
  const { id } = await params;
  const articol = await incarcaArticol(id);

  if (!articol) notFound();

  const data = new Date(articol.dataPublicare).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-7 pb-12 sm:px-7 sm:py-8 sm:pb-16">
      <Link href="/blog" className="text-sm font-medium text-brand">
        ← Toate articolele
      </Link>

      {articol.poze[0] && (
        <div className="mt-5 overflow-hidden rounded-[13px] border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element -- poza e completata manual din dashboard sau urcata din admin, poate fi orice domeniu */}
          <img
            src={articol.poze[0]}
            alt={articol.titlu}
            className="max-h-[420px] w-full object-cover"
          />
        </div>
      )}

      <div className="mt-6 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        {data}
      </div>
      <h1 className="mt-2 text-[32px] font-semibold leading-tight">{articol.titlu}</h1>

      <div className="mt-6 whitespace-pre-line text-[15px] leading-[1.75] text-[#3a362d]">
        {articol.continut}
      </div>

      {articol.poze.length > 1 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {articol.poze.slice(1).map((poza) => (
            // eslint-disable-next-line @next/next/no-img-element -- poza vine din Supabase Storage, nu din /public
            <img
              key={poza}
              src={poza}
              alt={articol.titlu}
              className="aspect-square w-full rounded-[13px] border border-line object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
