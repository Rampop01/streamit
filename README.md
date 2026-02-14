# PayStream - Premium Content Monetization with x402-stacks

A production-ready content monetization platform leveraging the x402-stacks payment protocol for instant STX payments on the Stacks blockchain.

## Features

- **Wallet Management**: Import or generate Stacks wallets with testnet support
- **Content Discovery**: Browse premium content from creators
- **x402 Payment Integration**: Automatic STX payment handling with zero configuration
- **Content Creation**: Create and publish premium content with custom pricing
- **Video Support**: YouTube and Vimeo video embedding
- **Responsive Design**: Mobile-first design with Tailwind CSS and shadcn/ui

## Tech Stack

### Core
- **Next.js 16** with App Router and TypeScript
- **React 19.2** with React Hook Form and Zod validation
- **Tailwind CSS 3.4** for styling
- **shadcn/ui** for beautiful UI components

### x402-stacks Integration
- **x402-stacks@2.0.1** - Payment protocol and transaction handling
- **axios** - HTTP client with automatic payment interceptors
- **Zustand** - State management for wallet persistence

### Data & Forms
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **sonner** - Toast notifications

## Getting Started

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd paystream
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   The default values should work for local development:
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
   - `FACILITATOR_URL=https://x402-backend-7eby.onrender.com`
   - `NEXT_PUBLIC_NETWORK=testnet`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting Testnet STX

To test the payment functionality, you need testnet STX tokens:

