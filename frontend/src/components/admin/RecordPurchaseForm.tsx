import { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRecordPurchase } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

export default function RecordPurchaseForm() {
  const [principalStr, setPrincipalStr] = useState('');
  const [itemCount, setItemCount] = useState('1');
  const recordPurchase = useRecordPurchase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let customer: Principal;
    try {
      customer = Principal.fromText(principalStr.trim());
    } catch {
      toast.error('Invalid principal ID. Please check and try again.');
      return;
    }

    const count = parseInt(itemCount, 10);
    if (isNaN(count) || count < 1) {
      toast.error('Item count must be at least 1.');
      return;
    }

    try {
      await recordPurchase.mutateAsync({ customer, itemsCount: BigInt(count) });
      toast.success(`Recorded ${count} item${count > 1 ? 's' : ''} for customer!`);
      setPrincipalStr('');
      setItemCount('1');
    } catch {
      toast.error('Failed to record purchase. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="purchase-principal" className="font-body font-medium">Customer Principal ID *</Label>
        <Input
          id="purchase-principal"
          value={principalStr}
          onChange={(e) => setPrincipalStr(e.target.value)}
          placeholder="e.g. aaaaa-aa"
          required
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="purchase-count" className="font-body font-medium">Number of Items *</Label>
        <Input
          id="purchase-count"
          type="number"
          min="1"
          value={itemCount}
          onChange={(e) => setItemCount(e.target.value)}
          required
          className="font-body"
        />
      </div>
      <Button type="submit" disabled={recordPurchase.isPending} className="w-full font-body gap-2">
        <ShoppingBag className="w-4 h-4" />
        {recordPurchase.isPending ? 'Recording…' : 'Record Purchase'}
      </Button>
    </form>
  );
}
