# Progressive Reveal Logic - NFT Traits Generation

## Câu hỏi: Traits được quyết định từ đầu hay generate dần?

Có **2 approaches** chính, mỗi cách có ưu/nhược điểm khác nhau:

---

## Approach 1: PRE-DETERMINED (Deterministic) ✅ Recommended

### Concept
**Traits được quyết định NGAY TỪ KHI MINT** (Phase 1), nhưng chỉ được **reveal dần** theo thời gian.

### Cách hoạt động

```
Khi User mints NFT (Phase 1):
  ↓
1. Generate seed từ: tokenId + userAddress + blockHash
2. Deterministic algorithm: seed → tất cả traits
3. Store traits trong off-chain database/backend
4. Set tokenURI = placeholder (Blind Box image)
  
Phase 2-7:
  ↓
Chỉ REVEAL traits đã có sẵn
  - Phase 2: Reveal base layer
  - Phase 3-6: Reveal từng layer
  - Phase 7: Reveal final form với tất cả traits
```

### Implementation

```typescript
// Backend: Generate traits ngay khi mint
interface NFTTraits {
  tokenId: number;
  ownerAddress: string;
  farcasterProfile: ProfileData;
  
  // Pre-determined traits
  baseLayer: string;          // From Farcaster avatar
  socialTier: string;         // Based on follower count
  activityLevel: string;      // Based on casts
  background: string;         // From bio analysis
  accessories: string[];       // From username
  specialEffects: string[];   // From registration date
  rarity: number;            // Calculated from all traits
}

// Generate function (deterministic)
function generateTraits(tokenId: number, ownerAddress: string, profile: ProfileData): NFTTraits {
  // Use deterministic seed
  const seed = keccak256(abi.encodePacked(tokenId, ownerAddress));
  
  // All traits determined from this seed + profile data
  return {
    baseLayer: determineBaseLayer(profile.avatarUrl, seed),
    socialTier: calculateSocialTier(profile.followerCount),
    background: selectBackground(profile.bio, seed),
    // ... all traits determined
    rarity: calculateRarity(allTraits)
  };
}

// Reveal function (just shows pre-determined data)
function revealPhase(tokenId: number, phase: number): NFTMetadata {
  const traits = getStoredTraits(tokenId); // Already generated
  
  switch(phase) {
    case 1: return { image: BLIND_BOX_IMAGE };
    case 2: return { image: generateImage(traits.baseLayer) };
    case 3: return { image: generateImage(traits.baseLayer + traits.background) };
    // ... progressive reveal of pre-determined traits
  }
}
```

### Ưu điểm
- ✅ **Deterministic**: Cùng input → cùng output (có thể verify)
- ✅ **Fair**: Không thể manipulate sau khi mint
- ✅ **Rarity locked**: Rarity được quyết định từ đầu
- ✅ **Fast reveal**: Chỉ cần show data đã có
- ✅ **Onchain verifiable**: Có thể store hash trên chain

### Nhược điểm
- ❌ Không thể adjust traits dựa trên activity sau mint
- ❌ Cần generate tất cả images từ đầu

---

## Approach 2: DYNAMIC GENERATION

### Concept
**Traits được generate DẦN trong quá trình reveal**, mỗi phase generate thêm layers mới.

### Cách hoạt động

```
Khi User mints NFT (Phase 1):
  ↓
1. Chỉ store: tokenId, ownerAddress, Farcaster profile
2. Set tokenURI = placeholder
3. Traits CHƯA được generate

Phase 2:
  ↓
1. Fetch Farcaster profile
2. Generate base layer (avatar-based)
3. Store base layer image

Phase 3-6:
  ↓
Mỗi phase:
  1. Analyze profile data
  2. Generate NEW layer (could be random or based on profile)
  3. Add to existing image
  4. Store updated image

Phase 7:
  ↓
1. Generate final layers
2. Calculate rarity from all traits
3. Finalize NFT
```

### Implementation

