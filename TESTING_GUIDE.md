# Testing Guide - Image Generation & Manual Reveal

Guide để test image generation và manual reveal trước khi deploy chính thức.

## Setup

### 1. Environment Variables

Add vào `.env.local`:

```bash
# Replicate API (required for image generation)
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx

# Admin credentials (for manual reveal)
ADMIN_PRIVATE_KEY=0x...
ADMIN_ADDRESS=0x...

# Base RPC
BASE_RPC_URL=https://sepolia.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 2. Install Dependencies

```bash
npm install replicate
```

---

## Test Methods

### Method 1: Admin Panel (Visual Interface)

1. Start dev server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/admin`

3. Test features:
   - **Preview Prompt**: Xem prompt sẽ được generate (không tạo ảnh)
   - **Test Generate Image**: Generate ảnh thật với Replicate
   - **Manual Reveal**: Reveal NFT ngay lập tức (không cần chờ timeline)

### Method 2: API Endpoints (Programmatic)

#### Test Generate Image

```bash
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "phase": 2,
    "profileIndex": 0,
    "ownerAddress": "0x1234567890123456789012345678901234567890"
  }'
```

Response:
```json
{
  "success": true,
  "tokenId": 1,
  "phase": 2,
  "traits": {
    "socialTier": "legend",
    "activityLevel": "hyperactive",
    ...
  },
  "prompt": "A unique identity NFT avatar...",
  "imageUrl": "https://replicate.delivery/...",
  "metadata": { ... }
}
```

#### Preview Prompt Only

```bash
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=2&profileIndex=0"
```

#### Manual Reveal (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/reveal \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "phase": 3
  }'
```

---

## Test Profiles

Có 3 test profiles mặc định:

1. **Legend User** (profileIndex: 0)
   - 15,000 followers
   - 2,000 casts
   - Registered: 2023-01-01
   - Expected: `socialTier: 'legend'`, `activityLevel: 'hyperactive'`

2. **Builder User** (profileIndex: 1)
   - 500 followers
   - 300 casts
   - Registered: 2024-01-01
   - Expected: `socialTier: 'builder'`, `activityLevel: 'active'`

3. **Newcomer User** (profileIndex: 2)
   - 50 followers
   - 20 casts
   - Registered: 2024-12-01
   - Expected: `socialTier: 'newcomer'`, `activityLevel: 'quiet'`

---

## Testing Workflow

### Step 1: Test Prompt Generation

```bash
# Test prompt cho phase 2
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=2&profileIndex=0"

# Test prompt cho phase 7 (final)
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=7&profileIndex=0"
```

**Kiểm tra:**
- Prompt có đúng format không?
- Traits được include đúng không?
- Prompt length hợp lý không? (< 500 chars recommended)

### Step 2: Test Image Generation

```bash
# Test generate phase 2
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 1, "phase": 2, "profileIndex": 0}'

# Test generate phase 7
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 1, "phase": 7, "profileIndex": 0}'
```

**Kiểm tra:**
- Image được generate thành công?
- Image quality đạt yêu cầu?
- Image URL accessible?
- Time to generate? (usually 20-60s)

### Step 3: Test Trait Display

```bash
# Generate và check metadata
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 1, "phase": 3, "profileIndex": 0}' | jq '.metadata.attributes'
```

**Kiểm tra:**
- Phase 2: Có `socialTier` và `baseAvatar`?
- Phase 3: Có `backgroundType` và `colorScheme`?
- Phase 7: Có tất cả traits?

### Step 4: Test Progressive Reveal

```bash
# Reveal từ phase 1 → 7
for phase in 1 2 3 4 5 6 7; do
  echo "Testing phase $phase..."
  curl -X POST http://localhost:3000/api/test/generate \
    -H "Content-Type: application/json" \
    -d "{\"tokenId\": 1, \"phase\": $phase, \"profileIndex\": 0}"
  sleep 2
done
```

**Kiểm tra:**
- Mỗi phase reveal đúng traits?
- Image progressive (thêm layers)?
- Metadata structure consistent?

### Step 5: Test Manual Reveal (Onchain)

```bash
# Deploy contract first
cd contracts
forge create ./src/IdentityNFT.sol:IdentityNFT \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer

# Mint NFT
# ... mint logic ...

# Manual reveal to phase 2
curl -X POST http://localhost:3000/api/admin/reveal \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 1, "phase": 2}'
```

**Kiểm tra:**
- Contract state updated?
- TokenURI updated?
- Transaction successful?

---

## Test Scenarios

### Scenario 1: Different Social Tiers

```bash
# Test legend user
curl -X POST http://localhost:3000/api/test/generate \
  -d '{"tokenId": 1, "phase": 7, "profileIndex": 0}'

