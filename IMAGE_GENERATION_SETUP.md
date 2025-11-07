# Image Generation Setup Guide

## 1. Nền tảng AI Generation

### Replicate.com (Recommended)

#### Setup
1. Đăng ký tại [replicate.com](https://replicate.com)
2. Lấy API token từ [Account Settings](https://replicate.com/account/api-tokens)
3. Add vào `.env.local`:
   ```
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx
   ```

#### Models Available
- **Stable Diffusion**: `stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf`
- **Image-to-Image**: `stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d`
- **Flux**: `black-forest-labs/flux-dev` (premium quality)

#### Pricing
- ~$0.002-0.01 per image generation
- Pay-as-you-go
- No subscription required

### Pollinations.ai (Free Tier)

#### Khi nào dùng
- Muốn test nhanh không tốn phí
- Không cần đăng ký tài khoản hoặc API key
- Chấp nhận chất lượng thấp hơn và hình ảnh công khai

#### Setup
1. Không cần tạo tài khoản
2. Cập nhật `.env.local`:
   ```
   NFT_IMAGE_PROVIDER=pollinations
   # Tuỳ chọn: override style chung
   NFT_IMAGE_STYLE_PROMPT="A cute, stylized anime illustration of a heroic digital explorer, soft lighting"
   # Tuỳ chọn: chỉnh độ giữ nét khi dùng ảnh phase trước (0.1 - 0.8)
   NFT_IMAGE_IMG2IMG_STRENGTH=0.35
   ```
3. Khởi động lại server dev (`npm run dev`)

#### Lưu ý
- URL được tạo bởi Pollinations là ảnh public, bất kỳ ai có link đều xem được
- `init_image` (phase 2) có thể không luôn chính xác; nếu avatar không render được, hệ thống fallback sang prompt thuần
- Không bật `REPLICATE_MOCK_MODE` khi dùng provider này (tuân thủ "Don't use mock")
- Phase > 2 sẽ dùng lại ảnh phase trước thông qua image-to-image (`init_image`), strength mặc định 0.35 giúp giữ khuôn mặt và style thống nhất

### Chuỗi Reveal Giữ Nguyên Style

1. **Phase 1**: Blind box (placeholder)
2. **Phase 2**: Img2Img từ avatar Farcaster (`strength=0.7`)
3. **Phase 3-7**: Img2Img từ ảnh phase trước (`strength=NFT_IMAGE_IMG2IMG_STRENGTH`, mặc định 0.35)
   - Thêm background, accessories, effects dần dần nhưng vẫn giữ nét nhân vật cũ
   - Nếu thiếu ảnh phase trước, hệ thống fallback sang generate text-to-image như cũ
4. Có thể giảm `NFT_IMAGE_IMG2IMG_STRENGTH` để bám sát ảnh cũ hơn, hoặc tăng (tối đa ~0.8) nếu muốn thay đổi mạnh

### Alternative: Stability AI

#### Setup
1. Đăng ký tại [platform.stability.ai](https://platform.stability.ai)
2. Lấy API key
3. Add vào `.env.local`:
   ```
   STABILITY_API_KEY=sk-xxxxxxxxxxxx
   ```

#### Usage
```typescript
// Alternative implementation using Stability AI directly
import StabilityAI from 'stability-ai';

const stability = new StabilityAI({
  apiKey: process.env.STABILITY_API_KEY,
});
```

---

## 2. Generate dựa trên gì?

### Input Sources

#### 1. Farcaster Profile (Primary)
```typescript
interface FarcasterProfile {
  farcasterId: string;        // FID
  username: string;           // @username
  avatarUrl: string;          // Profile picture
  bio: string;               // Bio text
  followerCount: number;      // Social tier
  casts: number;             // Activity level
  registeredAt: Date;        // Vintage
}
```

#### 2. Deterministic Seed
```typescript
// Generate from: tokenId + ownerAddress + farcasterId
const seed = keccak256(
  toHex(`${tokenId}-${ownerAddress}-${farcasterId}`)
);
```

#### 3. Generated Traits
```typescript
// All traits determined from:
- Social tier: followerCount → 'legend' | 'veteran' | 'builder' | 'newcomer'
- Activity level: casts → 'hyperactive' | 'active' | 'moderate' | 'quiet'
- Background: bio analysis + seed
- Color scheme: avatar colors + seed
- Accessories: username + seed
- Special effects: registration date + seed
```

---

## 3. Trait Display per Phase

### Phase 1: Blind Box
```json
{
  "attributes": [],
  "revealedTraits": []
}
```

### Phase 2: Base Reveal
```json
{
  "attributes": [
    { "trait_type": "Social Tier", "value": "builder" },
    { "trait_type": "Base Avatar", "value": "Farcaster Profile" }
  ],
  "revealedTraits": ["socialTier", "baseAvatar"]
}
```

### Phase 3: Background
```json
{
  "attributes": [
    { "trait_type": "Social Tier", "value": "builder" },
    { "trait_type": "Background", "value": "cyberpunk cityscape" },
    { "trait_type": "Color Scheme", "value": "blue, purple" }
  ],
  "revealedTraits": ["socialTier", "backgroundType", "colorScheme"]
}
```

### Phase 4-6: Accessories
```json
{
  "attributes": [
    { "trait_type": "Social Tier", "value": "builder" },
    { "trait_type": "Activity Level", "value": "active" },
    { "trait_type": "Background", "value": "cyberpunk cityscape" },
    { "trait_type": "Accessories", "value": "digital crown, holographic glasses" }
  ],
  "revealedTraits": ["socialTier", "activityLevel", "backgroundType", "accessory_0", "accessory_1"]
}
```

### Phase 7: Final Form
```json
{
  "attributes": [
    { "trait_type": "Social Tier", "value": "builder" },
    { "trait_type": "Activity Level", "value": "active" },
    { "trait_type": "Vintage", "value": "recent" },
    { "trait_type": "Background", "value": "cyberpunk cityscape" },
    { "trait_type": "Color Scheme", "value": "blue, purple" },
    { "trait_type": "Accessories", "value": "digital crown, holographic glasses, neon aura" },
    { "trait_type": "Special Effects", "value": "time distortion, reality glitch" },
    { "trait_type": "Rarity Score", "value": 65, "display_type": "number" }
  ],
  "revealedTraits": ["socialTier", "activityLevel", "vintage", "backgroundType", "colorScheme", "accessory_0", "accessory_1", "accessory_2", "effect_0", "effect_1", "rarityScore"]
}
```

---

## 4. Environment Variables

Add to `.env.local`:

```bash
# Image provider (replicate | pollinations)
NFT_IMAGE_PROVIDER=replicate

# Base style prompt (giữ nguyên nếu muốn mặc định anime dễ thương)
NFT_IMAGE_STYLE_PROMPT="A cute, stylized anime illustration of a heroic digital explorer, soft lighting, vibrant colors, clean line art, expressive face, high quality"

# Image-to-image strength (0.1-0.8). Giảm để giữ nét phase trước, tăng để đổi mới hơn
NFT_IMAGE_IMG2IMG_STRENGTH=0.35

# Replicate API
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx

# Neynar API (for Farcaster profile)
NEYNAR_API_KEY=your_neynar_api_key

# IPFS (optional, for metadata storage)
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# API Base URL
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

---

## 5. Implementation Flow

```
User mints NFT
  ↓
Webhook triggered: /api/webhook
  ↓
1. Fetch Farcaster profile (Neynar API)
  ↓
2. Generate traits (deterministic)
  ↓
3. Generate Phase 1 image (Blind Box)
  ↓
4. Store NFT data
  ↓
5. Upload to IPFS (optional)
  ↓
6. Update contract tokenURI
```

---

## 6. Testing

### Test Image Generation Locally

```bash
# Start dev server
npm run dev

# Test generation endpoint
# (Sử dụng Pollinations miễn phí → đảm bảo đặt NFT_IMAGE_PROVIDER=pollinations)
curl -X POST http://localhost:3000/api/nft/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "phase": 2,
    "traits": {
      "socialTier": "builder",
      "activityLevel": "active",
      "backgroundType": "cyberpunk cityscape",
      "colorScheme": ["blue", "purple"],
      "accessories": ["digital crown"],
      "specialEffects": [],
      "rarityScore": 50
    },
    "farcasterAvatar": "https://...",
    "previousImageUrl": "https://..." # phase > 2: truyền ảnh phase trước để giữ style
  }'
```

---

## 7. Cost Estimation

### Replicate Pricing
- Stable Diffusion: ~$0.002 per image
- Image-to-Image: ~$0.003 per image
- For 10,000 NFTs × 7 phases = 70,000 images
- Total cost: ~$140-210

### IPFS Storage (Optional)
- Pinata: Free tier available
- Or use Arweave for permanent storage

---

## 8. Next Steps

1. Setup Replicate account and get API token
2. Setup Neynar account for Farcaster API
3. Configure environment variables
4. Test image generation locally
5. Setup IPFS/Pinata for metadata storage
6. Deploy backend API endpoints