1. Visit the [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. Either generate a new wallet in PayStream or import your private key
3. Copy your wallet address and request tokens from the faucet
4. Tokens arrive in ~1-2 minutes

## How It Works

### The x402-stacks Payment Flow (Facilitator Pattern)

```
1. User clicks "Unlock Content" button
   ↓
2. Client sends request to /api/content/[id]
   ↓
3. Server requires payment, responds with 402 status
   ↓
4. axios interceptor automatically:
   - Extracts payment details from 402 response
   - Signs the STX transaction locally (private key never leaves browser)
   - Retries request with signed transaction header
   ↓
5. Server verifies signature and sends to facilitator
   ↓
6. Facilitator broadcasts transaction on Stacks blockchain
   ↓
7. After confirmation, server returns unlocked content
   ↓
8. Video player appears, user owns content forever
```

### Key Security Properties

- **Client-side signing**: Private key never sent to server
- **Facilitator pattern**: Server doesn't broadcast transactions directly
- **Atomic payments**: Either payment succeeds or content isn't accessed
- **Blockchain verification**: All transactions confirmed on Stacks

## Project Structure

```
/app
├── page.tsx                 # Home/discovery page
├── /wallet/page.tsx         # Wallet setup page
├── /create/page.tsx         # Content creation page
├── /content/[id]/page.tsx   # Content detail & payment
├── /api
│   └── /content
│       ├── route.ts         # GET all, POST new content
│       └── /[id]/route.ts   # GET with payment gate
└── /layout.tsx              # Root layout with dark theme

/components
├── Navbar.tsx               # Navigation with wallet status
├── WalletSetup.tsx          # Wallet import/generation
├── PaymentGate.tsx          # x402 payment UI
├── ContentCard.tsx          # Content preview card
├── CreateContentForm.tsx    # Content creation form
├── VideoPlayer.tsx          # YouTube/Vimeo player
└── /ui/*                    # shadcn/ui components

/lib
├── types.ts                 # TypeScript interfaces
├── store.ts                 # Zustand wallet store
├── db.ts                    # JSON file database
└── x402-client.ts           # x402 axios client factory

/hooks
├── useX402Client.ts         # Hook for payment-enabled axios
├── useContent.ts            # Content fetching hooks
└── use-mobile.tsx           # Responsive design hook

/data
└── content.json             # Content database (auto-created)
```

## Creating Content

1. **Connect your wallet** on the Wallet page
2. **Navigate to Create** → Click the "Create" button in the navbar
3. **Fill in content details**:
   - Title (5-100 characters)
   - Description (20-1000 characters)
   - Video URL (YouTube or Vimeo)
   - Thumbnail URL (image for preview)
   - Price in STX (must be > 0)
   - Creator name
   - Category (optional)
4. **Submit** → Content appears immediately on discover page

## Testing Content Purchases

1. **Create content** with a test price (e.g., 1 STX)
2. **Ensure you have testnet STX** from the faucet
3. **Navigate to the content** and click "Unlock"
4. **Authorize payment** when prompted
5. **Watch the video player** appear with your purchased content

## API Endpoints

### GET `/api/content`
Get all published content. No authentication required.

**Response:**
```json
[
  {
    "id": "abc123",
    "title": "My Video",
    "description": "...",
    "embedUrl": "https://youtube.com/...",
    "thumbnailUrl": "https://...",
    "priceInSTX": 10,
    "creatorAddress": "SP...",
    "creatorName": "Creator",
    "category": "Education",
    "createdAt": 1234567890,
    "views": 42
  }
]
```

### POST `/api/content`
Create new content. No authentication (in demo), but includes creator address.

**Request:**
```json
{
  "title": "My Video",
  "description": "Description...",
  "embedUrl": "https://youtube.com/watch?v=...",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "priceInSTX": 10,
  "creatorAddress": "SP...",
  "creatorName": "Creator Name",
  "category": "Education"
}
```

### GET `/api/content/[id]`
Get content with payment protection. Returns 402 if payment required.

**Flow:**
1. First request → 402 response with payment details
2. Client signs transaction and retries with header
3. Second request → 200 with unlocked content

**Unlocked Response:**
```json
{
  "...content": "...",
  "embedUrl": "https://youtube.com/...",
  "paidBy": "SP...",
  "txId": "0x..."
}
```

## Customization

### Changing Theme Colors

Edit `/app/globals.css`:

```css
:root {
  --primary: 259 84% 52%;      /* Purple */
  --secondary: 200 80% 48%;    /* Blue */
  --accent: 259 84% 52%;       /* Purple */
  /* ... */
}
```

### Changing Facilitator URL

For production, update `.env.local`:

```
FACILITATOR_URL=https://your-facilitator.com
```

### Using Mainnet

Change `.env.local`:

```
NEXT_PUBLIC_NETWORK=mainnet
```

Note: Mainnet requires real STX tokens.

## Deployment

### Deploy to Vercel

The easiest way to deploy is with [Vercel](https://vercel.com):

```bash
vercel deploy
```

Set environment variables in Vercel Dashboard under Project Settings → Environment Variables.

### Build for Production

```bash
npm run build
npm start
```

## Error Handling

The app handles these common cases:

- **No wallet connected**: Shows wallet setup prompt
- **Insufficient balance**: Links to testnet faucet
- **Network errors**: Friendly error messages with retry
- **Invalid content ID**: 404 page with back button
- **Payment failed**: Error toast with specific reason
- **Facilitator timeout**: Shows status and retry option

## Development Notes

- Content is stored in `/data/content.json` (auto-created)
- Wallet private keys are stored in browser localStorage via Zustand (testnet only)
- Never store private keys in real apps without proper encryption
- All timestamps are Unix milliseconds
- Prices are in STX (not microSTX) for user-facing displays
- API converts STX → microSTX internally (1 STX = 1,000,000 microSTX)

## Testing Checklist

Before deploying:

- [ ] Generate new wallet
- [ ] Import existing wallet with private key
- [ ] View wallet address and balance
- [ ] Create content with valid form
- [ ] View content on discovery page
- [ ] Click content card to detail page
- [ ] Payment gate displays correct price
- [ ] Complete STX payment
- [ ] Video unlocks after payment
- [ ] Transaction ID displays
- [ ] Mobile responsive layout
- [ ] Error messages appear appropriately
- [ ] Disconnect wallet and reconnect

## Troubleshooting

### "Invalid private key" error
- Ensure the key is in hex format (64 characters)
- Keys generated in PayStream are automatically valid

### Payment times out
- Check network connectivity
- Ensure you have sufficient testnet STX
- Verify facilitator URL in .env.local is correct

### Content not appearing
- Refresh the page
- Check browser console for errors
- Verify content JSON is valid in `/data/content.json`

### Video won't play
- Verify YouTube/Vimeo URL is public and not region-restricted
- Check that the URL is directly shareable

## Resources

- [x402-stacks Documentation](https://github.com/x402-stacks/docs)
- [Stacks Blockchain](https://www.stacks.co/)
- [Stacks Documentation](https://docs.stacks.co/)
- [Bitcoin Settlement Layer](https://www.bitcoinl1.com/)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or pull request.

## Support

For issues and questions:
- GitHub Issues: [Open issue](https://github.com/yourusername/paystream/issues)
- Stacks Community: [Discord](https://discord.gg/stacks)

---

Built with love for the x402 Stacks Challenge Hackathon.
