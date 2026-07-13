import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-plaster text-ink font-sans">
        <header className="flex items-center gap-4 border-b border-line px-7 py-5">
          <span className="plaque text-[15px]">Explorator București</span>
          <span className="text-xs text-ink-soft">
            ghid de arhitectură urbană
          </span>
        </header>
        <main className="mx-auto w-full max-w-[1080px] flex-1 px-7">
          {children}
        </main>
      </body>
    </html>
  );
}
