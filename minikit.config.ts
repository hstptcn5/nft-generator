const ROOT_URL = process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app';

export const minikitConfig = {
  accountAssociation: {
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1',
    name: 'FOMO NFT Generator',
    subtitle: 'AI Identity NFT Collection',
    description: 'Mint your unique AI-powered identity NFT from your Farcaster profile. Limited to 10,000 NFTs.',
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: '#000000',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'art-creativity',
    tags: ['nft', 'art', 'ai', 'identity', 'farcaster'],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: 'Unique AI Identity NFTs',
    ogTitle: 'FOMO NFT Generator - AI Identity Collection',
    ogDescription: 'Mint your unique AI-powered identity NFT on Base',
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;

