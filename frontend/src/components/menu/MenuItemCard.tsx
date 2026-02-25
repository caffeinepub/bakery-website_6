import { type MenuItem, Category } from '../../backend';
import { Badge } from '@/components/ui/badge';
import { Wheat, Croissant, Cake, Coffee } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  [Category.breads]: { label: 'Breads', icon: <Wheat className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-800' },
  [Category.pastries]: { label: 'Pastries', icon: <Croissant className="w-3.5 h-3.5" />, color: 'bg-orange-100 text-orange-800' },
  [Category.cakes]: { label: 'Cakes', icon: <Cake className="w-3.5 h-3.5" />, color: 'bg-pink-100 text-pink-800' },
  [Category.drinks]: { label: 'Drinks', icon: <Coffee className="w-3.5 h-3.5" />, color: 'bg-brown-100 text-brown-800' },
};

function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const catKey = Object.values(Category).find(v => v === item.category) ?? Category.breads;
  const config = categoryConfig[catKey] ?? categoryConfig[Category.breads];

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-shadow duration-300 flex flex-col group">
      {/* Image */}
      <div className="relative h-44 bg-secondary overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            {config.icon}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-body ${config.color}`}>
            {config.icon}
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{item.name}</h3>
          <span className="font-body font-bold text-accent text-lg whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1">{item.description}</p>
        )}
      </div>
    </div>
  );
}
