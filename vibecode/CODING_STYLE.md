# CODING STYLE GUIDE

## SMART CONTRACT PATTERNS
```solidity
// PREFERRED: Clear function names, proper error messages, events
pragma solidity ^0.8.20;

contract Counter {
    uint256 public number;
    
    function increment() external {
        number++;
        emit NumberIncremented(msg.sender, number);
    }
    
    function setNumber(uint256 newNumber) external {
        require(newNumber > 0, "Number must be positive");
        number = newNumber;
        emit NumberSet(msg.sender, newNumber);
    }
    
    event NumberIncremented(address indexed user, uint256 newNumber);
    event NumberSet(address indexed user, uint256 newNumber);
}

// AVOID: Unclear names, missing events, unclear error messages
contract Ctr {
    uint256 n;
    
    function inc() external {
        n++;
    }
    
    function set(uint _n) external {
        n = _n;
    }
}
```

## FRONTEND PATTERNS

### OnchainKit Integration
```typescript
// PREFERRED: Proper provider setup, typed contracts
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </body>
    </html>
  );
}

// AVOID: Missing environment variables, wrong chain config
```

### Contract Interactions
```typescript
// PREFERRED: Proper ABI typing, error handling
import { Transaction } from '@coinbase/onchainkit/transaction';

const counterContractAbi = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const calls = [
  {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: counterContractAbi,
    functionName: 'increment',
    args: [],
  },
];

// Usage
<Transaction calls={calls} sponsorGas={true} />

// AVOID: Hardcoded addresses, untyped ABIs, missing error handling
```

### Mini App Setup
```typescript
// PREFERRED: Proper MiniKit integration
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return <div>Mini App Content</div>;
}

// AVOID: Calling ready() multiple times, missing useEffect
```