import { NextRequest, NextResponse } from 'next/server';
import { generateNFTImage, uploadToIPFS } from '@/lib/services/imageGeneration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId, phase, traits, farcasterAvatar } = body;

    if (!tokenId || !phase || !traits) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const imageUrl = await generateNFTImage({
      tokenId,
      phase,
      traits,
      farcasterAvatar,
    });

    const ipfsUrl = await uploadToIPFS(imageUrl);

    return NextResponse.json({
      imageUrl: ipfsUrl,
      originalUrl: imageUrl,
      tokenId,
      phase,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

