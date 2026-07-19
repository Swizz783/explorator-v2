import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticolById } from "../../lib/articole";

type Props = {
  params: Promise<{ id: string }>;
};

async function incarcaArticol(id: string) {
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) return null;
  try {
    return await getArticolById(idNum);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const articol = await incarcaArticol(id);
  return {
    title: articol ? `${articol.titlu} · BucQuest` : "Articol negăsit · BucQuest",
  };
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
    <div className="mx-auto w-full max-w-[760px] px-7 py-8 pb-16">
      <Link href="/blog" className="text-sm font-medium text-enamel">
        ← Toate articolele
      </Link>

      {articol.pozaUrl && (
        <div className="mt-5 overflow-hidden rounded-[13px] border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element -- poza_url e completata manual din dashboard, poate fi orice domeniu */}
          <img
            src={articol.pozaUrl}
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
    </div>
  );
}
