import {
  Award,
  Building2,
  Castle,
  Coffee,
  Church,
  Cross,
  DoorOpen,
  Drama,
  House,
  Landmark,
  LandPlot,
  Signpost,
  Sparkles,
  TrainFront,
  Trees,
  University,
  type LucideIcon,
} from "lucide-react";
import type { Tip } from "./locuri";

/* Iconita line-art pentru fiecare TIP de loc (lucide-react) — folosita in filtre,
   pe etichetele din carduri si pe tile-urile de categorii de pe homepage.
   Pe harta, tipul apare in capul pinului; acolo nu putem randa componente React
   (L.divIcon primeste HTML ca string), deci markup-ul e generat separat in
   app/data/iconite-pin.ts. Cele doua fisiere trebuie sa ramana in sincron —
   vezi scripts/generate-iconite-pin.ts. */
export const ICOANA_TIP: Record<Tip, LucideIcon> = {
  "Biserica": Church,
  "Cafenea / restaurant": Coffee,
  "Casa": House,
  "Cimitir": Cross,
  "Cladire": Building2,
  "Gara": TrainFront,
  "Loc insolit": Sparkles,
  "Monument": Award,
  "Muzeu": University,
  "Palat": Landmark,
  "Parc": Trees,
  "Pasaj": DoorOpen,
  "Piata": LandPlot,
  "Strada": Signpost,
  "Teatru": Drama,
  "Vila": Castle,
};
