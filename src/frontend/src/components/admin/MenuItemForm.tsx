import { useState, useEffect } from 'react';
import { type MenuItem, Category } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddMenuItem, useUpdateMenuItem } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface MenuItemFormProps {
  item?: MenuItem | null;
  onClose: () => void;
}

const categoryOptions = [
  { value: Category.breads, label: 'Breads' },
  { value: Category.pastries, label: 'Pastries' },
  { value: Category.cakes, label: 'Cakes' },
  { value: Category.drinks, label: 'Drinks' },
];

export default function MenuItemForm({ item, onClose }: MenuItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [category, setCategory] = useState<Category>(Category.breads);
  const [available, setAvailable] = useState(true);

  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setPriceStr((Number(item.price) / 100).toFixed(2));
      setCategory(item.category as Category);
      setAvailable(item.available);
    } else {
      setName('');
      setDescription('');
      setPriceStr('');
      setCategory(Category.breads);
      setAvailable(true);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!priceStr || parseFloat(priceStr) < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceInCents = BigInt(Math.round(parseFloat(priceStr) * 100));

    // Build item without the optional image field (no URL-based images in this version)
    const menuItem: MenuItem = {
      id: item?.id ?? BigInt(0), // Backend ignores id for addMenuItem
      name: name.trim(),
      description: description.trim(),
      price: priceInCents,
      category,
      available,
      // image field omitted — it's optional (ExternalBlob) and not supported via URL input
    };

    try {
      if (isEditing && item) {
        await updateMenuItem.mutateAsync({ id: item.id, item: menuItem });
        toast.success(`"${name}" updated!`);
      } else {
        const newId = await addMenuItem.mutateAsync(menuItem);
        toast.success(`"${name}" added to the shop! ID: ${newId}`);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      toast.error(`Failed to save item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const isPending = addMenuItem.isPending || updateMenuItem.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="item-name" className="font-body font-semibold tracking-wide">Name *</Label>
          <Input
            id="item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Big Daddy Brownie"
            required
            className="font-body bg-secondary border-border focus:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-price" className="font-body font-semibold tracking-wide">Price (USD) *</Label>
          <Input
            id="item-price"
            type="number"
            step="0.01"
            min="0"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            placeholder="e.g. 4.50"
            required
            className="font-body bg-secondary border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="item-description" className="font-body font-semibold tracking-wide">Description</Label>
        <Textarea
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this item…"
          rows={2}
          className="font-body resize-none bg-secondary border-border focus:border-primary"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="font-body font-semibold tracking-wide">Category *</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger className="font-body bg-secondary border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="font-body">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 py-1">
        <Switch
          id="item-available"
          checked={available}
          onCheckedChange={setAvailable}
        />
        <Label htmlFor="item-available" className="font-body font-semibold cursor-pointer tracking-wide">
          Active in shop
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1 font-body font-bold neon-glow-blue tracking-wide">
          {isPending ? 'Saving…' : isEditing ? 'Update Item' : 'Add Item'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="font-body font-semibold">
          Cancel
        </Button>
      </div>
    </form>
  );
}
