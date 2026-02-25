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
  const [imageUrl, setImageUrl] = useState('');

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
      setImageUrl(item.imageUrl);
    } else {
      setName('');
      setDescription('');
      setPriceStr('');
      setCategory(Category.breads);
      setAvailable(true);
      setImageUrl('');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = BigInt(Math.round(parseFloat(priceStr) * 100));

    const menuItem: MenuItem = {
      id: item?.id ?? BigInt(0),
      name: name.trim(),
      description: description.trim(),
      price: priceInCents,
      category,
      available,
      imageUrl: imageUrl.trim(),
    };

    try {
      if (isEditing && item) {
        await updateMenuItem.mutateAsync({ id: item.id, item: menuItem });
        toast.success(`"${name}" updated successfully!`);
      } else {
        await addMenuItem.mutateAsync(menuItem);
        toast.success(`"${name}" added to the menu!`);
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save item. Please try again.');
    }
  };

  const isPending = addMenuItem.isPending || updateMenuItem.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="item-name" className="font-body font-medium">Name *</Label>
          <Input
            id="item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sourdough Loaf"
            required
            className="font-body"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-price" className="font-body font-medium">Price (USD) *</Label>
          <Input
            id="item-price"
            type="number"
            step="0.01"
            min="0"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            placeholder="e.g. 4.50"
            required
            className="font-body"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="item-description" className="font-body font-medium">Description</Label>
        <Textarea
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this item…"
          rows={2}
          className="font-body resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body font-medium">Category *</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="font-body">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="item-image" className="font-body font-medium">Image URL</Label>
          <Input
            id="item-image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className="font-body"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 py-1">
        <Switch
          id="item-available"
          checked={available}
          onCheckedChange={setAvailable}
        />
        <Label htmlFor="item-available" className="font-body font-medium cursor-pointer">
          Available on menu
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1 font-body">
          {isPending ? 'Saving…' : isEditing ? 'Update Item' : 'Add Item'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="font-body">
          Cancel
        </Button>
      </div>
    </form>
  );
}
