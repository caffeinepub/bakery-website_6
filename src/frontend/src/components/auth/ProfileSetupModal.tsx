import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('🎮 Welcome to 1 Up Bakery! Player profile created!');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-card border neon-border-blue" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide">
            🎮 New Player Detected!
          </DialogTitle>
          <DialogDescription className="font-body font-medium">
            Enter your player name to create your XP profile and start earning rewards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-body font-semibold tracking-wide">Player Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GamerChef99"
              className="font-body bg-secondary border-border focus:border-primary"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full font-body font-bold neon-glow-blue tracking-wide"
          >
            {saveProfile.isPending ? 'Creating Profile…' : '▶ Start Playing'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
