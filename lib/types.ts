// Core content data model for PayStream
export type ContentType = 'video' | 'article';

export interface Content {
  id: string;
  title: string;
  description: string;
  contentType: ContentType; // 'video' or 'article'
  embedUrl: string; // YouTube/Vimeo URL (for video) or unused (for article)
  articleBody?: string; // Markdown/text body (for article content)
  thumbnailUrl: string;
  priceInSTX: number; // Price in STX (not microSTX)
  creatorAddress: string;
  creatorName: string;
  category?: string;
  createdAt: number;
  views: number;
}

// Payment record stored after successful transactions
export interface PaymentRecord {
  contentId: string;
  buyerAddress: string;
  txId: string;
  amount: string; // microSTX
  timestamp: number;
}

// Wallet state for the store
export interface WalletState {
  address: string | null;
  network: 'mainnet' | 'testnet';
  setAddress: (address: string) => void;
  clearWallet: () => void;
}
