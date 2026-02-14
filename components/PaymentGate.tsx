'use client';

import { useState } from 'react';
import { useWalletStore } from '@/lib/store';
import { openSTXTransfer } from '@stacks/connect';
import { STXtoMicroSTX } from 'x402-stacks';
import { toast } from 'sonner';
import { Lock, Zap, Loader2, ExternalLink, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentGateProps {
  contentId: string;
  price: number;
  creatorAddress: string;
  title: string;
  onUnlocked: (content: any) => void;
}

export function PaymentGate({
  contentId,
  price,
  creatorAddress,
  title,
  onUnlocked,
}: PaymentGateProps) {
  const [isPaying, setIsPaying] = useState(false);
  const { address } = useWalletStore();

  const handlePay = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setIsPaying(true);

    try {
      // Step 1: Hit the x402-stacks payment-gated endpoint to get 402 payment requirements
      const x402Response = await fetch(`/api/content/${contentId}`);

      let payTo = creatorAddress;
      let amountMicroSTX = STXtoMicroSTX(price);

      if (x402Response.status === 402) {
        // Parse x402 payment requirements from the 402 response
        const paymentRequired = x402Response.headers.get('payment-required');
        if (paymentRequired) {
          try {
            const requirements = JSON.parse(atob(paymentRequired));
            payTo = requirements.payTo || creatorAddress;
            amountMicroSTX = requirements.maxAmountRequired || amountMicroSTX;
            console.log('[x402] Payment requirements received:', requirements);
          } catch {
            // Fallback: try parsing response body
            const body = await x402Response.json().catch(() => null);
            if (body?.payTo) payTo = body.payTo;
            if (body?.maxAmountRequired) amountMicroSTX = body.maxAmountRequired;
          }
        }
        console.log('[x402] 402 Payment Required — Amount:', amountMicroSTX, 'PayTo:', payTo);
      } else if (x402Response.ok) {
        // Content already accessible (free or already paid)
        const content = await x402Response.json();
        onUnlocked(content);
        setIsPaying(false);
        return;
      }

      // Step 2: Open wallet extension to sign & broadcast STX transfer
      openSTXTransfer({
        recipient: payTo,
        amount: BigInt(amountMicroSTX),
        memo: `PayStream: ${contentId}`,
        network: 'testnet',
        onFinish: async (data) => {
          const txId = data.txId;
          toast.success(`Payment broadcast! Tx: ${txId.slice(0, 12)}...`);

          // Step 3: Verify payment on-chain and unlock content
          try {
            const res = await fetch(`/api/content/${contentId}/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txId, payerAddress: address }),
            });

            if (res.ok) {
              const content = await res.json();
              onUnlocked(content);
            } else {
              toast.info('Payment sent! Content unlocking...');
              const previewRes = await fetch(`/api/content/${contentId}?preview=true`);
              if (previewRes.ok) {
                const preview = await previewRes.json();
                onUnlocked({ ...preview, txId });
              }
            }
          } catch {
            toast.info('Payment sent successfully. Refresh to see your content.');
          }
          setIsPaying(false);
        },
        onCancel: () => {
          toast.error('Payment cancelled');
          setIsPaying(false);
        },
      });
    } catch (error: any) {
      console.error('[PayStream] Payment error:', error);
      toast.error('Failed to initiate payment. Is your wallet extension installed?');
      setIsPaying(false);
    }
  };

  if (!address) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-8 text-center"
      >
        <div className="space-y-5">
          <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-stacks-orange-light" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Premium Content Locked</h3>
            <p className="text-sm text-muted-foreground">
              Connect your Leather or Xverse wallet to unlock this content
            </p>
          </div>
          <ConnectWalletButton />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card lightning-border rounded-xl p-8 text-center"
    >
      <div className="space-y-6">
        <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-glow-pulse">
          <Zap className="w-7 h-7 text-stacks-orange-light" />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
          <p className="text-sm text-muted-foreground">
            Unlock &quot;{title}&quot; with a one-time STX payment
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            One-time Price
          </p>
          <div className="text-4xl font-bold gradient-text-stacks mb-2">
            {price} STX
          </div>
          <p className="text-xs text-muted-foreground">
            Approximately ${(price * 0.15).toFixed(2)} USD*
          </p>
        </div>

        <button
          onClick={handlePay}
          disabled={isPaying}
          className={`btn-stacks w-full h-12 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2 ${isPaying ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isPaying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Confirm in Wallet...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Unlock with {price} STX</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-muted-foreground">
          * Price estimate only. Actual USD value may vary.
        </p>

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-2">
            Need testnet STX?
          </p>
          <a
            href="https://explorer.hiro.so/sandbox/faucet?chain=testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1"
          >
            Get testnet tokens from Stacks faucet
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ConnectWalletButton() {
  const { setAddress } = useWalletStore();

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
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet. Is Leather or Xverse installed?');
    }
  };

  return (
    <button
      onClick={handleConnect}
      className="btn-stacks w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
}
