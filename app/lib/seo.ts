import type { Metadata } from "next";

export const SITE_URL = "https://www.bucquest.com";
const SITE_NAME = "BucQuest";

/* Poza implicita pentru Open Graph/Twitter — un reper recognoscibil al orasului,
   folosita pe paginile care nu au o poza proprie (ex. un articol cu poza_url,
   sau primul rand din galerie, cand exista). Cale relativa: se rezolva la URL
   absolut prin `metadataBase` din app/layout.tsx. */
export const IMAGINE_OG_IMPLICITA = "/images/palatul_parlamentului_commons_01.jpg";

type ParametriMetadataPagina = {
  title: string;
  description: string;
  path: string;
  imagine?: string;
};

/* Construieste metadata consistenta (title, description, canonical, Open Graph,
   Twitter Card) pentru o pagina publica — folosita in fiecare app/**\/page.tsx
   in loc sa repetam manual openGraph/twitter pe fiecare pagina. */
export function paginaMetadata({
  title,
  description,
  path,
  imagine,
}: ParametriMetadataPagina): Metadata {
  const ogImage = imagine ?? IMAGINE_OG_IMPLICITA;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [ogImage],
      locale: "ro_RO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* Pentru paginile care nu trebuie indexate (cont, autentificare) — vizibile
   pentru vizitatori, dar fara rost in rezultatele de cautare. */
export const NEINDEXABIL: Metadata = {
  robots: { index: false, follow: true },
};
