import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteDescription =
  "Find useful local services, materials, rentals, places, and community resources across Maryland, starting in Harford County.";

export const metadata: Metadata = {
  metadataBase: new URL("https://marylandlocalguide.com"),
  title: {
    default: "Maryland Local Guide",
    template: "%s | Maryland Local Guide",
  },
  applicationName: "Maryland Local Guide",
  description: siteDescription,
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Maryland Local Guide",
    title: "Maryland Local Guide",
    description: siteDescription,
    url: "/",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#061b2c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
