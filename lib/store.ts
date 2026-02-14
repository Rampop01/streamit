'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WalletState } from './types';

// Zustand store for managing wallet state with localStorage persistence
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      network: 'testnet',
      setAddress: (address) => set({ address }),
      clearWallet: () => set({ address: null }),
    }),
    {
      name: 'paystream-wallet-storage',
    }
  )
);
