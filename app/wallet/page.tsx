'use client';

import { Navbar } from '@/components/Navbar';
import { useWalletStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Zap, BookOpen, HelpCircle, ExternalLink, Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function WalletPage() {
  const { address, setAddress, clearWallet } = useWalletStore();

  const handleConnect = async () => {
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
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      const msg = error?.message || String(error);
      toast.error(`Wallet error: ${msg.slice(0, 120)}`);
    }
  };

  const handleDisconnect = () => {
    try {
      import('@stacks/connect').then(({ disconnect }) => disconnect());
    } catch { }
    clearWallet();
    toast.success('Wallet disconnected');
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      <div className="orb orb-orange w-[400px] h-[400px] -top-32 -right-32 opacity-20" />
      <div className="orb orb-amber w-[300px] h-[300px] bottom-0 -left-24 opacity-15" />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Wallet <span className="gradient-text-stacks">Connection</span>
          </h1>
          <p className="text-muted-foreground">
            Connect your Leather or Xverse wallet to start using PayStream
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-card mirror-card rounded-xl p-8">
              {address ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Wallet Connected</h3>
                      <p className="text-xs text-muted-foreground">Ready to make payments</p>
                    </div>
                  </div>

                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Your STX Address</p>
                    <p className="text-sm font-mono text-foreground break-all">{address}</p>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    className="w-full h-11 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Wallet className="w-7 h-7 text-stacks-orange-light" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-sm text-muted-foreground">
                      Use Leather or Xverse browser extension to connect your Stacks wallet
                    </p>
                  </div>
                  <button
                    onClick={handleConnect}
                    className="btn-stacks w-full h-12 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Don&apos;t have a wallet?{' '}
                    <a
                      href="https://leather.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stacks-orange-light hover:text-stacks-amber transition-colors"
                    >
                      Get Leather
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card mirror-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-stacks-orange-light" />
                </div>
                <h3 className="font-semibold text-foreground">How It Works</h3>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">1.</span>
                  Connect your Leather or Xverse wallet
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">2.</span>
                  Get testnet STX tokens from the faucet
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">3.</span>
                  Browse content on the marketplace
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">4.</span>
                  Click unlock &mdash; confirm payment in your wallet
                </li>
              </ol>
            </div>

            <div className="glass-card mirror-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-stacks-amber" />
                </div>
                <h3 className="font-semibold text-foreground">About x402-stacks</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PayStream uses the x402-stacks protocol (HTTP 402 Payment Required) to gate premium content behind STX payments. Your wallet signs transactions securely — no private keys stored in the browser.
              </p>
            </div>

            <div className="glass-card mirror-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-stacks-orange" />
                </div>
                <h3 className="font-semibold text-foreground">Resources</h3>
              </div>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://leather.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1.5"
                  >
                    Download Leather Wallet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://explorer.hiro.so/sandbox/faucet?chain=testnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1.5"
                  >
                    Get Testnet STX
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.stacks.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1.5"
                  >
                    Stacks Documentation
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
