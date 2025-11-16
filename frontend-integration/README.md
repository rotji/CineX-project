# CineX Frontend

Decentralized crowdfunding platform for filmmakers built on Stacks blockchain with React 19, TypeScript, and Vite.

## Table of Contents
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Authentication](#authentication)
- [Blockchain Integration](#blockchain-integration)
- [Component Structure](#component-structure)
- [Environment Configuration](#environment-configuration)
- [Development](#development)

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Connect a Stacks wallet (Hiro/Xverse) to interact with blockchain contracts.

## 🏗️ Architecture

```
frontend-integration/
├── src/
│   ├── auth/                  # Stacks wallet authentication
│   ├── components/            # UI components
│   ├── pages/                 # Page components
│   ├── services/              # Blockchain service layer
│   ├── styles/                # CSS Modules
│   └── utils/                 # Network utilities
├── public/                    # Static assets
├── .env                       # Environment configuration
├── package.json
├── vite.config.ts
└── README.md
```

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.1**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing

### Stacks Integration
- **@stacks/connect 8.2.0**: Wallet authentication and transaction signing
- **@stacks/transactions**: Contract interaction with Clarity types
- **@stacks/network**: Network configuration (devnet/testnet/mainnet)

### Styling & UI
- **CSS Modules**: Component-scoped styling
- **React Icons**: Icon library
- **Responsive Design**: Mobile-first approach

### Development Tools
- **ESLint**: Code linting and quality checks
- **TypeScript ESLint**: TypeScript-specific linting
- **Vite Plugin React**: React integration with Vite

## 🔐 Authentication

### Stacks Wallet Integration

Supports Hiro Wallet and Xverse with session persistence:

```typescript
// src/auth/StacksAuthContext.tsx
interface AuthContextType {
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  balance: string | null;
  isLoadingBalance: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  refreshBalance: () => Promise<void>;
}
```

**Features:**
- Wallet connection/disconnection
- Session persistence across browser refreshes
- Automatic reconnection on app startup
- Real-time balance display
- Connection status indicators
- Error handling for failed connections
- Transaction signing capabilities

## 🔗 Blockchain Integration

### Co-EP Pool Operations

All three Co-EP operations fully integrated with smart contracts:

```typescript
// Create new rotating funding pool (9 parameters)
functionName: 'create-new-rotating-funding-pool',
functionArgs: [
  stringUtf8CV(projectId),              // Film project identifier
  stringUtf8CV(poolName),                // Pool display name
  uintCV(maxMembers),                    // Maximum pool capacity
  uintCV(contributionPerMember),         // STX per member
  uintCV(cycleDuration),                 // Blocks per rotation
  bufferCV(legalAgreementHash),          // 32-byte SHA256 hash
  stringAsciiCV(category),               // Pool category
  stringAsciiCV(geographicFocus),        // Target region
  principalCV(verificationAddress)       // Verification contract trait
]

// Join/contribute to existing pool
functionName: 'contribute-to-existing-pool',
functionArgs: [uintCV(poolId)]
```

### Service Layer

**`src/services/coepService.ts`**: Blockchain transaction calls via `openContractCall()`
```typescript
// Pool creation
createPool(params: CreatePoolParams): Promise<void>

// Pool joining/contribution
joinPool(poolId: number): Promise<void>
contributeToPool(poolId: number): Promise<void>
```

**`src/utils/network.ts`**: Network configuration
```typescript
export function getNetwork(): StacksNetwork;
export function getContractAddress(): string;
export function getContractName(): string;
```

### Integrated Contracts

Contract Address: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM` (Hiro Devnet)

- **Co-EP Rotating Fundings**: `Co-EP-rotating-fundings`
- **Crowdfunding Module**: `crowdfunding-module`
- **CineX Core**: `CineX-project`
- **Verification Module**: `film-verification-module`
- **Escrow Module**: `escrow-module`
- **Rewards Module**: `rewards-module`

## 🎨 Component Structure

### Page Components
```typescript
// User Roles & Authentication
├── CreateAccount.tsx          # User registration
├── WalletConnection.tsx       # Wallet authentication

// Campaign Management
├── CreateCampaign.tsx         # Campaign creation wizard
├── CampaignDetail.tsx         # Campaign detail view
├── FundCampaign.tsx           # Funding interface
├── Projects.tsx               # Campaign discovery

// Co-EP Pools
├── CoEPPools.tsx              # Pool discovery and listing
├── PoolCreate.tsx             # Pool creation (4-step wizard)
├── PoolDashboard.tsx          # Member management
├── PoolDetail.tsx             # Individual pool view

// Financial Management
├── EscrowManagement.tsx       # Escrow operations
├── ContributorRewards.tsx     # Rewards distribution

// Administration
├── AdminDashboard.tsx         # Platform management
├── Dashboard.tsx              # User dashboard with role switching
├── Home.tsx                   # Landing page
```

### UI Components
```typescript
// Core Layout
├── Header.tsx                 # Navigation with role switching
├── Footer.tsx                 # Platform footer
├── HamburgerMenu.tsx          # Mobile navigation

// Modals & Forms
├── CreateCampaignModal.tsx    # Campaign creation
├── FundCampaignModal.tsx      # Funding interface
├── EscrowActionModal.tsx      # Escrow actions
├── TransactionStatusModal.tsx # Transaction tracking
├── TransactionStatusUI.tsx    # Transaction status display

// Display Components
├── ProjectCard.tsx            # Campaign cards
├── WalletStatus.tsx           # Connection status
├── AdminControls.tsx          # Admin controls
```

### Styling System

CSS Modules for component-scoped styling (`src/styles/components/`):
```
TransactionStatusUI.module.css
TransactionStatusModal.module.css
ConfigStatus.module.css
Header.module.css
```

**Developer Note:** Use inline styles only for dynamic values (progress widths, animation delays, runtime status colors).

## 🔧 Environment Configuration

### Environment Variables

```bash
# Network Configuration
VITE_NETWORK=devnet
VITE_STACKS_API_URL=https://api.platform.hiro.so/v1/ext/1ec08f6d3c031b532aa987f5a0398f37/stacks-blockchain-api
VITE_EXPLORER_URL=https://explorer.stacks.co

# Contract Addresses (Devnet)
VITE_MAIN_HUB_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_MAIN_HUB_CONTRACT_NAME=CineX-project
VITE_CROWDFUNDING_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_CROWDFUNDING_CONTRACT_NAME=crowdfunding-module
VITE_ESCROW_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_ESCROW_CONTRACT_NAME=escrow-module
VITE_REWARDS_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_REWARDS_CONTRACT_NAME=rewards-module
VITE_CO_EP_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_CO_EP_CONTRACT_NAME=Co-EP-rotating-fundings
VITE_VERIFICATION_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_VERIFICATION_CONTRACT_NAME=film-verification-module

# App Configuration
VITE_APP_NAME=CineX
VITE_APP_VERSION=1.0.0
VITE_APP_URL=http://localhost:5173

# Wallet Configuration
VITE_SUPPORTED_WALLETS=hiro,leather,xverse
VITE_WALLET_TIMEOUT=30000
VITE_TRANSACTION_TIMEOUT=180000

# Feature Flags
VITE_FEATURE_CO_EP_POOLS=true
VITE_FEATURE_NFT_REWARDS=true
VITE_FEATURE_FILM_VERIFICATION=true
VITE_FEATURE_ESCROW=true

# Debug Settings
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true
VITE_TX_POLLING_INTERVAL=2000
```

### Network Configuration

```typescript
// src/utils/network.ts
export function getNetwork(): StacksNetwork {
  const networkType = (import.meta.env.VITE_NETWORK || 'testnet') as NetworkType;
  const apiUrl = import.meta.env.VITE_STACKS_API_URL;

  switch (networkType) {
    case 'devnet':
      return {
        ...STACKS_TESTNET,
        coreApiUrl: apiUrl || 'https://api.platform.hiro.so/...',
      };
    case 'testnet':
      return apiUrl ? { ...STACKS_TESTNET, coreApiUrl: apiUrl } : STACKS_TESTNET;
    case 'mainnet':
      return apiUrl ? { ...STACKS_MAINNET, coreApiUrl: apiUrl } : STACKS_MAINNET;
  }
}
```

## 💻 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Build Output
- Production bundle: ~1.3 MB (optimized)
- CSS bundle: ~72 kB
- TypeScript: Zero errors

---

*Last Updated: November 15, 2025*  
*Version: Co-EP Pool Integration Complete*
