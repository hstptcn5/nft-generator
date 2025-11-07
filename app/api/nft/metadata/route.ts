import { NextRequest, NextResponse } from 'next/server';
import { readContract } from 'viem';
import { base } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { IDENTITY_NFT_ABI } from '@/lib/constants';
import { buildMetadataForPhase } from '@/lib/types/nftMetadata';
import { getBlindBoxImage } from '@/lib/services/imageGeneration';
import { generateTraits } from '@/lib/services/traitGeneration';

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get('tokenId');
    const phase = searchParams.get('phase');

    if (!tokenId) {
      return NextResponse.json({ error: 'tokenId required' }, { status: 400 });
    }

    const tokenIdNum = parseInt(tokenId, 10);
    const revealPhase = phase ? parseInt(phase, 10) : await getRevealPhase(tokenIdNum);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    const tokenURI = await publicClient.readContract({
      address: contractAddress,
      abi: IDENTITY_NFT_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenIdNum)],
    });

    if (tokenURI && tokenURI !== '') {
      const metadataResponse = await fetch(tokenURI as string);
      const metadata = await metadataResponse.json();
      return NextResponse.json(metadata);
    }

    const owner = await publicClient.readContract({
      address: contractAddress,
      abi: IDENTITY_NFT_ABI,
      functionName: 'ownerOf',
      args: [BigInt(tokenIdNum)],
    });

    const farcasterProfile = await fetchFarcasterProfile(owner as string);
    const traits = generateTraits(tokenIdNum, owner as string, farcasterProfile);

    const imageUrl = await generateImageForPhase(tokenIdNum, revealPhase, traits, farcasterProfile.avatarUrl);
    const metadata = buildMetadataForPhase(tokenIdNum, revealPhase, traits, imageUrl);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Metadata generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    );
  }
}

async function getRevealPhase(tokenId: number): Promise<number> {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  try {
    const phase = await publicClient.readContract({
      address: contractAddress,
      abi: IDENTITY_NFT_ABI,
      functionName: 'getRevealPhase',
      args: [BigInt(tokenId)],
    });

    return Number(phase);
  } catch {
    return 1;
  }
}

async function fetchFarcasterProfile(address: string): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/farcaster/profile?address=${address}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch Farcaster profile:', error);
    return {
      farcasterId: '0',
      username: 'unknown',
      displayName: 'Unknown',
      avatarUrl: '',
      bio: '',
      followerCount: 0,
      followingCount: 0,
      casts: 0,
      registeredAt: new Date(),
      verifications: [],
    };
  }
}

async function generateImageForPhase(
  tokenId: number,
  phase: number,
  traits: any,
  avatarUrl: string
): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nft/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenId,
        phase,
        traits,
        farcasterAvatar: avatarUrl,
      }),
    });

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Image generation failed:', error);
    return getBlindBoxImage();
  }
}

