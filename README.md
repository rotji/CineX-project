# CineX-project
 This is a decentralized crowdfunding platform for indie filmmakers. It consists of smart contract modules and a React frontend application.

## 📁 Project Structure

- **Smart Contracts** (`/contracts/`) - Clarity smart contracts for the Stacks blockchain
- **Frontend Application** (`/frontend-integration/`) - React + TypeScript + Vite frontend
- **Tests** (`/tests/`) - Comprehensive test suites
- **Documentation** (`/docs/`) - Project documentation and guides

## 🚀 Quick Links

- **[Frontend README](./frontend-integration/README.md)** - Complete frontend documentation with setup instructions
- **[Frontend Developer Guide](./frontend-integration/docs/FRONTEND_GETTING_STARTED.md)** - Quick start guide for new developers

## Smart Contract Modules

### Smart Contract Features/Management Modules
- CineX-project: 
   Main Entry Point or Hub for all of CineX's modules (crowdfunding, rewards, escrow) of the CineX film crowdfunding platform
 => Acts as the center hub for the CineX platform.
 => Manages administrators.
 => Links the crowdfunding, rewards, and escrow modules dynamically (can upgrade them if needed).
;; => Provides read-only access to platform stats (module addresses)

- CineX-rewards-sip09:
  The SIP09 SIP-09 compliant NFT contract for the CineX platform's reward system

- Crowdfunding-module:
  => Manages the funding camapaign processes
- Escrow module:
  => Takes care of secure fund management of campaign funds

- Rewards-module:
 => acts like a "Reward Manager" 
    => collecting minting fees, 
    => ensuring only the right people can give rewards, recording who earned what, 
    => and organizing mass (batch) reward distribution; the actual NFT minting is done separately by the NFT contract.

 ### Traits
 To keep a consistent definition of functions in the modules, the CineX-project also possesses traits that were defined 
 and used/implemented within the different modules, and as much as possible were hardcoded in such way to avoid circular dependency

 They include: crowdfunding-module-traits; escrow-module-trait; rewards-module-trait; rewards-nft-trait (this defines the traits 
 for batch minting of rewards, since the standard sip-09 contract does not define a mint function.

## 🎬 Frontend Application

The CineX frontend is a modern React application built with TypeScript and Vite, featuring:

- **Stacks Wallet Integration**: Connect with Hiro and Xverse wallets
- **Co-EP Pool System**: Revolutionary rotating funding mechanism interface
- **Real-time Balance Display**: Live STX balance and transaction tracking
- **Mobile-Responsive Design**: Optimized for all devices
- **Session Persistence**: Automatic wallet reconnection

### ✅ Current Status - Phase 1 Complete
- [x] Enhanced wallet authentication with Hiro/Xverse support
- [x] Session persistence and automatic reconnection
- [x] Real-time balance display and connection status indicators
- [x] Mobile-responsive design and cross-browser compatibility
- [x] Comprehensive error handling and user feedback

### 🎯 Next Phases (36 tasks remaining)
- Phase 2: Core Contract Integration Setup
- Phase 3: Co-EP Pool Frontend Implementation  
- Phase 4: Mock Transaction Functionality
- Phase 5: User Dashboard & Management
- Phase 6: Advanced UI Components
- Phase 7: Integration Testing & Demo Preparation
- Phase 8: Documentation & Deployment

**👨‍💻 [Start Contributing to Frontend →](./frontend-integration/README.md)**
