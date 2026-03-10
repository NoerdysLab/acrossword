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
    url: "https://ACROSSword.org",
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
      <body className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1" style={{ maxWidth: "42rem", marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>{children}</main>
        <footer className="text-center pb-4 pt-2" style={{ color: "var(--text-secondary)", fontSize: "0.7rem", opacity: 0.5 }}>
          v1.3.0
        </footer>
      </body>
    </html>
  );
}
