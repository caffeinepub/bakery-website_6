import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@dfinity/principal";
import { Search, Settings, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CustomerRewards } from "../../backend";
import {
  useAdjustCustomerRewards,
  useGetCustomerRewardsByPrincipal,
  useGetRewardsConfig,
  useUpdateRewardsConfig,
} from "../../hooks/useQueries";
import RecordPurchaseForm from "./RecordPurchaseForm";

export default function RewardsManagement() {
  const { data: config, isLoading: configLoading } = useGetRewardsConfig();
  const updateConfig = useUpdateRewardsConfig();
  const lookupRewards = useGetCustomerRewardsByPrincipal();
  const adjustRewards = useAdjustCustomerRewards();

  const [thresholdStr, setThresholdStr] = useState("");
  const [lookupPrincipal, setLookupPrincipal] = useState("");
  const [foundRewards, setFoundRewards] = useState<CustomerRewards | null>(
    null,
  );
  const [adjustItems, setAdjustItems] = useState("");
  const [adjustTreats, setAdjustTreats] = useState("");

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number.parseInt(thresholdStr, 10);
    if (Number.isNaN(val) || val < 1) {
      toast.error("Threshold must be at least 1.");
      return;
    }
    try {
      await updateConfig.mutateAsync(BigInt(val));
      toast.success(`XP threshold updated to ${val} items.`);
      setThresholdStr("");
    } catch {
      toast.error("Failed to update config.");
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    let customer: Principal;
    try {
      customer = Principal.fromText(lookupPrincipal.trim());
    } catch {
      toast.error("Invalid principal ID.");
      return;
    }
    try {
      const rewards = await lookupRewards.mutateAsync(customer);
      setFoundRewards(rewards);
      setAdjustItems(rewards.itemsPurchased.toString());
      setAdjustTreats(rewards.freeTreats.toString());
    } catch {
      toast.error("Failed to look up player.");
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundRewards) return;
    try {
      await adjustRewards.mutateAsync({
        customer: foundRewards.principal,
        itemsPurchased: BigInt(Number.parseInt(adjustItems, 10) || 0),
        freeTreats: BigInt(Number.parseInt(adjustTreats, 10) || 0),
      });
      toast.success("Player XP updated!");
      setFoundRewards(null);
      setLookupPrincipal("");
    } catch {
      toast.error("Failed to adjust XP.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Config Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg font-bold tracking-wide">
            XP Configuration
          </h3>
        </div>
        {configLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border">
            <p className="font-body text-sm text-muted-foreground font-medium">
              Current XP threshold:{" "}
              <span className="font-bold text-primary neon-text-blue">
                {config ? Number(config.itemsPerFreeTreat) : 5} items per free
                treat
              </span>
            </p>
          </div>
        )}
        <form onSubmit={handleUpdateConfig} className="flex gap-3 items-end">
          <div className="space-y-1.5 flex-1 max-w-xs">
            <Label
              htmlFor="threshold"
              className="font-body font-semibold tracking-wide"
            >
              New XP Threshold
            </Label>
            <Input
              id="threshold"
              type="number"
              min="1"
              value={thresholdStr}
              onChange={(e) => setThresholdStr(e.target.value)}
              placeholder={
                config ? Number(config.itemsPerFreeTreat).toString() : "5"
              }
              className="font-body bg-secondary border-border focus:border-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={updateConfig.isPending}
            className="font-body font-bold neon-glow-blue tracking-wide"
          >
            {updateConfig.isPending ? "Saving…" : "Update"}
          </Button>
        </form>
      </div>

      <Separator className="bg-border" />

      {/* Record Purchase */}
      <div>
        <h3 className="font-display text-lg font-bold mb-4 tracking-wide">
          Record XP Purchase
        </h3>
        <RecordPurchaseForm />
      </div>

      <Separator className="bg-border" />

      {/* Customer Lookup */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg font-bold tracking-wide">
            Player Lookup & Adjust
          </h3>
        </div>
        <form onSubmit={handleLookup} className="flex gap-3 items-end mb-4">
          <div className="space-y-1.5 flex-1">
            <Label
              htmlFor="lookup-principal"
              className="font-body font-semibold tracking-wide"
            >
              Player Principal ID
            </Label>
            <Input
              id="lookup-principal"
              value={lookupPrincipal}
              onChange={(e) => setLookupPrincipal(e.target.value)}
              placeholder="e.g. aaaaa-aa"
              className="font-mono text-sm bg-secondary border-border focus:border-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={lookupRewards.isPending}
            variant="outline"
            className="font-body font-bold gap-1.5 tracking-wide"
          >
            <Search className="w-4 h-4" />
            {lookupRewards.isPending ? "Searching…" : "Look Up"}
          </Button>
        </form>

        {foundRewards && (
          <div className="bg-card border neon-border-blue rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-primary" />
              <h4 className="font-display text-base font-bold tracking-wide">
                Player Found
              </h4>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-3 break-all">
              {foundRewards.principal.toString()}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm font-body font-medium">
              <span className="text-muted-foreground">
                XP Earned:{" "}
                <strong className="text-foreground">
                  {foundRewards.itemsPurchased.toString()}
                </strong>
              </span>
              <span className="text-muted-foreground">
                Loot Available:{" "}
                <strong className="text-foreground">
                  {foundRewards.freeTreats.toString()}
                </strong>
              </span>
            </div>
            <form onSubmit={handleAdjust} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="adj-items"
                    className="font-body text-xs font-semibold tracking-wide"
                  >
                    XP Earned
                  </Label>
                  <Input
                    id="adj-items"
                    type="number"
                    min="0"
                    value={adjustItems}
                    onChange={(e) => setAdjustItems(e.target.value)}
                    className="font-body h-8 text-sm bg-secondary border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="adj-treats"
                    className="font-body text-xs font-semibold tracking-wide"
                  >
                    Loot Available
                  </Label>
                  <Input
                    id="adj-treats"
                    type="number"
                    min="0"
                    value={adjustTreats}
                    onChange={(e) => setAdjustTreats(e.target.value)}
                    className="font-body h-8 text-sm bg-secondary border-border"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={adjustRewards.isPending}
                size="sm"
                className="font-body font-bold neon-glow-green bg-accent text-accent-foreground hover:bg-accent/90 tracking-wide"
              >
                {adjustRewards.isPending ? "Saving…" : "Save XP Changes"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
