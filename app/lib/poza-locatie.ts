/* Poze noi vin din Supabase Storage ca URL-uri complete; pozele vechi sunt
   doar nume de fisiere din public/images. */
export function rezolvaPozaLocatie(poza: string): string {
  if (poza.startsWith("http")) return poza;
  return `/images/${poza}`;
}
