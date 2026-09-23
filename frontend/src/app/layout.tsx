import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zyra — Fine Jewellery for Women',
    template: '%s · Zyra',
  },
  description:
    'Handcrafted rings, necklaces, bracelets and earrings in recycled gold and ethically sourced stones. Cash on delivery available.',
  keywords: ['jewellery', 'rings', 'necklaces', 'bracelets', 'earrings', 'gold', 'women'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
