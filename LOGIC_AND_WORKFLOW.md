# Logic & Workflow - FOMO NFT Generator Mini App

## Tổng quan dự án

FOMO NFT Generator là một Mini App trên Base cho phép users mint NFT độc nhất được generate từ Farcaster profile kết hợp với AI. Dự án tạo FOMO thông qua:
- Limited supply (10,000 NFTs)
- Limited time window (48 hours)
- Progressive reveal mechanism
- Social proof integration

---

## 1. LOGIC TỔNG THỂ

### 1.1 Core Concept

```
User Farcaster Profile → AI Generation → Unique Identity NFT → Onchain Storage
```

**Flow chính:**
1. User connect wallet (Base Account tự động trong Mini App)
2. User mint NFT (gasless transaction)
3. Backend generate NFT từ Farcaster profile + AI
4. NFT metadata stored onchain
5. Progressive reveal theo thời gian
6. Social sharing tạo viral loop

### 1.2 FOMO Mechanisms

#### Scarcity
- **Max Supply**: 10,000 NFTs (hardcoded trong contract)
- **Time Limit**: 48 hours từ khi deploy
- **One Per Address**: Mỗi address chỉ mint được 1 NFT

#### Social Proof
- Real-time mint counter (live updates)
- Recent mints feed (show last 10 minters)
- Progress bar showing supply depletion

#### Progressive Reveal
- **Phase 1**: Blind Box (ngay sau khi mint)
- **Phase 2**: Base reveal (Farcaster avatar based)
- **Phase 3**: AI evolution (thêm layers theo thời gian)
- **Phase 7**: Final form với rarity traits

---

## 2. WORKFLOW CHI TIẾT

### 2.1 User Journey

#### Step 1: Discovery & Landing
```
User sees Mini App in Base App feed
  ↓
Taps on embed/preview
  ↓
Mini App loads (splash screen)
  ↓
sdk.actions.ready() called → App visible
```

**Technical:**
- Mini App manifest loaded từ `.well-known/farcaster.json`
- Base Account tự động connected (no wallet connection needed)
- OnchainKitProvider initialized với Base chain

#### Step 2: View Mint Page
```
Page loads
  ↓
Wagmi hooks fetch contract state
  ↓
Display:
  - Minted count / Max supply
  - Progress bar
  - Recent mints
  - Mint button (if eligible)
```

**Technical Implementation:**
```typescript
// Real-time data fetching
useReadContract({
  functionName: 'mintedCount',  // Current supply
  functionName: 'hasMinted',    // User status
  functionName: 'isMintActive', // Mint availability
})

// Event watching
useWatchContractEvent({
  eventName: 'NFTMinted',
  // Updates UI in real-time
})
```

#### Step 3: Mint Transaction
```
User clicks "Mint" button
  ↓
Transaction component shows
  ↓
User approves transaction
  ↓
Paymaster sponsors gas (gasless)
  ↓
Transaction sent to Base
  ↓
Contract emits NFTMinted event
  ↓
UI updates immediately
```

**Transaction Flow:**
1. `Transaction` component từ OnchainKit được trigger
2. `calls` array chứa mint function call
3. `sponsorGas={true}` → Paymaster pays gas
4. Transaction submitted via Smart Wallet
5. Contract executes `mint()` function
6. Event emitted → Real-time UI update

#### Step 4: Post-Mint
```
NFT minted onchain
  ↓
Backend webhook triggered (optional)
  ↓
AI generation starts
  ↓
NFT metadata updated
  ↓
Progressive reveal begins
```

**Backend Integration (Future):**
- Webhook endpoint: `/api/webhook`
- Fetches Farcaster profile data
- Generates AI image
- Updates NFT metadata URI
- Triggers reveal phases

---

### 2.2 Smart Contract Workflow

#### Contract State
```solidity
uint256 public constant MAX_SUPPLY = 10_000;
uint256 public constant MINT_PERIOD = 48 hours;
uint256 public startTime;        // Set in constructor
uint256 public mintedCount;       // Current supply
mapping(address => bool) hasMinted; // Prevent double mint
mapping(uint256 => uint256) revealPhase; // Track evolution
```

