'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { BLIND_BOX_IMAGE_URL, IDENTITY_NFT_ABI } from '@/lib/constants';
import { useAccount } from 'wagmi';

interface NFTDisplayProps {
  address: `0x${string}` | undefined;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  revealPhase: number;
}

export default function NFTDisplay({ address }: NFTDisplayProps) {
  const { address: connectedAddress } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const displayAddress = address || connectedAddress;

  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenId, setTokenId] = useState<number | null>(null);

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

  const { data: revealPhase } = useReadContract({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    functionName: 'getRevealPhase',
    args: tokenId !== null ? [BigInt(tokenId)] : undefined,
    chainId: base.id,
    query: {
      enabled: tokenId !== null,
    },
  });

  useEffect(() => {
    if (!displayAddress || !hasMinted) {
      setLoading(false);
      return;
    }

    fetchNFTMetadata();
  }, [displayAddress, hasMinted]);

  async function fetchNFTMetadata() {
    if (!displayAddress) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/nft/metadata?address=${displayAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const data = await response.json();
      setMetadata(data);
      setTokenId(data.tokenId);
    } catch (error) {
      console.error('Failed to fetch NFT metadata:', error);
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your NFT</h2>
        <div className="animate-pulse">
          <div className="bg-gray-700 rounded-lg h-64 mb-4" />
          <div className="bg-gray-700 rounded h-4 w-3/4 mb-2" />
          <div className="bg-gray-700 rounded h-4 w-1/2" />
        </div>
      </div>
    );
  }

  const currentPhase = revealPhase ? Number(revealPhase) : metadata?.revealPhase || 1;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your NFT</h2>
      
      {metadata && (
        <>
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="mb-2">
              <p className="text-sm text-gray-400">Name</p>
              <p className="text-lg font-semibold">{metadata.name}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Phase: {currentPhase}/7</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(currentPhase / 7) * 100}%` }}
                />
              </div>
            </div>

            {metadata.image && (
              <div className="mb-4">
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full rounded-lg aspect-square object-cover"
                  onError={(e) => {
                    e.currentTarget.src = BLIND_BOX_IMAGE_URL;
                  }}
                />
              </div>
            )}

            {metadata.description && (
              <p className="text-sm text-gray-300 mb-4">{metadata.description}</p>
            )}

            {metadata.attributes && metadata.attributes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Revealed Traits</h3>
                <div className="grid grid-cols-2 gap-2">
                  {metadata.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded p-2 border border-gray-700"
                    >
                      <p className="text-xs text-gray-400">{attr.trait_type}</p>
                      <p className="text-sm font-medium">
                        {typeof attr.value === 'number'
                          ? attr.value
                          : attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPhase < 7 && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-sm text-blue-200">
                  Next reveal in phase {currentPhase + 1}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {!metadata && (
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400">Loading NFT data...</p>
        </div>
      )}
    </div>
  );
}
