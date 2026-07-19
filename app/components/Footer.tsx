import type { ReactNode } from "react";
import Link from "next/link";
import { getContactSocial, type ContactSocial } from "../lib/contactSocial";

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

/* Iconita de social: link activ daca avem URL, altfel span dezactivat (gri, fara href) —
   ca sa nu fie niciodata un link mort cand cineva uita sa completeze URL-ul in Supabase. */
function IconLink({ href, label, children }: { href: string | null; label: string; children: ReactNode }) {
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
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-plaster-2 transition hover:border-white/50 hover:bg-white/10"
    >
      {children}
    </a>
  );
}

/* Footer global, vizibil pe toate paginile — fundal enamel (aceeasi culoare ca
   plaque-ul "BucQuest" din header), text deschis pentru contrast. */
export default async function Footer() {
  let social: ContactSocial = { instagramUrl: null, tiktokUrl: null };
  try {
    social = await getContactSocial();
  } catch {
    social = { instagramUrl: null, tiktokUrl: null };
  }

  return (
    <footer className="bg-enamel text-plaster-2">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 px-7 py-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <a
            href="mailto:contactbucquest@gmail.com"
            className="font-medium transition hover:text-white"
          >
            contactbucquest@gmail.com
          </a>
          <Link href="/credite" className="text-plaster-2/75 transition hover:text-plaster-2">
            Credite
          </Link>
        </div>
        <div className="flex items-center gap-2.5">
          <IconLink href={social.instagramUrl} label="Instagram">
            <InstagramIcon />
          </IconLink>
          <IconLink href={social.tiktokUrl} label="TikTok">
            <TikTokIcon />
          </IconLink>
        </div>
      </div>
    </footer>
  );
}
