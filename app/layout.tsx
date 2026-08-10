import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import AuthStatus from "./components/AuthStatus";
import Footer from "./components/Footer";
import FooterGate from "./components/FooterGate";
import LogoMark from "./components/LogoMark";
import MainArea from "./components/MainArea";
import MeniuMobil from "./components/MeniuMobil";
import NavLinks from "./components/NavLinks";
import ProgressBar from "./components/ProgressBar";
import { getLocuri } from "./lib/locatii";
import { createClient } from "./lib/supabase/server";
import { SITE_URL } from "./lib/seo";
import { getVizitatePentruUser } from "./lib/vizitat";
import { VisitedProvider } from "./store/VisitedContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

/* Metadata generica de brand — fallback pentru orice pagina fara metadata proprie.
   Fiecare pagina reala (inclusiv homepage-ul, in app/page.tsx) isi seteaza propria
   metadata prin `paginaMetadata()`, cu canonical/Open Graph specifice rutei ei. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BucQuest — Discover Bucharest",
  description:
    "Descoperă patrimoniul arhitectural al Bucureștiului: palate, biserici, brutalism și locuri ascunse. Hartă interactivă, trasee ghidate și articole.",
  verification: {
    google: "GQhVjZ9Uo32wzdhHj1Oh7wF2Aq_0nusnkzVWznQHVjo",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locuri = await getLocuri();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const initialVisited = user ? await getVizitatePentruUser(user.id) : [];

  return (
    <html
      lang="ro"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col bg-plaster text-ink font-sans">
        <VisitedProvider
          total={locuri.length}
          userId={user?.id ?? null}
          initialVisited={initialVisited}
          locuri={locuri}
        >
          {/* Sub `md`: logo in stanga, hamburger in dreapta (panoul lui se ancoreaza
              pe `relative` de aici). De la `md` in sus, grila pe 3 coloane de dinainte. */}
          <header className="relative flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-7 md:py-4">
            <div className="flex min-w-0 items-center gap-4 md:justify-self-start">
              <Link href="/" className="flex min-w-0 items-center gap-2.5">
                <LogoMark color="var(--color-brand)" className="h-7 w-auto flex-none md:h-8" />
                <span className="truncate font-serif text-[17px] font-semibold text-brand md:text-[19px]">
                  BucQuest
                </span>
              </Link>
              <span className="hidden text-xs text-ink-soft lg:inline">
                Discover Bucharest
              </span>
            </div>
            <NavLinks />
            <div className="hidden items-center gap-4 md:flex md:justify-self-end">
              <ProgressBar />
              <AuthStatus loggedIn={Boolean(user)} />
            </div>
            <MeniuMobil loggedIn={Boolean(user)} />
          </header>
          <MainArea>{children}</MainArea>
          <FooterGate>
            <Footer />
          </FooterGate>
        </VisitedProvider>
      </body>
    </html>
  );
}
