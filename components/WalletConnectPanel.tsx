'use client';

import { useWalletStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { connect, disconnect } from '@stacks/connect';


export function WalletConnectPanel() {
    const { address, setAddress, clearWallet } = useWalletStore();

    const handleConnect = async () => {
        try {
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
            disconnect();
        } catch { }
        clearWallet();
        toast.success('Wallet disconnected');
    };

    return (
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
    );
}
