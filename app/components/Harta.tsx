"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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

const PADDING_PREVIEW: [number, number] = [26, 26];

/* Preview-ul nu poate fi mutat de utilizator, deci incadrarea trebuie sa ramana
   corecta singura. `bounds` de pe MapContainer se aplica o singura data, la
   initializare: dupa ce containerul isi schimba latimea (rotire, breakpoint,
   redimensionare) pinurile ies din cadru. ResizeObserver reface incadrarea. */
function ReincadrarePreview({ puncte }: { puncte: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (puncte.length === 0) return;
    const bounds = L.latLngBounds(puncte);
    const potriveste = () => {
      map.invalidateSize({ animate: false });
      map.fitBounds(bounds, { padding: PADDING_PREVIEW, animate: false });
    };
    const ro = new ResizeObserver(potriveste);
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map, puncte]);

  return null;
}

type Props = {
  locuri: Loc[];
  onSelect?: (loc: Loc) => void;
  /* `false` da varianta de preview: aceleasi pinuri reale, dar harta e doar o
     imagine — fara drag, zoom, tastatura sau click pe pinuri. Vezi HartaPreview. */
  interactiv?: boolean;
};

/* Aceiasi parametri ca in proiectul vechi (explorator_bucuresti_4.html):
   centru Bucuresti [44.435, 26.095], zoom 13, tile layer CARTO light. */
export default function Harta({ locuri, onSelect, interactiv = true }: Props) {
  const cuCoordonate = useMemo(
    () =>
      locuri.filter(
        (loc): loc is Loc & { lat: number; lng: number } => loc.lat !== null && loc.lng !== null,
      ),
    [locuri],
  );

  /* Referinta stabila, altfel efectul din ReincadrarePreview ar reporni la fiecare render. */
  const puncte = useMemo(
    () => cuCoordonate.map((loc) => [loc.lat, loc.lng] as [number, number]),
    [cuCoordonate],
  );

  /* Preview-ul nu se poate misca, deci incadrarea fixa pe centrul Bucurestiului
     ar putea taia pinuri intr-un container mic. Il potrivim pe punctele reale
     inca de la primul render, ca sa nu se vada un salt. Harta interactiva ramane
     pe centrul si zoom-ul dinainte. */
  const incadrare =
    !interactiv && puncte.length > 0
      ? {
          bounds: L.latLngBounds(puncte),
          boundsOptions: { padding: PADDING_PREVIEW },
        }
      : { center: [44.435, 26.095] as [number, number], zoom: 13 };

  return (
    <MapContainer
      {...incadrare}
      zoomControl={interactiv}
      dragging={interactiv}
      scrollWheelZoom={interactiv}
      doubleClickZoom={interactiv}
      touchZoom={interactiv}
      boxZoom={interactiv}
      keyboard={interactiv}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
        maxZoom={19}
      />
      {!interactiv && <ReincadrarePreview puncte={puncte} />}
      {cuCoordonate.map((loc) => (
        <Marker
          key={loc.nume}
          position={[loc.lat, loc.lng]}
          icon={pinIcon(loc)}
          interactive={interactiv}
          riseOnHover={interactiv}
          eventHandlers={
            interactiv && onSelect ? { click: () => onSelect(loc) } : undefined
          }
        />
      ))}
    </MapContainer>
  );
}
