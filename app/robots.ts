import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

/* /autentificare si /profil sunt continut personal/utilitar, fara rost in
   cautari (vezi si NEINDEXABIL in app/lib/seo.ts); /auth/ e doar callback-ul
   tehnic de OAuth. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/autentificare", "/profil", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
