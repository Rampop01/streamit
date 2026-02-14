#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Premium content data with real Unsplash images
const sampleContent = [
  {
    id: 'sample-1',
    title: 'Mastering Stacks: Build on Bitcoin',
    description:
      'Complete guide to Stacks blockchain development. Learn Clarity smart contracts, Bitcoin settlement, STX tokenomics, and how to deploy your first dApp secured by Bitcoin.',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
    priceInSTX: 5,
    creatorAddress: 'SP2ZNGJ85ENDY6QTHQ1LVQCSLWZ5J6TXW67HQ5M3B',
    creatorName: 'Stacks Academy',
    category: 'Blockchain',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    views: 1247,
  },
  {
    id: 'sample-2',
    title: 'Clarity Smart Contract Masterclass',
    description:
      'Master smart contract programming in Clarity. Build DeFi protocols, NFT marketplaces, and DAOs on Stacks. Includes 12 hands-on projects and code reviews.',
    embedUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    priceInSTX: 10,
    creatorAddress: 'SP1JTCR201ECC6PIZZA3J49GDGCEAHR739J0N7C5E',
    creatorName: 'Code Masters',
    category: 'Development',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    views: 2891,
  },
  {
    id: 'sample-3',
    title: 'DeFi on Bitcoin: The Complete Guide',
    description:
      'Explore decentralized finance on Bitcoin through Stacks. Deep dive into liquidity pools, automated market makers, lending protocols, and yield strategies with real examples.',
    embedUrl: 'https://www.youtube.com/watch?v=aqz5tCsslXE',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=450&fit=crop',
    priceInSTX: 8,
    creatorAddress: 'SPNWZ5W27DJPHTQC25PPGNGNGNJYSDEFSXQ4H5GH',
    creatorName: 'DeFi Guru',
    category: 'Finance',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    views: 3456,
  },
  {
    id: 'sample-4',
    title: 'Bitcoin NFTs: Create, Mint & Trade',
    description:
      'The ultimate guide to NFTs secured by Bitcoin. Learn minting on Stacks, metadata standards, building marketplaces, and the future of Bitcoin-native digital collectibles.',
    embedUrl: 'https://www.youtube.com/watch?v=FIUQIm7JSRE',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop',
    priceInSTX: 7,
    creatorAddress: 'SP3Z5FGZPQXS3J2BQJ5V1G9G9G9G9G9G9G9G9Z5G2',
    creatorName: 'NFT Creator',
    category: 'Art & NFTs',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    views: 1789,
  },
  {
    id: 'sample-5',
    title: 'x402 Payment Protocol Deep Dive',
    description:
      'Master the x402-stacks payment protocol. Build payment-gated APIs, understand HTTP 402, implement the facilitator pattern, and create monetized applications.',
    embedUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    priceInSTX: 12,
    creatorAddress: 'SP123ADVANCED456PAY789X402STACKS123ABC456',
    creatorName: 'Protocol Engineers',
    category: 'Protocol',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    views: 987,
  },
  {
    id: 'sample-6',
    title: 'Web3 Security: Protect Your dApps',
    description:
      'Essential security practices for Stacks developers. Audit smart contracts, prevent common vulnerabilities, secure key management, and build trustworthy decentralized applications.',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    priceInSTX: 15,
    creatorAddress: 'SP2ZNGJ85ENDY6QTHQ1LVQCSLWZ5J6TXW67HQ5M3B',
    creatorName: 'Security Lab',
    category: 'Security',
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    views: 654,
  },
];

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created /data directory');
}

// Write sample content
const contentFile = path.join(dataDir, 'content.json');
fs.writeFileSync(contentFile, JSON.stringify(sampleContent, null, 2));

console.log('Seeded PayStream database with 6 premium content items');
console.log('  Location: /data/content.json');
console.log('');
console.log('Sample content created:');
sampleContent.forEach((item) => {
  console.log(`  - ${item.title} (${item.priceInSTX} STX)`);
});
console.log('');
console.log('Run `npm run dev` to start the development server');
