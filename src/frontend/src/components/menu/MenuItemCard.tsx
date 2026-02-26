import { type MenuItem, Category } from '../../backend';
import { Badge } from '@/components/ui/badge';
import { Wheat, Croissant, Cake, Coffee } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; colorClass: string }> = {
  [Category.breads]: { label: 'Breads', icon: <Wheat className="w-3.5 h-3.5" />, colorClass: 'bg-primary/20 text-primary border-primary/30' },
  [Category.pastries]: { label: 'Pastries', icon: <Croissant className="w-3.5 h-3.5" />, colorClass: 'bg-accent/20 text-accent border-accent/30' },
  [Category.cakes]: { label: 'Cakes', icon: <Cake className="w-3.5 h-3.5" />, colorClass: 'bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30' },
  [Category.drinks]: { label: 'Drinks', icon: <Coffee className="w-3.5 h-3.5" />, colorClass: 'bg-primary/20 text-primary border-primary/30' },
};

function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const catKey = Object.values(Category).find(v => v === item.category) ?? Category.breads;
  const config = categoryConfig[catKey] ?? categoryConfig[Category.breads];

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-panel hover:shadow-panel-lg transition-all duration-300 flex flex-col group border border-border hover:neon-border-blue hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-44 bg-secondary overflow-hidden">
        {/* item.image is an optional ExternalBlob; no URL images in this version */}
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl opacity-30">🎮</span>
        </div>
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-body font-bold border ${config.colorClass}`}>
            {config.icon}
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-base font-bold text-foreground mb-1 tracking-wide">{item.name}</h3>
        {item.description && (
          <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 font-medium">{item.description}</p>
        )}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary neon-text-blue">
            {formatPrice(item.price)}
          </span>
          <span className="font-pixel text-xs text-accent neon-text-green">
            +XP
          </span>
        </div>
      </div>
    </div>
  );
}
