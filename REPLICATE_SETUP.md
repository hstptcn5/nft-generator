# Replicate Setup & Billing

## Lỗi: "Insufficient credit" (402)

Replicate cần credit để generate images. Mỗi image generation tốn ~$0.002.

## Cách Fix

### 1. Add Credit vào Replicate Account

1. Đăng nhập: https://replicate.com/account
2. Vào Billing: https://replicate.com/account/billing#billing
3. Add credit (minimum $10 recommended)
4. Đợi 2-3 phút để credit được activate
5. Thử lại

### 2. Test với Preview Prompt (Free)

Trước khi add credit, bạn có thể test **prompt generation** (không generate ảnh):

```bash
# Test preview prompt (FREE - không tốn credit)
curl "http://localhost:3000/api/test/generate?tokenId=1&phase=2&profileIndex=0"
```

Endpoint này chỉ trả về prompt, không gọi Replicate API.

### 3. Mock Mode (Development Only)

Nếu muốn test flow mà không tốn credit, có thể enable mock mode:

Thêm vào `.env.local`:
```bash
REPLICATE_MOCK_MODE=true
```

Sau đó code sẽ return mock image URLs thay vì gọi Replicate.

## Cost Estimate

- **Preview Prompt**: Free
- **1 Image Generation**: ~$0.002
- **Test 10 NFTs × 7 phases**: ~$0.14
- **Production (10k NFTs)**: ~$140

## Recommended Testing Flow

1. ✅ **Test Preview Prompt** (Free) - Verify prompt generation works
2. ✅ **Add $10 credit** to Replicate
3. ✅ **Test 1-2 images** to verify quality
4. ✅ **Adjust prompts** if needed
5. ✅ **Test all phases** for 1-2 NFTs
6. ✅ **Scale up** if results are good

## Alternative: Use Free Tier Models

Một số models có free tier, nhưng chất lượng thấp hơn. Không recommend cho production.


