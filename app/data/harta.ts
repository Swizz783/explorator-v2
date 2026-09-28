// Stratul de tile-uri al hartii (Leaflet). Schimba-l de aici pentru toate hartile.
// Stadia Maps Alidade Smooth — CARTO basemaps cer acum API key.

export const TILE_LAYER = {
  url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
} as const;
