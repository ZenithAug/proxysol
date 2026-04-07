import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  const { setPurchased } = useAppStore();

  // Reset state when opened
  useEffect(() => {
    if (isOpen) setPaymentState('pending');
  }, [isOpen]);

  const handleSimulatePayment = () => {
    setPaymentState('listening');
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        setPurchased(tierGb, priceUsd);
        onClose();
        window.scrollTo(0, 0);
      }, 1500);
    }, 2500);
  };

  const solAmount = (priceUsd / 150).toFixed(2); // Mock SOL conversion ($150/SOL)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Purchase {tierGb} GB Proxy Data</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Scan the QR code with your Solana wallet to complete the purchase.
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

              {paymentState === 'listening' ? (
                <div className="flex items-center space-x-2 text-cyan-400 bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-500/20">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Listening for transaction...</span>
                </div>
              ) : (
                <Button 
                  onClick={handleSimulatePayment} 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold mt-4"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Simulate Payment (Dev)
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Payment Received!</h3>
              <p className="text-zinc-400 text-center">
                Your proxies are ready. Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
