/* Sursa unica pentru navigatia principala: aceleasi intrari, in aceeasi ordine,
   si in bara de pe desktop (NavLinks) si in meniul de pe mobil (MeniuMobil).
   Footer-ul isi tine lista lui, cu alte etichete. */
export const LINKURI_NAV = [
  { href: "/harta", label: "Harta" },
  { href: "/blog", label: "Blog" },
  { href: "/galerie", label: "Galerie" },
  { href: "/despre", label: "Despre" },
  { href: "/profil", label: "Profil" },
];

/* O intrare e activa si pe subrutele ei (/blog/3 tine "Blog" activ). */
export function esteActiv(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
