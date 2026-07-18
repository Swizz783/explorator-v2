import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import AuthStatus from "./components/AuthStatus";
import NavLinks from "./components/NavLinks";
import ProgressBar from "./components/ProgressBar";
import { getLocuriTotal } from "./lib/locatii";
import { createClient } from "./lib/supabase/server";
import { VisitedProvider } from "./store/VisitedContext";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Explorator București",
  description:
    "Ghid de arhitectură urbană a Bucureștiului: palate, biserici, brutalism și locuri ascunse.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const total = await getLocuriTotal();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="ro"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-plaster text-ink font-sans">
        <VisitedProvider total={total}>
          <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line px-7 py-4">
            <div className="flex items-center gap-4 justify-self-start">
              <Link href="/" className="plaque text-[15px]">
                Explorator București
              </Link>
              <span className="hidden text-xs text-ink-soft sm:inline">
                ghid de arhitectură urbană
              </span>
            </div>
            <NavLinks />
            <div className="flex items-center gap-4 justify-self-end">
              <ProgressBar />
              <AuthStatus email={user?.email ?? null} />
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1080px] flex-1 px-7">
            {children}
          </main>
        </VisitedProvider>
      </body>
    </html>
  );
}