#### Mint Function Logic
```
1. Check time limit: block.timestamp <= startTime + MINT_PERIOD
2. Check supply: mintedCount < MAX_SUPPLY
3. Check user eligibility: !hasMinted[msg.sender]
4. Mint NFT: _safeMint(msg.sender, tokenId)
5. Update state: hasMinted[msg.sender] = true, mintedCount++
6. Set initial phase: revealPhase[tokenId] = 1
7. Emit event: NFTMinted(msg.sender, tokenId, timestamp)
```

#### Reveal Phase Logic
```
Phase 1 (Initial): Blind Box
  - Token URI points to placeholder
  - revealPhase[tokenId] = 1

Phase 2 (Day 2): Base Reveal
  - Farcaster avatar processed
  - revealPhase[tokenId] = 2

Phase 3-6 (Days 3-6): AI Evolution
  - Each day adds new layer
  - revealPhase[tokenId] incremented

Phase 7 (Day 7): Final Form
  - All traits revealed
  - Rarity calculated
  - revealPhase[tokenId] = 7
```

---

### 2.3 Frontend Component Flow

#### MintPage Component
```
┌─────────────────────────────────────┐
│  MintPage (Main Container)          │
├─────────────────────────────────────┤
│  1. useAccount()                     │
│     → Get connected wallet           │
│                                      │
│  2. useReadContract() x3            │
│     → mintedCount                    │
│     → hasMinted                      │
│     → isMintActive                   │
│                                      │
│  3. useWatchContractEvent()          │
│     → Listen for NFTMinted events    │
│     → Update UI in real-time         │
│                                      │
│  4. Render:                          │
│     - Header with count/progress     │
│     - Transaction component          │
│     - NFTDisplay component           │
│     - RecentMints component          │
└─────────────────────────────────────┘
```

#### Real-time Updates Flow
```
Contract Event Emitted
  ↓
useWatchContractEvent hook triggered
  ↓
State updated (mintedCount++, recentMints)
  ↓
React re-renders components
  ↓
UI shows new data immediately
```

---

### 2.4 Integration Points

#### Base Account Integration
```
Mini App launched in Base App
  ↓
Base Account automatically available
  ↓
No wallet connection needed
  ↓
Smart Wallet ready for transactions
```

**Technical:**
- OnchainKitProvider với `miniKit={{ enabled: true }}`
- Farcaster Mini App connector tự động setup
- Base Account connector included

#### Paymaster Integration
```
Transaction initiated
  ↓
OnchainKit checks sponsorGas={true}
  ↓
CDP Paymaster endpoint called
  ↓
Paymaster validates:
  - Contract in allowlist
  - Per-user limit not exceeded
  - Global limit not exceeded
  ↓
Paymaster sponsors gas
  ↓
Transaction proceeds gasless
```

**Configuration:**
- Paymaster configured in CDP Portal
- Contract address allowlisted
- Function `mint()` allowlisted
- Limits set (per-user, global)

#### Mini App Manifest
```
App deployed to Vercel
  ↓
.well-known/farcaster.json accessible
  ↓
Base App indexes manifest
  ↓
App discoverable in:
  - Search results
  - Category browsing
  - Social feeds
```

**Manifest Includes:**
- Account association (for ownership)
- App metadata (name, description, icons)
- Category and tags
- Screenshots and hero image

---

## 3. DATA FLOW

### 3.1 Onchain Data
```
Contract State:
├── mintedCount (uint256)
├── hasMinted[address] (bool)
├── revealPhase[tokenId] (uint256)
└── tokenURI[tokenId] (string)

Events:
└── NFTMinted(address, uint256, uint256)
```

### 3.2 Frontend State
```
React State:
├── mintedCount (from contract)
├── hasMinted (from contract)
├── isMintActive (from contract)
├── recentMints[] (from events)
└── userAddress (from wallet)
```

### 3.3 Backend Data (Future)
```
Farcaster Profile:
├── farcasterId
├── avatarUrl
├── username
├── followerCount
└── bio

NFT Metadata:
├── tokenId
├── imageUrl (generated)
├── traits (generated)
└── rarity (calculated)
```

---

## 4. TIMELINE & PHASES

### Phase 1: Pre-Mint (Setup)
- Contract deployed
- Frontend deployed
- Manifest signed
- Paymaster configured
- Marketing/pre-launch

