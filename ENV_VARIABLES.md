# Environment Variables Reference

Copy these to `.env.local`:

```bash
# Coinbase Developer Platform API Key
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key_here

# Contract Address (after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# App URL (for manifest)
NEXT_PUBLIC_URL=https://your-app.vercel.app

# Base RPC URLs
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://sepolia.base.org

# Replicate API (for image generation)
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx

# Mock Mode (optional - for testing without Replicate credit)
# Set to 'true' to use placeholder images instead of calling Replicate API
REPLICATE_MOCK_MODE=false

# Neynar API (for Farcaster profile data)
NEYNAR_API_KEY=your_neynar_api_key

# Admin credentials (for manual reveal testing)
ADMIN_PRIVATE_KEY=0x...
ADMIN_ADDRESS=0x...

# Database (optional, for production)
DATABASE_URL=postgresql://...
```

## Getting API Keys

### Replicate API Token
1. Sign up at [replicate.com](https://replicate.com)
2. Go to [Account Settings](https://replicate.com/account/api-tokens)
3. Create new token
4. Copy `r8_...` token

### Neynar API Key
1. Sign up at [neynar.com](https://neynar.com)
2. Get API key from dashboard
3. Free tier available

### Admin Private Key (for testing)
1. Generate test private key:
   ```bash
   cast wallet new
   ```
2. Fund with Base Sepolia ETH from faucet
3. Use for manual reveal testing only

