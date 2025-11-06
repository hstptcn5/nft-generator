import { NextRequest, NextResponse } from 'next/server';
import { testImageGeneration, testProfiles } from '@/lib/test/imageGenerationTest';
import { generateTraits } from '@/lib/services/traitGeneration';
import { buildMetadataForPhase } from '@/lib/types/nftMetadata';
import { buildPrompt } from '@/lib/services/imageGeneration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tokenId = 1,
      ownerAddress = '0x1234567890123456789012345678901234567890',
      profileIndex = 0,
      phase = 2,
      customProfile,
    } = body;

    const profile = customProfile || testProfiles[profileIndex];
    const testAddress = ownerAddress as `0x${string}`;

    const result = await testImageGeneration(tokenId, testAddress, profile, phase);

    return NextResponse.json({
      success: true,
      tokenId,
      phase,
      traits: result.traits,
      prompt: result.prompt,
      imageUrl: result.imageUrl,
      metadata: result.metadata,
    });
  } catch (error: any) {
    console.error('Test generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Test generation failed',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenId = parseInt(searchParams.get('tokenId') || '1', 10);
  const phase = parseInt(searchParams.get('phase') || '2', 10);
  const profileIndex = parseInt(searchParams.get('profileIndex') || '0', 10);

  try {
    const profile = testProfiles[profileIndex];
    const testAddress = '0x1234567890123456789012345678901234567890' as `0x${string}`;

    const traits = generateTraits(tokenId, testAddress, profile);
    const prompt = buildPrompt(phase, traits, profile.avatarUrl);

    return NextResponse.json({
      success: true,
      tokenId,
      phase,
      profile: {
        username: profile.username,
        followerCount: profile.followerCount,
        casts: profile.casts,
      },
      traits,
      prompt,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


