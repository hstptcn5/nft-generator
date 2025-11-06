'use client';

import { useState, useEffect } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { IDENTITY_NFT_ABI } from '@/lib/constants';

interface RecentMint {
  address: string;
  tokenId: bigint;
  timestamp: bigint;
}

interface RecentMintsProps {
  contractAddress: `0x${string}`;
}

export default function RecentMints({ contractAddress }: RecentMintsProps) {
  const [recentMints, setRecentMints] = useState<RecentMint[]>([]);

  useWatchContractEvent({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    eventName: 'NFTMinted',
    onLogs(logs) {
      const newMints: RecentMint[] = logs.map((log) => ({
        address: log.args.to as string,
        tokenId: log.args.tokenId as bigint,
        timestamp: log.args.timestamp as bigint,
      }));
      setRecentMints((prev) => [...newMints, ...prev].slice(0, 10));
    },
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Mints</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentMints.length === 0 ? (
          <p className="text-gray-400">No recent mints</p>
        ) : (
          recentMints.map((mint, index) => (
            <div
              key={`${mint.address}-${mint.tokenId}-${index}`}
              className="bg-gray-900 rounded p-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {`${mint.address.slice(0, 6)}...${mint.address.slice(-4)}`}
                </p>
                <p className="text-xs text-gray-400">Token #{mint.tokenId.toString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

