# Setup Guide - FOMO NFT Generator Mini App

This guide walks you through setting up and deploying the FOMO NFT Generator Mini App on Base.

## Prerequisites

- Node.js 18+ installed
- Base app account (for manifest signing)
- Vercel account (for hosting)
- CDP API key from [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/projects/api-keys/client-key)
- Base Sepolia testnet ETH (for contract deployment)

## Step 1: Install Dependencies

```bash
cd nft
npm install
```

## Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

## Step 3: Deploy Smart Contract

### Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Setup Contract Environment

Create `contracts/.env`:

```bash
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### Deploy Contract

```bash
cd contracts
forge create ./src/IdentityNFT.sol:IdentityNFT \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer \
  --constructor-args $(cast wallet address deployer)
```

Save the deployed contract address and update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

## Step 4: Configure Mini App Manifest

1. Update `minikit.config.ts` with your app details:
   - Update `ROOT_URL` or set `NEXT_PUBLIC_URL` environment variable
   - Add icon, splash, and screenshot URLs
   - Customize description and tags

2. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Push code to main branch
   - Vercel will automatically deploy

3. Sign Manifest:
   - Go to [Base Build Preview](https://www.base.dev/preview?tab=account)
   - Paste your deployed URL
   - Click "Verify" and follow instructions
   - Copy the `accountAssociation` object

4. Update `minikit.config.ts`:
   - Paste the `accountAssociation` object into `minikit.config.ts`
   - Push changes to trigger new deployment

## Step 5: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- Wallet connection
- Mint functionality
- Real-time updates

## Step 6: Enable Paymaster (Optional but Recommended)

1. Go to [CDP Portal Paymaster](https://portal.cdp.coinbase.com/products/bundler-and-paymaster)
2. Enable Paymaster for Base Sepolia (or Mainnet)
3. Add your contract address to allowlist
4. Set per-user and global limits
5. Copy Paymaster RPC URL (if needed for custom implementation)

The Transaction component already uses `sponsorGas={true}` which will automatically use your configured Paymaster.

## Step 7: Preview and Publish

1. Preview at [base.dev/preview](https://base.dev/preview):
   - Add your app URL
   - Verify manifest loads correctly
   - Test app launch

2. Publish to Base App:
   - Create a post in Base App with your app URL
   - Your app will be automatically indexed

## Troubleshooting

### Contract not found
- Ensure `NEXT_PUBLIC_CONTRACT_ADDRESS` is set correctly
- Verify contract is deployed on the correct network
- Check RPC URL configuration

### Manifest not loading
- Ensure `.well-known/farcaster.json` route is accessible
- Check Vercel deployment is live
- Verify `accountAssociation` is properly configured

### Transactions failing
- Check Paymaster is configured and enabled
- Verify contract allowslist includes your contract
- Ensure user has sufficient gas (if Paymaster fails)

### Wallet not connecting
- Verify OnchainKitProvider is configured correctly
- Check CDP API key is valid
- Ensure Base network is added to wallet

## Next Steps

- Add AI generation pipeline for NFT images
- Integrate Farcaster profile data
- Implement progressive reveal mechanism
- Add social sharing features
- Set up database for tracking mints

## References

- [Base Documentation](https://docs.base.org)
- [MiniKit Guide](https://docs.base.org/mini-apps)
- [OnchainKit Docs](https://docs.base.org/onchainkit)
- [Foundry Book](https://book.getfoundry.sh/)

