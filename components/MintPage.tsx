'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { base } from 'wagmi/chains';
import { Transaction } from '@coinbase/onchainkit/transaction';
import { IDENTITY_NFT_ABI, MAX_SUPPLY } from '@/lib/constants';
import { mintCall } from '@/lib/calls';
import NFTDisplay from './NFTDisplay';
import RecentMints from './RecentMints';

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const [mintedCount, setMintedCount] = useState<bigint>(0n);
  const [hasMinted, setHasMinted] = useState(false);
  const [isMintActive, setIsMintActive] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const { data: mintedCountData } = useReadContract({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    functionName: 'mintedCount',
    chainId: base.id,
  });

  const { data: hasMintedData } = useReadContract({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const { data: isMintActiveData } = useReadContract({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    functionName: 'isMintActive',
    chainId: base.id,
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: IDENTITY_NFT_ABI,
    eventName: 'NFTMinted',
    onLogs(logs) {
      if (logs.length > 0) {
        setMintedCount((prev) => prev + 1n);
        if (logs[0].args.to?.toLowerCase() === address?.toLowerCase()) {
          setHasMinted(true);
        }
      }
    },
  });

  useEffect(() => {
    if (mintedCountData !== undefined) {
      setMintedCount(mintedCountData as bigint);
    }
  }, [mintedCountData]);

  useEffect(() => {
    if (hasMintedData !== undefined) {
      setHasMinted(hasMintedData as boolean);
    }
  }, [hasMintedData]);

  useEffect(() => {
    if (isMintActiveData !== undefined) {
      setIsMintActive(isMintActiveData as boolean);
    }
  }, [isMintActiveData]);

  const remaining = MAX_SUPPLY - Number(mintedCount);
  const progress = MAX_SUPPLY > 0 ? (Number(mintedCount) / MAX_SUPPLY) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">FOMO NFT Generator</h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-Powered Identity NFT Collection - Limited to 10,000 NFTs
          </p>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-semibold">
                {Number(mintedCount).toLocaleString()} / {MAX_SUPPLY.toLocaleString()}
              </span>
              <span className="text-gray-400">{remaining.toLocaleString()} remaining</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!isConnected ? (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-200">Please connect your wallet to mint</p>
            </div>
          ) : hasMinted ? (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-200">You have already minted your NFT!</p>
            </div>
          ) : !isMintActive ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-200">Mint period has ended or supply is exhausted</p>
            </div>
          ) : (
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <Transaction calls={[mintCall]} sponsorGas={true} />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <NFTDisplay address={address} />
          <RecentMints contractAddress={contractAddress} />
        </div>
      </div>
    </div>
  );
}

