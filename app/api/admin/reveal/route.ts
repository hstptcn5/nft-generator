import { NextRequest, NextResponse } from 'next/server';
import { writeContract } from 'viem';
import { base } from 'viem/chains';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { IDENTITY_NFT_ABI } from '@/lib/constants';
import { generateNFTImage } from '@/lib/services/imageGeneration';
import { buildMetadataForPhase } from '@/lib/types/nftMetadata';
import { getNFTData, updateNFTData } from '@/lib/services/nftDatabase';

const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS;

export async function POST(request: NextRequest) {
  try {
    if (!ADMIN_PRIVATE_KEY || !ADMIN_ADDRESS) {
      return NextResponse.json(
        { error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tokenId, phase } = body;

    if (!tokenId || !phase) {
      return NextResponse.json(
        { error: 'tokenId and phase required' },
        { status: 400 }
      );
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
    });

    const nftData = await getNFTData(tokenId);
    if (!nftData) {
      return NextResponse.json(
        { error: 'NFT data not found' },
        { status: 404 }
      );
    }

    const imageUrl = await generateNFTImage({
      tokenId,
      phase,
      traits: nftData.traits,
      farcasterAvatar: nftData.profile.avatarUrl,
      previousImageUrl:
        phase > 2 ? nftData.imageUrl || nftData.metadata?.image : undefined,
    });

    const metadata = buildMetadataForPhase(tokenId, phase, nftData.traits, imageUrl);
    const metadataUrl = await uploadMetadata(metadata);

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: IDENTITY_NFT_ABI,
      functionName: 'revealNFT',
      args: [BigInt(tokenId), BigInt(phase)],
    });

    await walletClient.writeContract({
      address: contractAddress,
      abi: IDENTITY_NFT_ABI,
      functionName: 'setTokenURI',
      args: [BigInt(tokenId), metadataUrl],
    });

    await updateNFTData(tokenId, {
      revealPhase: phase,
      metadata,
      imageUrl,
      metadataUrl,
    });

    return NextResponse.json({
      success: true,
      tokenId,
      phase,
      transactionHash: hash,
      imageUrl,
      metadataUrl,
    });
  } catch (error: any) {
    console.error('Admin reveal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Reveal failed',
      },
      { status: 500 }
    );
  }
}

async function uploadMetadata(metadata: any): Promise<string> {
  try {
    const response = await fetch('/api/ipfs/upload-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });

    const data = await response.json();
    return data.ipfsUrl;
  } catch (error) {
    console.error('Metadata upload failed:', error);
    throw error;
  }
}

