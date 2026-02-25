import { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetRewardsConfig,
  useUpdateRewardsConfig,
  useGetCustomerRewardsByPrincipal,
  useAdjustCustomerRewards,
} from '../../hooks/useQueries';
import RecordPurchaseForm from './RecordPurchaseForm';
import { toast } from 'sonner';
import { type CustomerRewards } from '../../backend';
import { Settings, Search, UserCheck } from 'lucide-react';

export default function RewardsManagement() {
  const { data: config, isLoading: configLoading } = useGetRewardsConfig();
  const updateConfig = useUpdateRewardsConfig();
  const lookupRewards = useGetCustomerRewardsByPrincipal();
  const adjustRewards = useAdjustCustomerRewards();

  const [thresholdStr, setThresholdStr] = useState('');
  const [lookupPrincipal, setLookupPrincipal] = useState('');
  const [foundRewards, setFoundRewards] = useState<CustomerRewards | null>(null);
  const [adjustItems, setAdjustItems] = useState('');
  const [adjustTreats, setAdjustTreats] = useState('');

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(thresholdStr, 10);
    if (isNaN(val) || val < 1) {
      toast.error('Threshold must be at least 1.');
      return;
    }
    try {
      await updateConfig.mutateAsync(BigInt(val));
      toast.success(`Rewards threshold updated to ${val} items.`);
      setThresholdStr('');
    } catch {
      toast.error('Failed to update config.');
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    let customer: Principal;
    try {
      customer = Principal.fromText(lookupPrincipal.trim());
    } catch {
      toast.error('Invalid principal ID.');
      return;
    }
    try {
      const rewards = await lookupRewards.mutateAsync(customer);
      setFoundRewards(rewards);
      setAdjustItems(rewards.itemsPurchased.toString());
      setAdjustTreats(rewards.freeTreats.toString());
    } catch {
      toast.error('Failed to look up customer.');
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundRewards) return;
    try {
      await adjustRewards.mutateAsync({
        customer: foundRewards.principal,
        itemsPurchased: BigInt(parseInt(adjustItems, 10) || 0),
        freeTreats: BigInt(parseInt(adjustTreats, 10) || 0),
      });
      toast.success('Customer rewards updated!');
      setFoundRewards(null);
      setLookupPrincipal('');
    } catch {
      toast.error('Failed to adjust rewards.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Config Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-accent" />
          <h3 className="font-display text-lg font-semibold">Rewards Configuration</h3>
        </div>
        {configLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <div className="bg-secondary/50 rounded-lg p-4 mb-4">
            <p className="font-body text-sm text-muted-foreground">
              Current threshold:{' '}
              <span className="font-bold text-foreground">
                {config ? Number(config.itemsPerFreeTreat) : 5} items per free treat
              </span>
            </p>
          </div>
        )}
        <form onSubmit={handleUpdateConfig} className="flex gap-3 items-end">
          <div className="space-y-1.5 flex-1 max-w-xs">
            <Label htmlFor="threshold" className="font-body font-medium">New Threshold</Label>
            <Input
              id="threshold"
              type="number"
              min="1"
              value={thresholdStr}
              onChange={(e) => setThresholdStr(e.target.value)}
              placeholder={config ? Number(config.itemsPerFreeTreat).toString() : '5'}
              className="font-body"
            />
          </div>
          <Button type="submit" disabled={updateConfig.isPending} className="font-body">
            {updateConfig.isPending ? 'Saving…' : 'Update'}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Record Purchase */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Record Purchase</h3>
        <RecordPurchaseForm />
      </div>

      <Separator />

      {/* Customer Lookup */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-accent" />
          <h3 className="font-display text-lg font-semibold">Customer Lookup & Adjust</h3>
        </div>
        <form onSubmit={handleLookup} className="flex gap-3 items-end mb-4">
          <div className="space-y-1.5 flex-1">
            <Label htmlFor="lookup-principal" className="font-body font-medium">Customer Principal ID</Label>
            <Input
              id="lookup-principal"
              value={lookupPrincipal}
              onChange={(e) => setLookupPrincipal(e.target.value)}
              placeholder="e.g. aaaaa-aa"
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" disabled={lookupRewards.isPending} variant="outline" className="font-body gap-1.5">
            <Search className="w-4 h-4" />
            {lookupRewards.isPending ? 'Looking up…' : 'Look Up'}
          </Button>
        </form>

        {foundRewards && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              <span className="font-body font-semibold text-sm">Customer Found</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-body">
              <div className="bg-secondary/50 rounded-md p-3">
                <p className="text-muted-foreground text-xs mb-1">Items Purchased</p>
                <p className="font-bold text-lg">{foundRewards.itemsPurchased.toString()}</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <p className="text-muted-foreground text-xs mb-1">Free Treats</p>
                <p className="font-bold text-lg">{foundRewards.freeTreats.toString()}</p>
              </div>
            </div>
            <form onSubmit={handleAdjust} className="space-y-3">
              <p className="font-body text-sm font-medium text-muted-foreground">Adjust Balance</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="adj-items" className="font-body text-xs">Items Purchased</Label>
                  <Input
                    id="adj-items"
                    type="number"
                    min="0"
                    value={adjustItems}
                    onChange={(e) => setAdjustItems(e.target.value)}
                    className="font-body"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adj-treats" className="font-body text-xs">Free Treats</Label>
                  <Input
                    id="adj-treats"
                    type="number"
                    min="0"
                    value={adjustTreats}
                    onChange={(e) => setAdjustTreats(e.target.value)}
                    className="font-body"
                  />
                </div>
              </div>
              <Button type="submit" disabled={adjustRewards.isPending} size="sm" className="font-body">
                {adjustRewards.isPending ? 'Saving…' : 'Save Adjustments'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
