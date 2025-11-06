'use client';

import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { IDENTITY_NFT_ABI } from '@/lib/constants';
import { useAccount } from 'wagmi';

interface NFTDisplayProps {
  address: `0x${string}` | undefined;
}

export default function NFTDisplay({ address }: NFTDisplayProps) {
  const { address: connectedAddress } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const displayAddress = address || connectedAddress;

  const { data: hasMinted } = useReadContract({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    functionName: 'hasMinted',
    args: displayAddress ? [displayAddress] : undefined,
    chainId: base.id,
    query: {
      enabled: !!displayAddress,
    },
  });

  if (!displayAddress || !hasMinted) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your NFT</h2>
        <p className="text-gray-400">No NFT minted yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Connect your wallet and mint to see your unique identity NFT here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your NFT</h2>
      <div className="bg-gray-900 rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-2">
          Address: {`${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`}
        </p>
        <div className="mt-4 bg-gray-950 rounded p-4 aspect-square flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-2">NFT Image</p>
            <p className="text-xs text-gray-600">
              Will be generated after reveal phase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

