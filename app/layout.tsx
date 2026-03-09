import type { Metadata } from "next";
import Header from "@/components/Header";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ACROSSword — a daily hidden word puzzle",
  description:
    "A new clue every day. Find the word hidden across the clue text. A free daily word puzzle game.",
  openGraph: {
    title: "ACROSSword — a daily hidden word puzzle",
    description:
      "A new clue every day. Find the word hidden across the clue text.",
    type: "website",
    url: "https://acrossword.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Libre+Franklin:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh">
        <Header />
        <main className="w-full max-w-2xl mx-auto px-5 sm:px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
