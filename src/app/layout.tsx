import type { Metadata } from "next";
import "./globals.css";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://wedding-invitation-zakia-wildan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Wedding Invitation Zakia & Wildan",
  description: "Undangan Pernikahan Zakia & Wildan — 1 Agustus 2026",

  openGraph: {
    title: "Wedding Invitation Zakia & Wildan",
    description: "Undangan Pernikahan Zakia & Wildan — 1 Agustus 2026",
    url: baseUrl,
    siteName: "Wedding Invitation",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zakia & Wildan Wedding Invitation",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Zakia & Wildan",
    description: "Undangan Pernikahan Zakia & Wildan — 1 Agustus 2026",
    images: ["/images/og-image.png"],
  },

  other: {
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}