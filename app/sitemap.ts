import type { MetadataRoute } from "next";
import { getArticole } from "./lib/articole";
import { SITE_URL } from "./lib/seo";

/* Rutele publice, statice — /autentificare si /profil raman in afara sitemap-ului
   (vezi NEINDEXABIL in app/lib/seo.ts). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginiStatice: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/harta`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/galerie`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/despre`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/credite`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let articole: Awaited<ReturnType<typeof getArticole>> = [];
  try {
    articole = await getArticole();
  } catch {
    // tabelul `articole` poate sa nu existe inca (vezi supabase/articole.sql) —
    // sitemap-ul nu trebuie sa pice din cauza asta, doar omite paginile de articol.
  }

  const paginiArticole: MetadataRoute.Sitemap = articole.map((a) => ({
    url: `${SITE_URL}/blog/${a.id}`,
    lastModified: a.dataPublicare,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...paginiStatice, ...paginiArticole];
}
