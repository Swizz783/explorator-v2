"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { culoarePentruStil, type Loc } from "../data/locuri";
import { ICONITA_PIN_SVG } from "../data/iconite-pin";

/* Pinul-picatura: culoarea da STILUL arhitectural (vezi legenda de sub filtre),
   iar iconita din cap da TIPUL locului. Insigna de alama marcheaza "Nerenovat".
   Icoanele vin ca string din iconite-pin.ts — L.divIcon primeste HTML, nu JSX. */
function pinIcon(loc: Loc) {
  const culoare = culoarePentruStil(loc.stil);
  const iconita = ICONITA_PIN_SVG[loc.tip] ?? "";

  /* Iconita lucide are viewBox 24x24; o scalam la 11px si o centram in capul
     pinului (15,15). stroke-width marit, ca sa ramana lizibila la dimensiunea mica. */
  const grupIconita =
    '<g transform="translate(9.5 9.5) scale(0.4583)" fill="none" stroke="' +
    culoare +
    '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    iconita +
    "</g>";

  const insigna = loc.nerenovat
    ? '<circle cx="24.5" cy="5.5" r="4.5" fill="#a8823f" stroke="#fbf9f4" stroke-width="1.6"/>'
    : "";

  const html =
    '<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M15 1C7.3 1 1 7.4 1 15.3 1 25 15 39 15 39S29 25 29 15.3C29 7.4 22.7 1 15 1Z" fill="' +
    culoare +
    '" stroke="#fbf9f4" stroke-width="2"/>' +
    '<circle cx="15" cy="15" r="8.5" fill="#fbf9f4"/>' +
    grupIconita +
    insigna +
    "</svg>";

  return L.divIcon({
    className: "pin",
    html,
    iconSize: [30, 40],
    iconAnchor: [15, 39],
    tooltipAnchor: [0, -34],
  });
}

type Props = {
  locuri: Loc[];
  onSelect?: (loc: Loc) => void;
};

/* Aceiasi parametri ca in proiectul vechi (explorator_bucuresti_4.html):
   centru Bucuresti [44.435, 26.095], zoom 13, tile layer CARTO light. */
export default function Harta({ locuri, onSelect }: Props) {
  return (
    <MapContainer
      center={[44.435, 26.095]}
      zoom={13}
      zoomControl
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
        maxZoom={19}
      />
      {locuri.filter((loc) => loc.lat !== null && loc.lng !== null).map(
        (loc) => (
          <Marker
            key={loc.nume}
            position={[loc.lat as number, loc.lng as number]}
            icon={pinIcon(loc)}
            riseOnHover
            eventHandlers={
              onSelect ? { click: () => onSelect(loc) } : undefined
            }
          />
        ),
      )}
    </MapContainer>
  );
}
