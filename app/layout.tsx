import clsx from 'clsx';
import type { Metadata } from 'next';
import {
  Inter,
  JetBrains_Mono,
  M_PLUS_2,
} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const mplus2 = M_PLUS_2({
  subsets: ['latin'],
  variable: '--font-mplus2',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'タカラーンブログ',
  description: 'タカラーン(takara2314)のブログです',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={clsx(
        inter.variable,
        mplus2.variable,
        jetbrainsMono.variable,
      )}
      lang="ja"
    >
      <head>
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
