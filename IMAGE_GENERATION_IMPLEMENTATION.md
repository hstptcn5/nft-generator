# Image Generation Implementation Guide

## 1. Nền tảng AI Generation

### Recommended Platforms

#### Option 1: Replicate.com (Recommended)
- **API**: RESTful, easy integration
- **Models**: Stable Diffusion, Flux, etc.
- **Pricing**: Pay per generation
- **Speed**: Fast (usually < 30s)
- **Setup**: Simple API key

#### Option 2: Stability AI (Stable Diffusion API)
- **API**: RESTful
- **Models**: Stable Diffusion XL, SD 3.0
- **Pricing**: Subscription or pay-per-use
- **Speed**: Medium (30-60s)
- **Quality**: High quality outputs

#### Option 3: OpenAI DALL-E 3
- **API**: RESTful
- **Models**: DALL-E 3
- **Pricing**: Per image
- **Speed**: Fast
- **Quality**: Very high, but limited customization

### Recommendation: **Replicate.com**

**Why Replicate:**
- Easy to use
- Multiple model options
- Good documentation
- Cost-effective for NFT projects
- Supports image-to-image generation

---

## 2. Generate dựa trên gì?

### Input Data Sources

#### Primary: Farcaster Profile Data
```typescript
interface FarcasterProfile {
  farcasterId: string;           // FID
  username: string;              // @username
  displayName: string;           // Display name
  avatarUrl: string;            // Profile picture URL
  bio: string;                  // Bio text
  followerCount: number;         // Social tier indicator
  followingCount: number;
  casts: number;                // Activity level
  registeredAt: Date;           // Vintage indicator
  verifications: string[];       // Verified accounts
}
```

#### Secondary: Onchain Data
```typescript
interface OnchainData {
  tokenId: number;              // Uniqueness seed
  ownerAddress: string;         // Wallet address
  mintTimestamp: number;        // Mint time
  revealPhase: number;          // Current phase
}
```

#### Generated Traits (Deterministic)
```typescript
interface NFTTraits {
  // Core traits (determined at mint)
  socialTier: 'legend' | 'veteran' | 'builder' | 'newcomer';
  activityLevel: 'hyperactive' | 'active' | 'moderate' | 'quiet';
  vintage: 'og' | 'early' | 'recent' | 'new';
  
  // Visual traits (from profile analysis)
  baseAvatar: string;          // Farcaster avatar URL
  backgroundType: string;       // From bio analysis
  colorScheme: string[];        // From avatar colors
  accessories: string[];         // From username/style
  specialEffects: string[];     // From registration date
  rarityScore: number;          // 0-100
}
```

---

## 3. Implementation Structure

### Backend API Endpoints

```typescript
// app/api/nft/generate/route.ts
// Generate NFT image for specific phase

// app/api/nft/metadata/route.ts
// Get NFT metadata with traits

// app/api/webhook/route.ts
// Handle mint events from contract
```

### Image Generation Service

```typescript
// lib/services/imageGeneration.ts
// Replicate API integration

// lib/services/traitGeneration.ts
// Generate traits from profile data

// lib/services/farcasterAPI.ts
// Fetch Farcaster profile data
```

---

## 4. Traits Display per Phase

### Metadata Structure

```typescript
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: TraitAttribute[];
  revealPhase: number;
  revealedTraits: string[];
}

interface TraitAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'string' | 'number' | 'date' | 'boost_percentage';
}
```

### Phase-by-Phase Trait Reveal

**Phase 1 (Blind Box):**
- No traits revealed
- Placeholder image

**Phase 2 (Base Reveal):**
- `baseAvatar` trait
- `socialTier` trait

**Phase 3 (Background):**
- `backgroundType` trait
- `colorScheme` trait

**Phase 4-6 (Accessories & Effects):**
- `accessories` traits
- `activityLevel` trait

**Phase 7 (Final):**
- All traits revealed
- `rarityScore` trait
- `specialEffects` traits

