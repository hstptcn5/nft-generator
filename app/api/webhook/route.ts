import { NextRequest, NextResponse } from 'next/server';
import { generateTraits } from '@/lib/services/traitGeneration';
import { fetchFarcasterProfileByAddress } from '@/lib/services/farcasterAPI';
import { generateNFTImage } from '@/lib/services/imageGeneration';
import { buildMetadataForPhase } from '@/lib/types/nftMetadata';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { tokenId, ownerAddress, event } = body;

    if (event === 'NFTMinted' && tokenId && ownerAddress) {
      await handleMintEvent(tokenId, ownerAddress);
    }

    if (event === 'NFTRevealed' && tokenId) {
      await handleRevealEvent(tokenId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleMintEvent(tokenId: number, ownerAddress: string) {
  try {
    const profile = await fetchFarcasterProfileByAddress(ownerAddress);

    if (!profile) {
      console.error('Failed to fetch Farcaster profile');
      return;
    }

    const traits = generateTraits(tokenId, ownerAddress, profile);

    const phase1Image = await generateNFTImage({
      tokenId,
      phase: 1,
      traits,
      farcasterAvatar: profile.avatarUrl,
    });

    const metadata = buildMetadataForPhase(tokenId, 1, traits, phase1Image);

    await storeNFTData(tokenId, {
      ownerAddress,
      profile,
      traits,
      metadata,
      revealPhase: 1,
      mintedAt: new Date(),
    });

    console.log(`NFT #${tokenId} minted and processed`);
  } catch (error) {
    console.error('Mint event handling failed:', error);
  }
}

async function handleRevealEvent(tokenId: number) {
  try {
    const nftData = await getNFTData(tokenId);

    if (!nftData) {
      console.error(`NFT #${tokenId} data not found`);
      return;
    }

    const newPhase = nftData.revealPhase + 1;

    const imageUrl = await generateNFTImage({
      tokenId,
      phase: newPhase,
      traits: nftData.traits,
      farcasterAvatar: nftData.profile.avatarUrl,
    });

    const metadata = buildMetadataForPhase(
      tokenId,
      newPhase,
      nftData.traits,
      imageUrl
    );

    await updateNFTData(tokenId, {
      revealPhase: newPhase,
      metadata,
      imageUrl,
    });

    console.log(`NFT #${tokenId} revealed to phase ${newPhase}`);
  } catch (error) {
    console.error('Reveal event handling failed:', error);
  }
}

async function storeNFTData(tokenId: number, data: any) {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.warn('DATABASE_URL not set, skipping database storage');
    return;
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nft/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId, ...data }),
    });
  } catch (error) {
    console.error('Failed to store NFT data:', error);
  }
}

async function getNFTData(tokenId: number): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/nft/${tokenId}`
    );
    return await response.json();
  } catch (error) {
    console.error('Failed to get NFT data:', error);
    return null;
  }
}

async function updateNFTData(tokenId: number, data: any) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nft/${tokenId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to update NFT data:', error);
  }
}

