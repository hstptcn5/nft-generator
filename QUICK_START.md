# Quick Start - Testing Guide

Hướng dẫn nhanh để test image generation và manual reveal.

## Bước 1: Setup Environment Variables

Tạo file `.env.local` trong thư mục `nft/`:

```bash
# Replicate API (required for image generation)
# Get from: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx

# Admin credentials (optional, for manual reveal testing)
# Only needed if testing onchain reveal
ADMIN_PRIVATE_KEY=0x...
ADMIN_ADDRESS=0x...

# Base RPC (optional, for onchain testing)
BASE_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

## Bước 2: Start Dev Server

```bash
cd nft
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

## Bước 3: Test Methods

### Option A: Admin Panel (Visual - Recommended)

1. Mở browser: `http://localhost:3000/admin`
2. Chọn test profile (Legend/Builder/Newcomer)
3. Chọn phase (1-7)
4. Click "Preview Prompt" để xem prompt (không generate ảnh)
5. Click "Test Generate Image" để generate ảnh thật

### Option B: API Endpoints (Programmatic)

#### Preview Prompt (Free, no cost)
```bash
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=2&profileIndex=0"
```

#### Generate Image (Costs ~$0.002 per image)
```bash
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 1, "phase": 2, "profileIndex": 0}'
```

## Test Profiles

Có 3 test profiles sẵn:

- **Profile 0 (Legend)**: 15k followers, 2k casts → `socialTier: 'legend'`
- **Profile 1 (Builder)**: 500 followers, 300 casts → `socialTier: 'builder'`
- **Profile 2 (Newcomer)**: 50 followers, 20 casts → `socialTier: 'newcomer'`

## Quick Test Commands

```bash
# Test prompt generation (free)
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=2&profileIndex=0"

# Test image generation phase 2
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{"tokenId": 1, "phase": 2, "profileIndex": 0}'

# Test all phases (1-7)
for phase in {1..7}; do
  echo "Testing phase $phase..."
  curl -X POST http://localhost:3000/api/test/generate \
    -H "Content-Type: application/json" \
    -d "{\"tokenId\": 1, \"phase\": $phase, \"profileIndex\": 0}"
  sleep 3
done
```

## Expected Results

- **Phase 1**: Blind box placeholder
- **Phase 2**: Avatar-based NFT với social tier
- **Phase 3**: Thêm background và color scheme
- **Phase 4-6**: Progressive accessories và effects
- **Phase 7**: Final form với tất cả traits

## Troubleshooting

### "REPLICATE_API_TOKEN not set"
- Kiểm tra `.env.local` có `REPLICATE_API_TOKEN`
- Restart dev server sau khi thêm env vars

### Image generation fails
- Check Replicate API token valid
- Check internet connection
- Replicate có thể mất 20-60s để generate

### Admin panel không load
- Check `npm run dev` đang chạy
- Check console errors trong browser

## Cost Estimate

- **Preview prompt**: Free
- **Generate 1 image**: ~$0.002
- **Test 10 NFTs × 7 phases**: ~$0.14

## Next Steps

1. ✅ Test prompt generation
2. ✅ Test image generation cho 1-2 phases
3. ✅ Test different profiles
4. ✅ Adjust prompts nếu cần
5. ✅ Deploy contract và test onchain reveal

