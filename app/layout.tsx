import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ACROSSword — a daily hidden word puzzle",
  description:
    "A new clue every day. Find the word hidden across the clue text. A free daily word puzzle game.",
  openGraph: {
    title: "ACROSSword — a daily hidden word puzzle",
    description: "A new clue every day. Find the word hidden across the clue text.",
    type: "website",
    url: "https://ACROSSword.org",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#121416" },
  ],
};

// Runs before paint so a dark-mode visitor never sees a light flash.
const themeScript = `(function(){try{var t=localStorage.getItem("acrossword-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href="/fonts/libre-franklin-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-serif-display-latin-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-dvh flex flex-col">
        <Header />
        <main
          className="flex-1 w-full"
          style={{ maxWidth: "calc(var(--measure) + 2rem)", margin: "0 auto", padding: "2rem 1rem 3rem" }}
        >
          {children}
        </main>
        <footer className="tabular text-center" style={{ padding: "0 1rem 1.25rem", fontSize: "0.75rem", color: "var(--ink-3)" }}>
          v1.5.0
        </footer>
      </body>
    </html>
  );
}
