import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import AuthStatus from "./components/AuthStatus";
import Footer from "./components/Footer";
import MainArea from "./components/MainArea";
import NavLinks from "./components/NavLinks";
import ProgressBar from "./components/ProgressBar";
import { getLocuri } from "./lib/locatii";
import { createClient } from "./lib/supabase/server";
import { getVizitatePentruUser } from "./lib/vizitat";
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
  title: "BucQuest — Discover Bucharest",
  description: "BucQuest — Discover Bucharest",
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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col bg-plaster text-ink font-sans">
        <VisitedProvider
          total={locuri.length}
          userId={user?.id ?? null}
          initialVisited={initialVisited}
          locuri={locuri}
        >
          <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line px-7 py-4">
            <div className="flex items-center gap-4 justify-self-start">
              <Link href="/" className="plaque text-[15px]">
                BucQuest
              </Link>
              <span className="hidden text-xs text-ink-soft sm:inline">
                Discover Bucharest
              </span>
            </div>
            <NavLinks />
            <div className="flex items-center gap-4 justify-self-end">
              <ProgressBar />
              <AuthStatus loggedIn={Boolean(user)} />
            </div>
          </header>
          <MainArea>{children}</MainArea>
          <Footer />
        </VisitedProvider>
      </body>
    </html>
  );
}
