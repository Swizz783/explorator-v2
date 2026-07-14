"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CULOARE_TIP, type Loc } from "../data/locuri";

/* Pinul-picatura din proiectul vechi: colorat pe tipul locului, contur alb,
   insigna de alama pentru locurile marcate "Nerenovat". */
function pinIcon(loc: Loc) {
  const culoare = CULOARE_TIP[loc.tip];
  const insigna = loc.nerenovat
    ? '<circle cx="23.5" cy="6.5" r="5" fill="#a8823f" stroke="#fbf9f4" stroke-width="1.6"/>'
    : "";
  const html =
    '<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M15 1C7.3 1 1 7.4 1 15.3 1 25 15 39 15 39S29 25 29 15.3C29 7.4 22.7 1 15 1Z" fill="' +
    culoare +
    '" stroke="#fbf9f4" stroke-width="2"/>' +
    '<circle cx="15" cy="15" r="5" fill="#fbf9f4"/>' +
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
