# Sri Lanka Tourism NFT dApp

A modern, minimalistic NFT dApp that promotes tourism in Sri Lanka by allowing users to mint unique Proof of Visit (POV) NFTs when they visit tourist locations.

## 🚀 Features

### ✅ Core Features
- **Wallet Integration**: Connect to Lace wallet on Cardano pre-prod testnet
- **Real-time Balance**: Display wallet address and ADA balance
- **NFT Minting**: Mint POV NFTs with location metadata
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Toast Notifications**: User feedback for all actions

### 🎨 UI/UX Features
- **Mobile-first Design**: Fully responsive across all devices
- **Smooth Animations**: Framer Motion powered transitions
- **Glass Morphism**: Modern backdrop blur effects
- **Gradient Backgrounds**: Beautiful color schemes
- **Interactive Elements**: Hover effects and micro-interactions

### 📊 Mock Features
- **Leaderboard**: Top users ranked by POV NFT count
- **Marketplace**: Browse and "purchase" POV NFTs
- **Location Selection**: Dropdown to choose tourist locations
- **Rarity System**: Common, Rare, and Epic NFT tiers

## 🛠 Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Blockchain**: Cardano (pre-prod testnet)
- **Wallet**: Lace wallet integration via Mesh SDK
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 🏗 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── WalletConnect.tsx # Wallet connection component
│   ├── MintPOV.tsx       # NFT minting component
│   ├── Leaderboard.tsx   # Leaderboard component
│   └── Marketplace.tsx   # Marketplace component
└── lib/
    └── mesh.ts           # Mesh SDK configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Lace wallet (testnet)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unihack-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=your_blockfrost_preprod_project_id
   NEXT_PUBLIC_NETWORK=preprod
   NEXT_PUBLIC_APP_NAME=Sri Lanka Tourism NFT
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Blockfrost API
1. Sign up at [Blockfrost.io](https://blockfrost.io)
2. Create a pre-prod project
3. Add your project ID to `.env.local`

### Lace Wallet Setup
1. Install Lace wallet extension
2. Switch to pre-prod testnet
3. Add some test ADA to your wallet

## 🎯 Usage

### Connecting Wallet
1. Click "Connect Lace Wallet" button
2. Approve the connection in your wallet
3. View your wallet address and balance

### Minting POV NFTs
1. Ensure wallet is connected
2. Select a tourist location from the dropdown
3. Click "Mint POV NFT"
4. Approve the transaction in your wallet
5. Receive confirmation toast

### Exploring Features
- **Leaderboard**: View top travelers by NFT count
- **Marketplace**: Browse available POV NFTs
- **Features Section**: Learn about the platform

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradients (#8B5CF6 to #3B82F6)
- **Background**: Dark slate with purple accents
- **Text**: White and gray variations
- **Accents**: Green, blue, and yellow for different features

### Animations
- **Page Load**: Staggered fade-in animations
- **Hover Effects**: Scale and color transitions
- **Loading States**: Spinning indicators
- **Toast Notifications**: Slide-in animations

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: Two-column grid
- **Desktop**: Full layout with features section

## 🔮 Future Enhancements

### Planned Features
- [ ] Real Blockfrost API integration
- [ ] Actual NFT minting on Cardano
- [ ] GPS location verification
- [ ] Social features and sharing
- [ ] More tourist locations
- [ ] Advanced rarity system

### Technical Improvements
- [ ] Aiken smart contracts
- [ ] Advanced metadata handling
- [ ] Transaction history
- [ ] Wallet asset display
- [ ] Off-chain data storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Cardano Community**: For blockchain infrastructure
- **Mesh SDK**: For wallet integration
- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations

---

Built with ❤️ for the Cardano ecosystem and Sri Lankan tourism promotion.
