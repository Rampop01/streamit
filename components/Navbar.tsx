'use client';

import Link from 'next/link';
import { useWalletStore } from '@/lib/store';
import { Wallet, Plus, Home, Zap, Menu, X, LogOut, Compass } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function Navbar() {
  const { address, setAddress, clearWallet } = useWalletStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { connect } = await import('@stacks/connect');
      const result = await connect();
      const stxAddress = result.addresses.find(
        (a) => a.symbol === 'STX'
      );
      if (stxAddress) {
        setAddress(stxAddress.address);
        toast.success('Wallet connected!');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect. Install Leather or Xverse wallet.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      import('@stacks/connect').then(({ disconnect }) => disconnect());
    } catch {}
    clearWallet();
    toast.success('Wallet disconnected');
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-stacks-orange to-stacks-amber flex items-center justify-center shadow-lg shadow-stacks-orange/20 group-hover:shadow-stacks-orange/40 transition-shadow duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground group-hover:text-stacks-orange-light transition-colors duration-300">
              PayStream
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>

            <Link href="/explore">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200">
                <Compass className="w-4 h-4" />
                Explore
              </button>
            </Link>

            {address && (
              <Link href="/create">
                <button className="btn-stacks flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
              </Link>
            )}
          </div>

          {/* Wallet + mobile toggle */}
          <div className="flex items-center gap-3">
            {address ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-stacks-orange/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {truncateAddress(address)}
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="btn-outline-glow flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="btn-stacks flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Home</span>
                </div>
              </Link>
              <Link href="/explore" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                  <Compass className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Explore</span>
                </div>
              </Link>
              {address && (
                <Link href="/create" onClick={() => setMobileOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                    <Plus className="w-4 h-4 text-stacks-orange-light" />
                    <span className="text-sm">Create Content</span>
                  </div>
                </Link>
              )}
              {address ? (
                <button
                  onClick={() => { handleDisconnect(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Disconnect Wallet</span>
                </button>
              ) : (
                <button
                  onClick={() => { handleConnect(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Wallet className="w-4 h-4 text-stacks-orange-light" />
                  <span className="text-sm">Connect Wallet</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
