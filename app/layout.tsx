import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maryland Local Guide",
  description: "Find useful local services, places, and resources across Maryland.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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
