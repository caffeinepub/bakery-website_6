import { type CustomerRewards, type RewardsConfig } from '../../backend';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useClaimFreeTreat } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Gift, ShoppingBag, Star } from 'lucide-react';

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
      toast.success('🎉 Free treat claimed! Enjoy!');
    } catch {
      toast.error('No free treats available to claim.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {userName && (
        <p className="font-script text-2xl text-accent">Hello, {userName}! 👋</p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-warm text-center border border-border">
          <ShoppingBag className="w-7 h-7 text-accent mx-auto mb-2" />
          <p className="font-display text-3xl font-bold text-foreground">{itemsPurchased}</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Items Purchased</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-warm text-center border border-border">
          <Gift className="w-7 h-7 text-accent mx-auto mb-2" />
          <p className="font-display text-3xl font-bold text-foreground">{freeTreats}</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Free Treats Available</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-warm text-center border border-border">
          <Star className="w-7 h-7 text-accent mx-auto mb-2" />
          <p className="font-display text-3xl font-bold text-foreground">{itemsNeeded}</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Items Until Next Treat</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-xl p-5 shadow-warm border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-semibold">Progress to Next Free Treat</h3>
          <span className="font-body text-sm text-muted-foreground">
            {itemsPurchased} / {threshold} items
          </span>
        </div>
        <Progress value={progressPercent} className="h-3 rounded-full" />
        <p className="font-body text-sm text-muted-foreground mt-2">
          {itemsNeeded === 0
            ? '🎉 You\'ve earned a free treat!'
            : `${itemsNeeded} more item${itemsNeeded !== 1 ? 's' : ''} to go!`}
        </p>
      </div>

      {/* Claim Button */}
      {freeTreats > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 text-center">
          <Gift className="w-10 h-10 text-accent mx-auto mb-3" />
          <h3 className="font-display text-xl font-semibold mb-1">
            You have {freeTreats} free treat{freeTreats > 1 ? 's' : ''}!
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Redeem your free treat at the counter. Show this screen to our staff.
          </p>
          <Button
            onClick={handleClaim}
            disabled={claimFreeTreat.isPending}
            className="font-body gap-2"
          >
            <Gift className="w-4 h-4" />
            {claimFreeTreat.isPending ? 'Claiming…' : 'Claim Free Treat'}
          </Button>
        </div>
      )}

      {/* How it works */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <h4 className="font-display text-sm font-semibold mb-2">How It Works</h4>
        <p className="font-body text-sm text-muted-foreground">
          Every time you purchase {threshold} items, you earn 1 free treat. Ask our staff to record your purchase after each visit!
        </p>
      </div>
    </div>
  );
}
