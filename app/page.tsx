'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import MintPage from '@/components/MintPage';

export default function Home() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <MintPage />
    </main>
  );
}