# Test builder user
curl -X POST http://localhost:3000/api/test/generate \
  -d '{"tokenId": 2, "phase": 7, "profileIndex": 1}'

# Test newcomer user
curl -X POST http://localhost:3000/api/test/generate \
  -d '{"tokenId": 3, "phase": 7, "profileIndex": 2}'
```

**Expected:**
- Different `socialTier` values
- Different rarity scores
- Different visual styles

### Scenario 2: Custom Profile

```bash
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 10,
    "phase": 7,
    "customProfile": {
      "farcasterId": "999",
      "username": "test_user",
      "displayName": "Test User",
      "avatarUrl": "https://i.imgur.com/example.png",
      "bio": "Crypto artist and web3 enthusiast",
      "followerCount": 7500,
      "followingCount": 300,
      "casts": 1500,
      "registeredAt": "2023-06-01",
      "verifications": []
    }
  }'
```

### Scenario 3: All Phases

Test tất cả phases để đảm bảo progressive reveal works:

```typescript
// Test script
const phases = [1, 2, 3, 4, 5, 6, 7];
for (const phase of phases) {
  const result = await testGenerate(1, phase, 0);
  console.log(`Phase ${phase}:`, result.traits);
  console.log(`Revealed:`, result.metadata.revealedTraits);
}
```

---

## Expected Results

### Phase 1 (Blind Box)
- Image: Placeholder
- Traits: None
- Prompt: "Blind box placeholder"

### Phase 2 (Base Reveal)
- Image: Avatar-based NFT
- Traits: `socialTier`, `baseAvatar`
- Prompt: "based on profile picture, {tier} tier"

### Phase 3 (Background)
- Image: Avatar + background
- Traits: `socialTier`, `backgroundType`, `colorScheme`
- Prompt: "{background} background, {colors} color scheme"

### Phase 4-6 (Accessories)
- Image: Progressive layers
- Traits: `accessories` (incremental)
- Prompt: "with {accessories} accessories"

### Phase 7 (Final)
- Image: Complete NFT
- Traits: All traits + `rarityScore`
- Prompt: "final form with all traits"

---

## Troubleshooting

### Image Generation Fails

**Error: "REPLICATE_API_TOKEN not set"**
- Check `.env.local` has `REPLICATE_API_TOKEN`
- Restart dev server after adding env vars

**Error: "Model not found"**
- Check Replicate model IDs are correct
- Models may have been updated, check Replicate docs

**Error: "Image generation timeout"**
- Replicate may be slow, increase timeout
- Check Replicate status page

### Prompt Issues

**Prompt too long**
- Replicate has prompt length limits
- Truncate long trait descriptions
- Use abbreviations if needed

**Prompt not generating expected images**
- Adjust prompt templates
- Test different models
- Fine-tune trait descriptions

### Manual Reveal Fails

**Error: "Admin credentials not configured"**
- Add `ADMIN_PRIVATE_KEY` and `ADMIN_ADDRESS` to `.env.local`

**Error: "Contract not deployed"**
- Deploy contract first
- Update `NEXT_PUBLIC_CONTRACT_ADDRESS`

**Error: "Transaction failed"**
- Check admin wallet has ETH for gas
- Verify contract address is correct
- Check RPC URL is accessible

---

## Cost Estimation

### Test Phase (10 NFTs × 7 phases = 70 images)
- Replicate: ~70 × $0.002 = $0.14
- Gas (Base Sepolia): Free (testnet)

### Production (10,000 NFTs × 7 phases = 70,000 images)
- Replicate: ~70,000 × $0.002 = $140
- Gas (Base Mainnet): ~$0.01 per transaction

---

## Next Steps After Testing

1. ✅ Verify prompts generate good images
2. ✅ Test all 7 phases
3. ✅ Verify trait display works
4. ✅ Test manual reveal on testnet
5. ✅ Adjust prompts based on results
6. ✅ Deploy to mainnet

---

## Quick Test Commands

```bash
# Quick test all phases for one NFT
for phase in {1..7}; do
  echo "Phase $phase:"
  curl -s -X POST http://localhost:3000/api/test/generate \
    -H "Content-Type: application/json" \
    -d "{\"tokenId\": 1, \"phase\": $phase, \"profileIndex\": 0}" | jq '.success, .imageUrl'
  sleep 3
done
```

