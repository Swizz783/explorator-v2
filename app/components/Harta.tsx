"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* Aceiasi parametri ca in proiectul vechi (explorator_bucuresti_4.html):
   centru Bucuresti [44.435, 26.095], zoom 13, tile layer CARTO light. */
export default function Harta() {
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
    </MapContainer>
  );
}
