# FOMO NFT Generator - Mini App

AI-Powered Identity NFT Collection on Base - Each user receives a unique NFT generated from Farcaster profile + AI, creating a synchronized collection.

## Features

- Limited time mint event (10,000 NFTs, 48-hour window)
- Progressive reveal mechanism (Blind Box → Reveal → AI Evolution)
- Social proof integration with Farcaster
- Gasless transactions via Base Paymaster
- Real-time mint updates
- Base Account integration for seamless authentication

## Tech Stack

- **Frontend**: Next.js 15, OnchainKit, MiniKit, Wagmi, Viem
- **Smart Contracts**: Foundry, Solidity (ERC-721)
- **Network**: Base (Ethereum L2)
- **Authentication**: Base Account (Smart Wallet)
- **Transactions**: CDP Paymaster for gasless UX

## Project Structure

```
nft/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # OnchainKitProvider with MiniKit
│   ├── page.tsx           # Main mint page
│   └── .well-known/       # Mini App manifest
│       └── farcaster.json
├── contracts/             # Foundry smart contract project
│   ├── src/
│   │   └── IdentityNFT.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── test/
│   │   └── IdentityNFT.t.sol
│   └── foundry.toml
├── lib/                   # Utility functions
│   ├── calls.ts          # Contract interaction configs
│   ├── constants.ts      # Contract addresses, ABIs
│   └── utils.ts          # Helper functions
├── components/           # React components
│   ├── MintPage.tsx
│   ├── NFTDisplay.tsx
│   └── RecentMints.tsx
└── minikit.config.ts    # Mini App manifest config
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env.local
```

3. Configure CDP API key in `.env.local`:
```
NEXT_PUBLIC_CDP_API_KEY=your_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

4. Run development server:
```bash
npm run dev
```

## Smart Contract Deployment

1. Navigate to contracts directory:
```bash
cd contracts
```

2. Deploy to Base Sepolia:
```bash
forge create ./src/IdentityNFT.sol:IdentityNFT \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer
```

## Mini App Configuration

1. Update `minikit.config.ts` with your app details
2. Deploy to Vercel
3. Sign manifest at https://www.base.dev/preview?tab=account
4. Update `accountAssociation` in `minikit.config.ts`
5. Push to production

## References

- Base Documentation: https://docs.base.org
- MiniKit Guide: https://docs.base.org/mini-apps
- OnchainKit: https://docs.base.org/onchainkit

