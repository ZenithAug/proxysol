import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Link2, Shield } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

interface AccessDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessDashboardModal({
  isOpen,
  onClose,
}: AccessDashboardModalProps) {
  const { restorePurchase } = useAppStore();
  const [claimInput, setClaimInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setClaimInput('');
    setErrorMessage('');
    setIsSubmitting(false);
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!claimInput.trim()) {
      setErrorMessage('Paste your claim link or access token to open the dashboard.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const restored = await restorePurchase(claimInput);
      if (!restored) {
        setErrorMessage('That claim link could not be found. Check the token and try again.');
        return;
      }

      onClose();
    } catch {
      setErrorMessage('We could not reach the dashboard claim service. Try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Shield className="h-5 w-5 text-cyan-400" />
            Access Existing Dashboard
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Paste the claim link or secure access token you received after payment to recover your dashboard in this browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-sm text-zinc-300">
            Claim links are stored server-side and can be used across browsers or devices. Keep the token private because it unlocks the purchased session.
          </div>

          <div className="space-y-2">
            <label
              htmlFor="claim-token"
              className="text-xs font-mono uppercase tracking-widest text-zinc-500"
            >
              Claim Link or Access Token
            </label>
            <Input
              id="claim-token"
              value={claimInput}
              onChange={(event) => setClaimInput(event.target.value)}
              placeholder="https://your-site/?claim=claim_... or claim_..."
              className="h-12 border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600"
              autoComplete="off"
              spellCheck={false}
            />
            {errorMessage ? (
              <p className="text-sm text-red-400">{errorMessage}</p>
            ) : (
              <p className="text-xs text-zinc-500">
                Full claim links and raw tokens both work here.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-cyan-500 text-black hover:bg-cyan-400"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening dashboard...
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Open Dashboard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
