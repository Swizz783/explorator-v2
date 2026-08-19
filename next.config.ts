import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Limita implicita (1mb) e prea mica pentru mai multe poze urcate odata
    // dintr-un singur Server Action (ex. /admin/articole, /admin/locatii).
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
