import { NextRequest, NextResponse } from 'next/server';
import { testImageGeneration, testProfiles } from '@/lib/test/imageGenerationTest';
import { generateTraits } from '@/lib/services/traitGeneration';
import { buildMetadataForPhase } from '@/lib/types/nftMetadata';

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
    const prompt = buildPromptForPhase(phase, traits, profile.avatarUrl);

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

function buildPromptForPhase(phase: number, traits: any, avatarUrl?: string): string {
  const basePrompt = `A unique identity NFT avatar, professional digital art style, high quality, detailed`;

  const phasePrompts: Record<number, (traits: any) => string> = {
    1: () => `Blind box placeholder`,
    2: (traits) =>
      `${basePrompt}, based on profile picture, ${traits.socialTier} tier, transform the avatar into a stylized NFT character`,
    3: (traits) =>
      `${basePrompt}, ${traits.backgroundType} background, ${traits.colorScheme.join(' and ')} color scheme, ${traits.socialTier} tier`,
    4: (traits) =>
      `${basePrompt}, ${traits.backgroundType} background, with ${traits.accessories.slice(0, 1).join(', ')} accessories, ${traits.colorScheme.join(' and ')} colors`,
    5: (traits) =>
      `${basePrompt}, ${traits.activityLevel} activity level, ${traits.backgroundType} background, ${traits.accessories.slice(0, 2).join(', ')} accessories, enhanced details`,
    6: (traits) =>
      `${basePrompt}, special effects: ${traits.specialEffects.slice(0, 2).join(', ')}, ${traits.accessories.slice(0, 3).join(', ')} accessories, ${traits.backgroundType} background`,
    7: (traits) =>
      `${basePrompt}, final form with all traits: ${traits.accessories.join(', ')}, ${traits.specialEffects.join(', ')}, ${traits.socialTier} tier, ${traits.activityLevel} activity, ${traits.backgroundType} background, ${traits.colorScheme.join(' and ')} color scheme, rarity score ${traits.rarityScore}`,
  };

  return phasePrompts[phase]?.(traits) || basePrompt;
}