```typescript
// Backend: Generate traits on-demand
async function revealPhase(tokenId: number, phase: number): Promise<NFTMetadata> {
  const nft = await getNFT(tokenId);
  const profile = await fetchFarcasterProfile(nft.ownerAddress);
  
  switch(phase) {
    case 1:
      return { image: BLIND_BOX_IMAGE };
      
    case 2:
      // Generate base layer NOW
      const baseLayer = await generateFromAvatar(profile.avatarUrl);
      await storeNFTImage(tokenId, baseLayer, phase: 2);
      return { image: baseLayer };
      
    case 3:
      // Generate background layer NOW
      const existing = await getNFTImage(tokenId, phase: 2);
      const background = await generateBackground(profile.bio, tokenId);
      const combined = await combineLayers(existing, background);
      await storeNFTImage(tokenId, combined, phase: 3);
      return { image: combined };
      
    // ... each phase generates new content
  }
}
```

### Ưu điểm
- ✅ **Flexible**: Có thể adjust dựa trên activity sau mint
- ✅ **Progressive**: Generate khi cần
- ✅ **Adaptive**: Có thể incorporate new data

### Nhược điểm
- ❌ **Not deterministic**: Cùng input có thể khác output
- ❌ **Slower**: Phải generate mỗi phase
- ❌ **Rarity unstable**: Rarity chỉ finalize ở phase 7
- ❌ **Manipulation risk**: Có thể adjust based on external factors

---

## RECOMMENDED APPROACH: Hybrid (Best of Both)

### Concept
**Core traits pre-determined, Visual layers generate progressively**

### Implementation

```typescript
// Phase 1: Generate core traits (deterministic)
interface CoreTraits {
  tokenId: number;
  socialTier: string;        // Based on follower count
  activityLevel: string;      // Based on casts
  rarityScore: number;        // Calculated
  baseAvatar: string;         // Farcaster avatar
}

// Generate core traits immediately
function generateCoreTraits(tokenId: number, profile: ProfileData): CoreTraits {
  // Deterministic from tokenId + profile
  return {
    socialTier: calculateTier(profile.followerCount),
    activityLevel: calculateLevel(profile.casts),
    rarityScore: calculateRarity(profile),
    baseAvatar: profile.avatarUrl
  };
}

// Phase 2-7: Generate visual layers progressively
async function revealPhase(tokenId: number, phase: number): Promise<Metadata> {
  const coreTraits = await getCoreTraits(tokenId); // Pre-determined
  
  switch(phase) {
    case 1:
      return { image: BLIND_BOX, traits: {} };
      
    case 2:
      // Reveal base with core traits
      const baseImage = await generateBaseImage(coreTraits.baseAvatar);
      return { 
        image: baseImage, 
        traits: { socialTier: coreTraits.socialTier }
      };
      
    case 3:
      // Generate background based on pre-determined tier
      const bg = await generateBackground(coreTraits.socialTier);
      return { 
        image: combine(baseImage, bg),
        traits: { socialTier, activityLevel: coreTraits.activityLevel }
      };
      
    // ... progressive visual generation with pre-determined traits
  }
}
```

### Smart Contract Enhancement

```solidity
contract IdentityNFT is ERC721URIStorage, Ownable {
    // ... existing code ...
    
    // Store trait hash onchain (for verification)
    mapping(uint256 => bytes32) public traitHash;
    
    // Store reveal schedule
    mapping(uint256 => uint256) public revealSchedule;
    
    function mint() external {
        // ... existing mint logic ...
        
        // Set reveal schedule (deterministic)
        revealSchedule[tokenId] = block.timestamp;
        
        // Owner can set trait hash after generation
        // traitHash[tokenId] = keccak256(abi.encodePacked(traits));
    }
    
    function setTraitHash(uint256 tokenId, bytes32 hash) external onlyOwner {
        traitHash[tokenId] = hash;
    }
    
    function getRevealTimestamp(uint256 tokenId) external view returns (uint256) {
        return revealSchedule[tokenId];
    }
}
```

---

## Implementation Plan

### Backend API Structure

