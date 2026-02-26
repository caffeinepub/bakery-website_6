import { useState } from 'react';
import { type MenuItem, Category } from '../../backend';
import { useGetMenuItems, useRemoveMenuItem } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import MenuItemForm from './MenuItemForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  [Category.breads]: 'Breads',
  [Category.pastries]: 'Pastries',
  [Category.cakes]: 'Cakes',
  [Category.drinks]: 'Drinks',
};

function formatPrice(cents: bigint): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(cents) / 100);
}

export default function MenuManagement() {
  const { data: items, isLoading } = useGetMenuItems();
  const removeMenuItem = useRemoveMenuItem();
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await removeMenuItem.mutateAsync(deleteId);
      toast.success('Item removed from the Item Shop.');
    } catch {
      toast.error('Failed to remove item.');
    }
    setDeleteId(null);
  };

  const openAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground tracking-wide">Item Shop</h2>
        <Button onClick={openAdd} size="sm" className="font-body font-bold gap-1.5 neon-glow-blue tracking-wide">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {(['sk1', 'sk2', 'sk3', 'sk4'] as const).map((k) => (
            <Skeleton key={k} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-body">
          <p className="text-lg mb-2 font-semibold">No items in the shop yet.</p>
          <p className="text-sm">Click "Add Item" to stock the shelves.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id.toString()}
              className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border hover:border-primary/40 transition-colors"
            >
              {/* image is an optional ExternalBlob — URL display not supported in this view */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body font-bold text-foreground truncate tracking-wide">{item.name}</span>
                  <Badge variant={item.available ? 'default' : 'secondary'} className="text-xs font-body font-semibold">
                    {item.available ? 'Active' : 'Hidden'}
                  </Badge>
                  <span className="text-xs font-body font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                    {categoryLabels[item.category as string] ?? item.category}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground font-body truncate mt-0.5">{item.description}</p>
                )}
              </div>
              <span className="font-display font-bold text-primary whitespace-nowrap neon-text-blue">{formatPrice(item.price)}</span>
              <div className="flex gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteId(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) setShowForm(false); }}>
        <DialogContent className="sm:max-w-lg bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-wide">
              {editItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            item={editItem}
            onClose={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent className="bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display tracking-wide">Remove this item?</AlertDialogTitle>
            <AlertDialogDescription className="font-body font-medium">
              This will permanently remove the item from the shop. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="font-body font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
