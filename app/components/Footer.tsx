import type { ReactNode } from "react";
import Link from "next/link";
import { getContactSocial, type ContactSocial } from "../lib/contactSocial";
import LogoMark from "./LogoMark";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
      <path d="M16.5 3c.4 2.2 1.8 3.7 4 4v3c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3z" />
    </svg>
  );
}

/* Acelasi tratament de contur ca iconita de Instagram (1.8px, currentColor);
   colturile lui "f" cer imbinare rotunda, altfel ies varfuri ascutite la 17px. */
function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/* Randul de social: link activ daca avem URL, altfel span dezactivat (gri, fara
   href) — ca sa nu fie niciodata un link mort cand cineva uita sa completeze URL-ul
   in Supabase. Username-ul e independent de URL: cu URL dar fara username arata
   doar iconita (ca inainte de acest username); fara URL, randul ramane dezactivat
   indiferent daca username-ul e completat — un username fara destinatie n-are
   sens sa fie afisat. Iconita si textul sunt in ACELASI <a>, nu doua linkuri
   alaturate spre aceeasi adresa — un singur link e mai clar la screen reader. */
function LinkSocial({
  href,
  username,
  label,
  children,
}: {
  href: string | null;
  username: string | null;
  label: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span
        title={`${label} — link indisponibil momentan`}
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-plaster-2/30"
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={username ? undefined : label}
      className="group inline-flex items-center gap-2.5 text-plaster-2/85 transition hover:text-plaster-2"
    >
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/20 transition group-hover:border-white/50 group-hover:bg-white/10">
        {children}
      </span>
      {username && <span className="text-[13.5px] font-medium">{username}</span>}
    </a>
  );
}

const LINKURI_NAVIGATIE = [
  { href: "/harta", label: "Hartă" },
  { href: "/blog", label: "Blog" },
  { href: "/galerie", label: "Galerie" },
  { href: "/despre", label: "Despre" },
  { href: "/profil", label: "Profil" },
];

/* Footer global, vizibil pe toate paginile — layout pe 3 coloane (brand, navigatie,
   contact), stivuite pe mobil. Fundal midnight (mai inchis decat brand-ul din header,
   ca fundalul sa nu se confunde cu accentul de brand), text deschis pentru contrast. */
export default async function Footer() {
  const golit: ContactSocial = {
    instagramUrl: null,
    tiktokUrl: null,
    facebookUrl: null,
    instagramUsername: null,
    tiktokUsername: null,
    facebookUsername: null,
  };
  let social: ContactSocial = golit;
  try {
    social = await getContactSocial();
  } catch {
    social = golit;
  }

  return (
    <footer className="bg-midnight text-plaster-2">
      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-3 sm:gap-9 sm:px-7 sm:py-10">
        {/* Brand */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand">
              <LogoMark color="var(--color-plaster-2)" className="h-5 w-auto" />
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="font-serif text-xl font-semibold text-plaster-2">BucQuest</span>
              <span className="text-[12.5px] font-medium text-plaster-2/65">Discover Bucharest</span>
            </div>
          </div>
          <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.6] text-plaster-2/65">
            Descoperă patrimoniul și locurile ascunse ale Bucureștiului.
          </p>
        </div>

        {/* Navigatie */}
        <div>
          <h3 className="font-serif text-[13px] font-semibold uppercase tracking-[0.14em] text-plaster-2/85">
            Navigație
          </h3>
          <nav className="mt-3.5 flex flex-col gap-2.5 text-[13.5px]">
            {LINKURI_NAVIGATIE.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-plaster-2/75 transition hover:text-plaster-2"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-[13px] font-semibold uppercase tracking-[0.14em] text-plaster-2/85">
            Contact
          </h3>
          <div className="mt-3.5 flex flex-col gap-2.5 text-[13.5px]">
            <a
              href="mailto:contactbucquest@gmail.com"
              className="text-plaster-2/75 transition hover:text-plaster-2"
            >
              contactbucquest@gmail.com
            </a>
            <Link href="/credite" className="text-plaster-2/75 transition hover:text-plaster-2">
              Credite
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <LinkSocial href={social.instagramUrl} username={social.instagramUsername} label="Instagram">
              <InstagramIcon />
            </LinkSocial>
            <LinkSocial href={social.tiktokUrl} username={social.tiktokUsername} label="TikTok">
              <TikTokIcon />
            </LinkSocial>
            <LinkSocial href={social.facebookUrl} username={social.facebookUsername} label="Facebook">
              <FacebookIcon />
            </LinkSocial>
          </div>
        </div>
      </div>
    </footer>
  );
}
