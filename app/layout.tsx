import type { Metadata } from 'next';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
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
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
          miniKit={{ enabled: true }}
        >
          {children}
        </OnchainKitProvider>
      </body>
    </html>
  );
}

