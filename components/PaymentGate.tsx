'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/lib/store';
import { openSTXTransfer, connect } from '@stacks/connect';
import { STXtoMicroSTX } from 'x402-stacks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle,
  Lock,
  Zap,
  ExternalLink,
  X,
  Clock,
  Copy,
  Wallet
} from 'lucide-react';

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
  const { address } = useWalletStore();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'idle' | 'fetching402' | 'waitingWallet' | 'broadcasting' | 'verifying' | 'complete' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if current user is the creator
  const isCreator = address === creatorAddress;

  useEffect(() => {
    let mounted = true;
    if (isCreator) {
      // Auto-unlock for creator
      const unlockForCreator = async () => {
        try {
          const res = await fetch(`/api/content/${contentId}?preview=true`);
          if (res.ok && mounted) {
            const data = await res.json();
            onUnlocked(data);
          }
        } catch { }
      };
      unlockForCreator();
    }
    return () => { mounted = false; };
  }, [isCreator, contentId, onUnlocked]);

  const handlePay = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setShowModal(true);
    setStep('fetching402');
    setTxHash(null);
    setErrorMsg(null);

    try {
      // Step 1: Hit the x402-stacks payment-gated endpoint to get 402 payment requirements
      const x402Response = await fetch(`/api/content/${contentId}`);

      let payTo = creatorAddress;
      // Statically imported helper
      let amountMicroSTX: bigint = BigInt(STXtoMicroSTX(price));

      if (x402Response.status === 402) {
        try {
          const body = await x402Response.json();
          if (body?.accepts?.[0]) {
            const accept = body.accepts[0];
            payTo = accept.payTo || creatorAddress;
            amountMicroSTX = BigInt(parseInt(accept.amount)) || amountMicroSTX;
          }
          console.log('[x402] 402 Payment Required — Amount:', amountMicroSTX, 'PayTo:', payTo);
        } catch {
          console.log('[x402] Using fallback payment details');
        }
      } else if (x402Response.ok) {
        const content = await x402Response.json();
        onUnlocked(content);
        setShowModal(false);
        setStep('idle');
        return;
      }

      // Step 2: Open wallet extension to sign & broadcast STX transfer
      setStep('waitingWallet');

      openSTXTransfer({
        recipient: payTo,
        amount: amountMicroSTX,
        memo: `PayStream: ${contentId}`,
        network: 'testnet',
        onFinish: async (data) => {
          const txId = data.txId;
          setTxHash(txId);
          setStep('broadcasting');

          await new Promise((r) => setTimeout(r, 1500));

          // Step 3: Verify payment on-chain and unlock content
          setStep('verifying');

          try {
            const res = await fetch(`/api/content/${contentId}/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txId, payerAddress: address }),
            });

            if (res.ok) {
              const content = await res.json();
              setStep('complete');
              await new Promise((r) => setTimeout(r, 2000));
              onUnlocked(content);
              setShowModal(false);
            } else {
              setStep('complete');
              toast.info('Payment sent! Content unlocking...');
              await new Promise((r) => setTimeout(r, 2000));
              const previewRes = await fetch(`/api/content/${contentId}?preview=true`);
              if (previewRes.ok) {
                const preview = await previewRes.json();
                onUnlocked({ ...preview, txId });
              }
              setShowModal(false);
            }
          } catch {
            setStep('complete');
            toast.info('Payment sent successfully. Refresh to see your content.');
            await new Promise((r) => setTimeout(r, 2000));
            setShowModal(false);
          }
        },
        onCancel: () => {
          setStep('error');
          setErrorMsg('Payment cancelled by user');
        },
      });
    } catch (error: any) {
      console.error('[PayStream] Payment error:', error);
      setStep('error');
      setErrorMsg(error?.message || 'Failed to initiate payment. Is your wallet extension installed?');
    }
  };

  const copyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      toast.success('Transaction hash copied!');
    }
  };

  const closeModal = () => {
    if (step === 'error' || step === 'complete') {
      setShowModal(false);
      setStep('idle');
    }
  };

  if (isCreator) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-8 text-center"
      >
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-green-400 font-semibold">Your Content</p>
            <p className="text-sm text-muted-foreground">Unlocking automatically...</p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

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
    <>
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
              Paid directly to the creator
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={step !== 'idle'}
            className={`btn-stacks w-full h-12 rounded-lg text-white text-lg font-semibold flex items-center justify-center gap-2 ${step !== 'idle' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Zap className="w-5 h-5" />
            <span>Unlock with {price} STX</span>
          </button>

          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground mb-2">Need testnet STX?</p>
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

      {/* Payment Progress Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card rounded-2xl p-8 w-full max-w-md relative"
            >
              {(step === 'error' || step === 'complete') && (
                <button onClick={closeModal} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}

              <h3 className="text-lg font-bold text-center mb-6">Payment Progress</h3>

              <div className="space-y-4">
                <StepItem label="Requesting payment details" sublabel="x402 HTTP 402 protocol" status={step === 'fetching402' ? 'active' : step === 'idle' ? 'pending' : 'done'} />
                <StepItem label="Confirm in wallet" sublabel="Sign STX transfer in Leather/Xverse" status={step === 'waitingWallet' ? 'active' : ['idle', 'fetching402'].includes(step) ? 'pending' : step === 'error' && !txHash ? 'error' : 'done'} />
                <StepItem label="Broadcasting transaction" sublabel="Sending to Stacks blockchain" status={step === 'broadcasting' ? 'active' : ['idle', 'fetching402', 'waitingWallet'].includes(step) ? 'pending' : 'done'} />
                <StepItem label="Verifying on-chain" sublabel="Confirming payment receipt" status={step === 'verifying' ? 'active' : step === 'complete' ? 'done' : 'pending'} />
              </div>

              {txHash && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-3 rounded-lg bg-white/5 border border-border/30">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-stacks-orange-light font-mono flex-1 truncate">{txHash}</code>
                    <button onClick={copyTxHash} className="p-1.5 rounded hover:bg-white/10 transition-colors flex-shrink-0" title="Copy hash">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <a href={`https://explorer.hiro.so/txid/${txHash}?chain=testnet`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-stacks-orange-light/70 hover:text-stacks-orange-light inline-flex items-center gap-1 mt-1.5">
                    View on Stacks Explorer <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </motion.div>
              )}

              {step === 'error' && errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{errorMsg}</p>
                </motion.div>
              )}

              {step === 'complete' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                  <p className="text-sm text-green-400 font-medium">Payment successful! Unlocking content...</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StepItem({ label, sublabel, status }: { label: string; sublabel: string; status: 'pending' | 'active' | 'done' | 'error' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {status === 'active' && (
          <div className="w-8 h-8 rounded-full bg-stacks-orange/20 border border-stacks-orange/40 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-stacks-orange-light animate-spin" />
          </div>
        )}
        {status === 'done' && (
          <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
        )}
        {status === 'pending' && (
          <div className="w-8 h-8 rounded-full bg-white/5 border border-border/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-muted-foreground/50" />
          </div>
        )}
        {status === 'error' && (
          <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <X className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${status === 'active' ? 'text-foreground' : status === 'done' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-muted-foreground/50'}`}>
          {label}
        </p>
        <p className="text-[10px] text-muted-foreground/50 truncate">{sublabel}</p>
      </div>
    </div>
  );
}

function ConnectWalletButton() {
  const { setAddress } = useWalletStore();

  const handleConnect = async () => {
    try {
      const result = await connect();
      const stxAddress = result.addresses.find((a) => a.symbol === 'STX');
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
    <button onClick={handleConnect} className="btn-stacks w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2">
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
}
