// Layout racine de l'application Vigie Web

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

export const metadata: Metadata = {
  title: {
    default: "Vigie Web - La sentinelle de vos sites internet",
    template: "%s | Vigie Web",
  },
  description:
    "Surveillez vos sites web en temps reel. Alertes uptime, SSL, domaine. Pour freelances et agences web.",
  keywords: [
    "monitoring",
    "surveillance",
    "site web",
    "uptime",
    "SSL",
    "domaine",
    "freelance",
    "agence web",
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Vigie Web - La sentinelle de vos sites internet",
    description:
      "Surveillez la disponibilite, le SSL et les domaines de vos sites web. Alertes instantanees pour freelances et agences.",
    url: BASE_URL,
    siteName: "Vigie Web",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vigie Web - Monitoring de sites web",
    description:
      "Surveillez vos sites web en temps reel. Alertes uptime, SSL, domaine.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
