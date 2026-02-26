import { type CustomerRewards, type RewardsConfig } from '../../backend';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useClaimFreeTreat } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Trophy, Zap, Star } from 'lucide-react';

interface RewardsStatusProps {
  rewards: CustomerRewards;
  config: RewardsConfig;
  userName?: string;
}

export default function RewardsStatus({ rewards, config, userName }: RewardsStatusProps) {
  const claimFreeTreat = useClaimFreeTreat();
  const threshold = Number(config.itemsPerFreeTreat);
  const itemsPurchased = Number(rewards.itemsPurchased);
  const freeTreats = Number(rewards.freeTreats);
  const progressPercent = threshold > 0 ? Math.min((itemsPurchased / threshold) * 100, 100) : 0;
  const itemsNeeded = Math.max(threshold - itemsPurchased, 0);

  const handleClaim = async () => {
    try {
      await claimFreeTreat.mutateAsync();
      toast.success('🎮 Loot claimed! Enjoy your free treat!');
    } catch {
      toast.error('No loot available to claim.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {userName && (
        <p className="font-pixel text-xs text-primary neon-text-blue">
          ▶ PLAYER: {userName.toUpperCase()}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-5 shadow-panel text-center border neon-border-blue">
          <Zap className="w-7 h-7 text-primary mx-auto mb-2" />
          <p className="font-display text-3xl font-bold text-foreground">{itemsPurchased}</p>
          <p className="font-body text-sm text-muted-foreground mt-1 font-semibold">XP Earned</p>
        </div>
        <div className="bg-card rounded-lg p-5 shadow-panel text-center border neon-border-green">
          <Trophy className="w-7 h-7 text-accent mx-auto mb-2" />
          <p className="font-display text-3xl font-bold text-foreground">{freeTreats}</p>
          <p className="font-body text-sm text-muted-foreground mt-1 font-semibold">Loot Unlocked</p>
        </div>
        <div className="bg-card rounded-lg p-5 shadow-panel text-center border border-border">
          <Star className="w-7 h-7 text-primary mx-auto mb-2" />
          <p className="font-display text-3xl font-bold text-foreground">{itemsNeeded}</p>
          <p className="font-body text-sm text-muted-foreground mt-1 font-semibold">XP to Next Loot</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-lg p-5 shadow-panel border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold tracking-wide">Progress to Next Loot Drop</h3>
          <span className="font-body text-sm text-muted-foreground font-semibold">
            {itemsPurchased} / {threshold} XP
          </span>
        </div>
        <Progress value={progressPercent} className="h-3 rounded-full" />
        <p className="font-body text-sm text-muted-foreground mt-2 font-medium">
          {itemsNeeded === 0
            ? '🎮 Loot drop ready! Claim your reward!'
            : `${itemsNeeded} more XP to unlock your next free treat!`}
        </p>
      </div>

      {/* Claim Button */}
      {freeTreats > 0 && (
        <div className="bg-accent/10 border neon-border-green rounded-lg p-5 text-center">
          <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold mb-1 tracking-wide">
            🎉 {freeTreats} Free Treat{freeTreats > 1 ? 's' : ''} Ready!
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-4 font-medium">
            Show this screen to our staff to redeem your loot at the counter.
          </p>
          <Button
            onClick={handleClaim}
            disabled={claimFreeTreat.isPending}
            className="font-body font-bold gap-2 neon-glow-green bg-accent text-accent-foreground hover:bg-accent/90 tracking-wide"
          >
            <Trophy className="w-4 h-4" />
            {claimFreeTreat.isPending ? 'Claiming…' : 'Claim Loot'}
          </Button>
        </div>
      )}

      {/* How it works */}
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h4 className="font-display text-sm font-bold mb-2 tracking-wide">⚡ How XP Works</h4>
        <p className="font-body text-sm text-muted-foreground font-medium">
          Every time you purchase {threshold} items, you earn 1 free treat. Ask our staff to record your XP after each visit!
        </p>
      </div>
    </div>
  );
}
