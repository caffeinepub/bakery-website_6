import { useMemo } from 'react';
import { useGetMenuItems } from '../hooks/useQueries';
import { type MenuItem, Category } from '../backend';
import MenuItemCard from '../components/menu/MenuItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Wheat, Croissant, Cake, Coffee } from 'lucide-react';

const categoryOrder = [Category.breads, Category.pastries, Category.cakes, Category.drinks];

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  [Category.breads]: {
    label: 'Breads',
    icon: <Wheat className="w-5 h-5" />,
    description: 'Artisan loaves baked fresh every morning',
  },
  [Category.pastries]: {
    label: 'Pastries',
    icon: <Croissant className="w-5 h-5" />,
    description: 'Flaky, buttery pastries made with love',
  },
  [Category.cakes]: {
    label: 'Cakes & Sweets',
    icon: <Cake className="w-5 h-5" />,
    description: 'Celebration cakes and everyday indulgences',
  },
  [Category.drinks]: {
    label: 'Drinks',
    icon: <Coffee className="w-5 h-5" />,
    description: 'Hot and cold beverages to complement your treat',
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
        <p className="font-script text-xl text-accent mb-1">Fresh & Seasonal</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Our Menu</h1>
        <p className="font-body text-muted-foreground max-w-lg mx-auto">
          Everything is made in-house with locally sourced ingredients. Our menu changes monthly to celebrate the season's best.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-12">
          {[...Array(2)].map((_, si) => (
            <div key={si}>
              <Skeleton className="h-8 w-40 mb-6 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-muted-foreground font-body">
          <p className="text-lg">Unable to load menu right now. Please try again shortly.</p>
        </div>
      )}

      {!isLoading && !error && !hasItems && (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-muted-foreground mb-2">Menu Coming Soon</p>
          <p className="font-body text-muted-foreground">
            We're preparing something delicious. Check back soon!
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
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-accent">
                    {config.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-foreground">{config.label}</h2>
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
