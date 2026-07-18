import Link from "next/link";

type Props = {
  loggedIn: boolean;
};

/* Starea de autentificare din header: doar butonul "Autentificare" cand nu esti logat.
   Cand esti logat, "Profil" din meniul principal + "Delogare" (in Profil) preiau rolul. */
export default function AuthStatus({ loggedIn }: Props) {
  if (loggedIn) return null;

  return (
    <Link
      href="/autentificare"
      className="whitespace-nowrap rounded-full border border-ink bg-ink px-3.5 py-[7px] text-xs font-medium text-plaster-2 transition hover:bg-enamel-deep hover:border-enamel-deep"
    >
      Autentificare
    </Link>
  );
}
