/* Verifica daca emailul dat e contul de administrator, citit din variabila de
   mediu ADMIN_EMAIL (nu hardcodat) — folosit ca sa restrictionam /admin/locatii. */
export function esteAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return Boolean(adminEmail && email && email.toLowerCase() === adminEmail.toLowerCase());
}
