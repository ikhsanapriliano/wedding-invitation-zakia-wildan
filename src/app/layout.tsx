import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://datangya.invit.id';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Wedding Invitation Zakia & Wildan',
  description: 'Undangan Pernikahan Zakia & Wildan — 1 Agustus 2026',
  openGraph: {
    title: 'Wedding Invitation Zakia & Wildan',
    description: 'Undangan Pernikahan Zakia & Wildan — 1 Agustus 2026',
    type: 'website',
    images: [
      {
        url: '/images/depan.jpg',
        width: 1200,
        height: 630,
        alt: 'Zakia & Wildan Wedding Invitation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Invitation Zakia & Wildan',
    description: 'Undangan Pernikahan Zakia & Wildan — 1 Agustus 2026',
    images: ['/images/depan.jpg'],
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