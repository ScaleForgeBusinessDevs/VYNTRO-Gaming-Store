import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: {
    default: 'VYNTRO — Premium Custom Gaming Deskmats',
    template: '%s | VYNTRO',
  },
  description:
    'Premium custom-printed XXL gaming deskmats, RGB deskmats, and desk-setup bundles. Made to order. Cash on Delivery. Karachi-wide delivery.',
  keywords: ['gaming deskmat', 'custom mousepad', 'XXL deskmat', 'RGB deskmat', 'Pakistan'],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'VYNTRO',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
