# PowerShell script to install packages one by one
# This ensures npm resolves the latest compatible versions

Write-Host "Installing packages..." -ForegroundColor Green

# Core Next.js and React (already have versions)
npm install next@^15.0.0 react@^18.3.0 react-dom@^18.3.0

# OnchainKit and Base packages
npm install @coinbase/onchainkit
npm install @base-org/account
npm install @base-org/account-ui

# Farcaster packages
npm install @farcaster/miniapp-sdk
npm install @farcaster/miniapp-wagmi-connector

# Wagmi and Viem
npm install wagmi viem

# React Query
npm install @tanstack/react-query

# Replicate
npm install replicate

# Dev dependencies
npm install --save-dev @types/node@^20 @types/react@^18 @types/react-dom@^18 typescript@^5 tailwindcss@^3 autoprefixer@^10 postcss@^8 eslint@^8 eslint-config-next@^15

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Check package.json for installed versions." -ForegroundColor Yellow

