import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, Wallet, QrCode } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierGb: number;
  priceUsd: number;
}

export function CheckoutModal({ isOpen, onClose, tierGb, priceUsd }: CheckoutModalProps) {
  const [paymentState, setPaymentState] = useState<'pending' | 'listening' | 'success'>('pending');
  const [walletAddress, setWalletAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const paymentTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);
  const { setPurchased } = useAppStore();

  // Reset state when opened
  useEffect(() => {
    if (!isOpen) return;

    setPaymentState('pending');
    setErrorMessage('');
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (paymentTimerRef.current) window.clearTimeout(paymentTimerRef.current);
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    };
  }, [isOpen]);

  const handleSimulatePayment = () => {
    setErrorMessage('');
    setPaymentState('listening');
    paymentTimerRef.current = window.setTimeout(async () => {
      try {
        await setPurchased(tierGb, priceUsd, walletAddress.trim() || undefined);
        setPaymentState('success');
        redirectTimerRef.current = window.setTimeout(() => {
          onClose();
        }, 1500);
      } catch {
        setPaymentState('pending');
        setErrorMessage('We could not generate your secure dashboard link. Please try the payment again.');
      }
    }, 2500);
  };

  const solAmount = (priceUsd / 150).toFixed(2); // Estimated SOL conversion ($150/SOL)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
          <DialogTitle className="text-xl font-bold">Activate {tierGb} GB Proxy Access</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Confirm the Solana payment to mint credentials, generate a secure claim link, and open the dashboard instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          {paymentState === 'pending' || paymentState === 'listening' ? (
            <>
              <div className="p-4 bg-white rounded-xl shadow-lg ring-4 ring-zinc-800/50 flex items-center justify-center w-[232px] h-[232px]">
                <QrCode className="w-48 h-48 text-zinc-900" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-3xl font-mono text-cyan-400 font-bold">{solAmount} SOL</p>
                <p className="text-sm text-zinc-500">~${priceUsd} USD</p>
              </div>

              <div className="w-full space-y-2">
                <label
                  htmlFor="wallet-address"
                  className="block text-xs font-mono uppercase tracking-widest text-zinc-500"
                >
                  Wallet address for claim
                </label>
                <Input
                  id="wallet-address"
                  value={walletAddress}
                  onChange={(event) => setWalletAddress(event.target.value)}
                  placeholder="Optional: paste buyer wallet address"
                  className="h-11 border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={paymentState === 'listening'}
                />
                <p className="text-xs text-zinc-500">
                  After payment we mint a secure claim link for this dashboard and store it on the server.
                </p>
              </div>

              {errorMessage ? (
                <div className="w-full rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              ) : null}

              {paymentState === 'listening' ? (
                <div className="flex items-center space-x-2 text-cyan-400 bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-500/20">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Confirming payment and minting claim link...</span>
                </div>
              ) : (
                <Button 
                  onClick={handleSimulatePayment} 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold mt-4"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Confirm Solana Payment
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Access Activated</h3>
              <p className="text-zinc-400 text-center">
                Your dashboard is secured with a claim token. Redirecting now...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
