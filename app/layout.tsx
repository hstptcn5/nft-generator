import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FOMO NFT Generator',
  description: 'AI-Powered Identity NFT Collection on Base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