### Phase 2: Mint Window (48 hours)
```
Hour 0: Mint opens
  ↓
User mints NFT
  ↓
Receives Blind Box (Phase 1)
  ↓
Real-time counter updates
  ↓
Social sharing begins
```

### Phase 3: Progressive Reveal (Days 1-7)
```
Day 1: Blind Box visible
Day 2: Base reveal (Farcaster avatar)
Day 3-6: AI evolution (new layers daily)
Day 7: Final form with rarity
```

### Phase 4: Post-Mint (Ongoing)
- Secondary market features
- NFT upgrades
- Community features
- Future airdrops

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 Frontend Stack
```
Next.js 15 (App Router)
  ↓
OnchainKitProvider (MiniKit enabled)
  ↓
Wagmi + Viem (Blockchain interactions)
  ↓
React Query (State management)
  ↓
Tailwind CSS (Styling)
```

### 5.2 Smart Contract Stack
```
Solidity ^0.8.20
  ↓
OpenZeppelin (ERC721 standard)
  ↓
Foundry (Development & Deployment)
  ↓
Base Network (Ethereum L2)
```

### 5.3 Integration Services
```
Base Account (Authentication)
CDP Paymaster (Gasless transactions)
Farcaster (Social data)
Base App (Distribution)
IPFS (Metadata storage - future)
```

---

## 6. ERROR HANDLING & EDGE CASES

### Contract Errors
- **Mint period ended**: Show message, disable mint button
- **Supply exhausted**: Show "Sold out" message
- **Already minted**: Show "You already have NFT" message
- **Transaction failed**: Show error, allow retry

### Frontend Errors
- **Wallet not connected**: Show connect prompt
- **Wrong network**: Auto-switch to Base (handled by OnchainKit)
- **RPC errors**: Retry with fallback RPC
- **Event not received**: Poll contract state as fallback

### Paymaster Errors
- **Limit exceeded**: Show message, user pays gas manually
- **Not configured**: Transaction fails, show error
- **Contract not allowlisted**: Admin must configure

---

## 7. FUTURE ENHANCEMENTS

### Backend Integration
1. **Webhook Handler**: Process mint events
2. **Farcaster API**: Fetch profile data
3. **AI Generation**: Generate unique images
4. **Metadata Update**: Update tokenURI onchain
5. **Reveal Scheduler**: Automate phase transitions

### Additional Features
1. **Referral System**: Reward for inviting friends
2. **Rarity Calculator**: Calculate NFT rarity scores
3. **Secondary Market**: Trading features
4. **Upgrade System**: Pay to unlock special traits
5. **Leaderboard**: Show rarest NFTs

---

## 8. KEY DECISIONS & RATIONALE

### Why Base?
- Low gas fees (sub-cent transactions)
- Fast finality (sub-second)
- Built-in distribution (Base App)
- Base Account integration

### Why Mini App?
- No app store approval needed
- Instant launch from social feed
- Built-in social distribution
- Base Account seamless auth

### Why Gasless?
- Remove friction for new users
- Better conversion rates
- Professional UX
- CDP Paymaster handles costs

### Why Progressive Reveal?
- Maintains engagement post-mint
- Creates anticipation
- Allows AI generation time
- Builds community excitement

---

## 9. WORKFLOW SUMMARY

### Complete User Flow
```
1. User discovers app in Base App feed
2. Taps to launch Mini App
3. App loads with current mint stats
4. User sees real-time mint activity
5. User clicks "Mint" button
6. Transaction approved (gasless)
7. NFT minted onchain
8. Event emitted → UI updates
9. User sees "Mint successful"
10. NFT begins progressive reveal
11. User shares on Farcaster
12. Viral loop continues
```

### Complete Technical Flow
```
1. Next.js app loads
2. OnchainKitProvider initializes
3. Wagmi connects to Base
4. Contract state fetched
5. Event listeners setup
6. User interacts
7. Transaction created
8. Paymaster sponsors gas
9. Transaction sent
10. Contract executes
11. Event emitted
12. Frontend updates
13. Real-time UI refresh
```

---

**Last Updated**: Based on current implementation
**Status**: Core functionality complete, backend integration pending

