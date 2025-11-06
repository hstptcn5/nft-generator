# TECH STACK & ARCHITECTURE

## BLOCKCHAIN LAYER
- Network: Base (Ethereum L2) - Mainnet and Sepolia testnet
- Contracts: Solidity (ERC-4337 for Smart Wallets)
- Tools: Foundry (Forge, Cast, Anvil)
- Key Addresses:
  - Base Entry Point: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
  - Base Factory: `0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232`
- RPC URLs:
  - Mainnet: `https://mainnet.base.org`
  - Sepolia: `https://sepolia.base.org`

## FRONTEND LAYER  
- Framework: Next.js 15 with App Router
- Web3: Wagmi + Viem for blockchain interactions
- State: React Context + TanStack Query (React Query)
- Styling: Tailwind CSS (default with OnchainKit)
- Components: OnchainKit (@coinbase/onchainkit)
- Mini App SDK: @farcaster/miniapp-sdk + @farcaster/miniapp-wagmi-connector
- Base Account: @base-org/account + @base-org/account-ui

## EXTERNAL SERVICES
- Coinbase Developer Platform (CDP):
  - API Keys for OnchainKit
  - Paymaster & Bundler service
  - Base Account integration
- Base Build Preview: https://base.dev/preview (for Mini App testing)
- Basescan: https://basescan.org (block explorer)
- Network Faucets: For Base Sepolia testnet ETH

## DEVELOPMENT WORKFLOW
- Branch strategy: Feature branches, main branch for production
- Testing: Real integrations only, no mocks - test on Base Sepolia
- Deployment: 
  - DApps: Vercel (recommended) or other hosting
  - Mini Apps: Vercel with manifest at `/.well-known/farcaster.json`
  - Smart Contracts: Direct deployment via Foundry
- Local Development: Mintlify CLI for docs preview, Next.js dev server for apps