```typescript
// POST /api/nft/mint
// Triggered when NFT is minted
async function handleMint(tokenId: number, ownerAddress: string) {
  // 1. Fetch Farcaster profile
  const profile = await fetchFarcasterProfile(ownerAddress);
  
  // 2. Generate core traits (deterministic)
  const coreTraits = generateCoreTraits(tokenId, profile);
  
  // 3. Store in database
  await db.nft.create({
    tokenId,
    ownerAddress,
    coreTraits,
    revealPhase: 1,
    mintedAt: new Date()
  });
  
  // 4. Generate Phase 1 image (Blind Box)
  await generateAndStoreImage(tokenId, 1);
}

// GET /api/nft/:tokenId/metadata?phase=2
// Returns metadata for specific phase
async function getNFTMetadata(tokenId: number, phase: number) {
  const nft = await db.nft.findByTokenId(tokenId);
  
  // Check if phase is ready to reveal
  const timeSinceMint = Date.now() - nft.mintedAt;
  const daysSinceMint = timeSinceMint / (1000 * 60 * 60 * 24);
  
  if (phase === 1) return getBlindBoxMetadata();
  if (phase === 2 && daysSinceMint >= 1) return getPhase2Metadata(nft);
  if (phase === 3 && daysSinceMint >= 2) return getPhase3Metadata(nft);
  // ... etc
  
  throw new Error('Phase not ready yet');
}

// Scheduled job: Progressive reveal
async function processReveals() {
  const nfts = await db.nft.findPendingReveals();
  
  for (const nft of nfts) {
    const daysSinceMint = calculateDays(nft.mintedAt);
    
    if (daysSinceMint >= 2 && nft.revealPhase === 1) {
      await revealPhase2(nft);
    }
    if (daysSinceMint >= 3 && nft.revealPhase === 2) {
      await revealPhase3(nft);
    }
    // ... etc
  }
}
```

---

## Recommendation cho Project này

### Use **Hybrid Approach**:

1. **Phase 1 (Mint)**: 
   - Generate core traits ngay (deterministic)
   - Store hash onchain (optional, for verification)
   - Show Blind Box image

2. **Phase 2-7 (Reveal)**:
   - Generate visual layers progressively
   - Dựa trên core traits đã có
   - Reveal theo timeline

### Lý do:
- ✅ **Fair**: Core traits locked từ đầu
- ✅ **Engaging**: Progressive visual reveal
- ✅ **Verifiable**: Hash onchain cho transparency
- ✅ **Flexible**: Visual generation có thể optimize

---

## Code Example: Complete Flow

```typescript
// Backend service
class NFTRevealService {
  async handleMint(tokenId: number, ownerAddress: string) {
    // 1. Fetch profile
    const profile = await farcasterAPI.getProfile(ownerAddress);
    
    // 2. Generate core traits (deterministic)
    const seed = keccak256(abi.encodePacked(tokenId, ownerAddress));
    const coreTraits = {
      socialTier: this.calculateTier(profile.followerCount),
      activityLevel: this.calculateLevel(profile.casts),
      rarityScore: this.calculateRarity(profile, seed),
      baseAvatar: profile.avatarUrl,
      backgroundType: this.selectBackground(profile.bio, seed),
      accessories: this.selectAccessories(profile.username, seed),
    };
    
    // 3. Store
    await db.save({
      tokenId,
      ownerAddress,
      coreTraits,
      revealPhase: 1,
      mintedAt: Date.now()
    });
    
    // 4. Generate Phase 1 image
    await this.generatePhaseImage(tokenId, 1, coreTraits);
  }
  
  async revealPhase(tokenId: number, phase: number) {
    const nft = await db.findByTokenId(tokenId);
    const daysSinceMint = (Date.now() - nft.mintedAt) / (1000 * 60 * 60 * 24);
    
    // Check if phase is ready
    if (phase === 2 && daysSinceMint < 1) throw new Error('Phase 2 not ready');
    if (phase === 3 && daysSinceMint < 2) throw new Error('Phase 3 not ready');
    // ...
    
    // Generate image for this phase
    const image = await this.generatePhaseImage(tokenId, phase, nft.coreTraits);
    
    // Update contract
    await contract.revealNFT(tokenId, phase);
    await contract.setTokenURI(tokenId, imageUrl);
    
    return image;
  }
  
  private async generatePhaseImage(
    tokenId: number, 
    phase: number, 
    traits: CoreTraits
  ): Promise<string> {
    switch(phase) {
      case 1:
        return BLIND_BOX_IMAGE;
        
      case 2:
        return await ai.generateBaseImage(traits.baseAvatar);
        
      case 3:
        const base = await this.getPhaseImage(tokenId, 2);
        const bg = await ai.generateBackground(traits.backgroundType);
        return await ai.combineLayers(base, bg);
        
      // ... progressive layers
    }
  }
}
```

---

## Summary

**Traits được quyết định từ Phase 1** (pre-determined), nhưng **visual layers được generate dần** trong quá trình reveal.

Điều này đảm bảo:
- Fairness (traits locked từ đầu)
- Engagement (progressive reveal)
- Flexibility (visual generation có thể optimize)

