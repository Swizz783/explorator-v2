import Link from "next/link";
import { logout } from "../autentificare/actions";

type Props = {
  email: string | null;
};

/* Starea de autentificare din header: buton "Autentificare" cand nu esti logat,
   sau email + "Delogare" cand esti. Delogarea trece prin Server Action (fara JS client). */
export default function AuthStatus({ email }: Props) {
  if (!email) {
    return (
      <Link
        href="/autentificare"
        className="whitespace-nowrap rounded-full border border-ink bg-ink px-3.5 py-[7px] text-xs font-medium text-plaster-2 transition hover:bg-enamel-deep hover:border-enamel-deep"
      >
        Autentificare
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden max-w-[160px] truncate text-xs text-ink-soft md:inline">
        {email}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="whitespace-nowrap rounded-full border border-line bg-card px-3.5 py-[7px] text-xs font-medium text-ink-soft transition hover:border-enamel hover:text-ink"
        >
          Delogare
        </button>
      </form>
    </div>
  );
}
