import type { Metadata } from 'next';
import { Inter, Chakra_Petch, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { BUSINESS } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const chakra = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newnikhilelectrical.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'New Nikhil Electrical | Motor Binding, Fan Repair & Electrical Wholesale in Lalganj, Rae Bareli',
    template: '%s | New Nikhil Electrical',
  },
  description:
    'New Nikhil Electrical, Tikona Park, Lalganj, Rae Bareli — trusted electrical shop for motor binding, motor rewinding, fan repair, house wiring, electrical wholesale (wires, MCB, switches, LED lights) and scrap copper purchase. Call +91 8887688890.',
  keywords: [
    'Electrical shop in Lalganj Rae Bareli',
    'Motor binding Lalganj',
    'Fan repair Rae Bareli',
    'Electrical wholesale Rae Bareli',
    'Motor rewinding Rae Bareli',
    'House wiring Lalganj',
    'Electrician near Tikona Park',
    'MCB switches LED wholesale Rae Bareli',
  ],
  authors: [{ name: 'New Nikhil Electrical' }],
  openGraph: {
    title: 'New Nikhil Electrical | Lalganj, Rae Bareli',
    description:
      'Motor binding, fan repair, house wiring & electrical wholesale supplier in Lalganj, Rae Bareli, UP.',
    url: siteUrl,
    siteName: 'New Nikhil Electrical',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Nikhil Electrical | Lalganj, Rae Bareli',
    description: 'Motor binding, fan repair, house wiring & electrical wholesale supplier.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ElectricianAndElectricalStore',
    name: BUSINESS.name,
    image: `${siteUrl}/images/hero/storefront.jpg`,
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tikona Park, Lalganj',
      addressLocality: 'Rae Bareli',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: ['Lalganj', 'Rae Bareli', 'Uttar Pradesh'],
    priceRange: '₹₹',
    url: siteUrl,
    sameAs: [],
  };

  return (
    <html lang="en" className={`${inter.variable} ${chakra.variable} ${plexMono.variable}`}>
      <body className="font-body bg-base-900 text-ink-100 antialiased selection:bg-volt-500">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <WhatsAppButton />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#12181F',
              color: '#EDF1F7',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          }}
        />
      </body>
    </html>
  );
}
