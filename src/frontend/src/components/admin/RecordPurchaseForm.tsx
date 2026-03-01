import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@dfinity/principal";
import { Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRecordPurchase } from "../../hooks/useQueries";

export default function RecordPurchaseForm() {
  const [principalStr, setPrincipalStr] = useState("");
  const [itemCount, setItemCount] = useState("1");
  const recordPurchase = useRecordPurchase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let customer: Principal;
    try {
      customer = Principal.fromText(principalStr.trim());
    } catch {
      toast.error("Invalid principal ID. Please check and try again.");
      return;
    }

    const count = Number.parseInt(itemCount, 10);
    if (Number.isNaN(count) || count < 1) {
      toast.error("Item count must be at least 1.");
      return;
    }

    try {
      await recordPurchase.mutateAsync({ customer, itemsCount: BigInt(count) });
      toast.success(`Recorded ${count} XP for player!`);
      setPrincipalStr("");
      setItemCount("1");
    } catch {
      toast.error("Failed to record XP. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label
          htmlFor="purchase-principal"
          className="font-body font-semibold tracking-wide"
        >
          Player Principal ID *
        </Label>
        <Input
          id="purchase-principal"
          value={principalStr}
          onChange={(e) => setPrincipalStr(e.target.value)}
          placeholder="e.g. aaaaa-aa"
          required
          className="font-mono text-sm bg-secondary border-border focus:border-primary"
        />
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="purchase-count"
          className="font-body font-semibold tracking-wide"
        >
          Number of Items *
        </Label>
        <Input
          id="purchase-count"
          type="number"
          min="1"
          value={itemCount}
          onChange={(e) => setItemCount(e.target.value)}
          required
          className="font-body bg-secondary border-border focus:border-primary"
        />
      </div>
      <Button
        type="submit"
        disabled={recordPurchase.isPending}
        className="w-full font-body font-bold gap-2 neon-glow-blue tracking-wide"
      >
        <Zap className="w-4 h-4" />
        {recordPurchase.isPending ? "Recording…" : "Record XP Purchase"}
      </Button>
    </form>
  );
}
