import type { Metadata } from 'next';
import { Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans_JP({ variable: '--font-noto', subsets: ['latin'], weight: ['400','500','600','700','800'] });
const space = Space_Grotesk({ variable: '--font-space', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://js-chronicle-learning.mp9khsndft.chatgpt.site'),
  title: 'JS Chronicle — 歴史から学ぶJavaScript',
  description: '1995年の誕生からECMAScript 2026まで、コード・年表・問題でJavaScriptを体系的に学ぶ教材プラットフォーム。',
  openGraph: {
    title: 'JS Chronicle — 歴史から学ぶJavaScript',
    description: '1995年の誕生からECMAScript 2026まで、コード・年表・問題で体系的に学ぶ。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'JS Chronicle — 歴史から学ぶJavaScript' }],
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JS Chronicle — 歴史から学ぶJavaScript',
    description: '歴史・コード・問題で、JavaScriptの「なぜ」を学ぶ。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={`${noto.variable} ${space.variable}`}>{children}</body></html>;
}
