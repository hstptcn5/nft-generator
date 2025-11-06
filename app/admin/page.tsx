'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">NFT Generation Test Panel</h1>
        <p className="text-gray-400 mb-8">
          Test image generation, preview prompts, and manually reveal NFTs for testing.
        </p>
        <AdminPanel />
      </div>
    </main>
  );
}

