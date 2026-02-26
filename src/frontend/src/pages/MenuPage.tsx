import { useMemo } from 'react';
import { useGetMenuItems } from '../hooks/useQueries';
import { type MenuItem, Category } from '../backend';
import MenuItemCard from '../components/menu/MenuItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Wheat, Croissant, Cake, Coffee } from 'lucide-react';

const categoryOrder = [Category.breads, Category.pastries, Category.cakes, Category.drinks];

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; description: string; color: string }> = {
  [Category.breads]: {
    label: '🍞 Breads',
    icon: <Wheat className="w-5 h-5" />,
    description: 'Artisan loaves — your base stat booster',
    color: 'text-primary',
  },
  [Category.pastries]: {
    label: '🥐 Pastries',
    icon: <Croissant className="w-5 h-5" />,
    description: 'Flaky power-ups crafted for the elite gamer',
    color: 'text-accent',
  },
  [Category.cakes]: {
    label: '🎂 Cakes & Sweets',
    icon: <Cake className="w-5 h-5" />,
    description: 'Boss-level treats and legendary confections',
    color: 'text-gaming-purple',
  },
  [Category.drinks]: {
    label: '☕ Drinks',
    icon: <Coffee className="w-5 h-5" />,
    description: 'Mana potions and stamina restorers',
    color: 'text-primary',
  },
};

export default function MenuPage() {
  const { data: items, isLoading, error } = useGetMenuItems();

  const grouped = useMemo(() => {
    if (!items) return {};
    const available = items.filter((item) => item.available);
    return available.reduce<Record<string, MenuItem[]>>((acc, item) => {
      const key = item.category as string;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  const hasItems = Object.values(grouped).some((arr) => arr.length > 0);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="font-pixel text-xs text-accent mb-3 neon-text-green">— CHOOSE YOUR POWER-UP —</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-wide">
          The Item Shop
        </h1>
        <p className="font-body text-muted-foreground max-w-lg mx-auto font-medium">
          All items are crafted in-house with legendary ingredients. Our menu rotates seasonally — new loot drops every month.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-12">
          {[...Array(2)].map((_, si) => (
            <div key={si}>
              <Skeleton className="h-8 w-40 mb-6 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-muted-foreground font-body">
          <p className="text-lg font-semibold">⚠ Connection Lost. Please try again shortly.</p>
        </div>
      )}

      {!isLoading && !error && !hasItems && (
        <div className="text-center py-20">
          <p className="font-pixel text-sm text-muted-foreground mb-4 neon-text-blue">LOADING...</p>
          <p className="font-display text-2xl text-muted-foreground mb-2 tracking-wide">Item Shop Coming Soon</p>
          <p className="font-body text-muted-foreground">
            New loot is being crafted. Check back soon, adventurer!
          </p>
        </div>
      )}

      {!isLoading && !error && hasItems && (
        <div className="space-y-14">
          {categoryOrder.map((cat) => {
            const catItems = grouped[cat];
            if (!catItems || catItems.length === 0) return null;
            const config = categoryConfig[cat];
            return (
              <section key={cat}>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                  <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center text-primary border border-border">
                    {config.icon}
                  </div>
                  <div>
                    <h2 className={`font-display text-2xl font-bold tracking-wide ${config.color}`}>{config.label}</h2>
                    <p className="font-body text-sm text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catItems.map((item) => (
                    <MenuItemCard key={item.id.toString()} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
