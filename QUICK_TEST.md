# Quick Test Guide

## 1. Setup

```bash
# Install dependencies
npm install

# Add to .env.local
REPLICATE_API_TOKEN=r8_xxxxx
```

## 2. Start Dev Server

```bash
npm run dev
```

## 3. Test via Admin Panel

Navigate to: `http://localhost:3000/admin`

### Features:
- **Preview Prompt**: Xem prompt không generate ảnh
- **Test Generate**: Generate ảnh thật với Replicate
- **Manual Reveal**: Reveal NFT ngay (admin only)

## 4. Test via API

### Preview Prompt (No Image Generation)

```bash
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=2&profileIndex=0"
```

Response shows:
- Generated traits
- AI prompt that will be used
- No image generation (fast)

### Generate Image (With Replicate)

```bash
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "phase": 2,
    "profileIndex": 0
  }'
```

Response includes:
- Generated traits
- AI prompt
- Generated image URL
- Full metadata

### Test All Phases

```bash
# Test prompt for each phase
for phase in 1 2 3 4 5 6 7; do
  echo "=== Phase $phase ==="
  curl -s "http://localhost:3000/api/test/generate?tokenId=1&phase=$phase&profileIndex=0" | jq '.prompt'
  echo ""
done
```

## 5. Test Different Profiles

```bash
# Legend user (high followers)
curl -X POST http://localhost:3000/api/test/generate \
  -d '{"tokenId": 1, "phase": 7, "profileIndex": 0}'

# Builder user (medium followers)
curl -X POST http://localhost:3000/api/test/generate \
  -d '{"tokenId": 2, "phase": 7, "profileIndex": 1}'

# Newcomer user (low followers)
curl -X POST http://localhost:3000/api/test/generate \
  -d '{"tokenId": 3, "phase": 7, "profileIndex": 2}'
```

## 6. Manual Reveal (Requires Contract)

```bash
# Add to .env.local first:
ADMIN_PRIVATE_KEY=0x...
ADMIN_ADDRESS=0x...

# Then reveal manually:
curl -X POST http://localhost:3000/api/admin/reveal \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "phase": 3
  }'
```

## What to Check

1. **Prompt Quality**: 
   - Prompt có đủ thông tin không?
   - Traits được include đúng không?
   - Length hợp lý không?

2. **Image Quality**:
   - Image có chất lượng tốt không?
   - Style consistent không?
   - Traits được reflect trong image không?

3. **Progressive Reveal**:
   - Phase 2: Base avatar
   - Phase 3: Background added
   - Phase 4-6: Accessories progressive
   - Phase 7: Complete with all traits

4. **Trait Display**:
   - Traits được reveal đúng phase?
   - Metadata structure đúng?
   - Rarity score hợp lý?

