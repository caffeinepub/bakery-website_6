import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: <Star className="w-6 h-6 text-accent" />,
    title: 'Freshly Baked Daily',
    desc: 'Every item is made from scratch each morning using time-honored recipes and the finest ingredients.',
  },
  {
    icon: <Heart className="w-6 h-6 text-accent" />,
    title: 'Made with Love',
    desc: 'Our bakers pour their heart into every loaf, pastry, and cake — you can taste the difference.',
  },
  {
    icon: <Clock className="w-6 h-6 text-accent" />,
    title: 'Rewards Program',
    desc: 'Buy 5 items and earn a free treat! Log in to track your progress and redeem your rewards.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/bakery-hero-banner.dim_1400x500.png"
            alt="Fresh baked goods at The Cozy Crumb"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-xl">
            <p className="font-script text-2xl text-primary-foreground/90 mb-2">Welcome to</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
              The Cozy Crumb
            </h1>
            <p className="font-body text-lg text-primary-foreground/85 mb-8 leading-relaxed">
              Handcrafted breads, pastries, and cakes baked fresh every morning. Come in, sit down, and let the aroma of warm bread fill your day.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-body gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/menu">
                  View Our Menu
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-body border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/rewards">
                  Rewards Program
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="font-script text-xl text-accent mb-1">Why choose us?</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Baked with Passion
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 shadow-warm text-center border border-border hover:shadow-warm-lg transition-shadow">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">
            Ready to Taste the Difference?
          </h2>
          <p className="font-body text-lg opacity-85 mb-8 max-w-xl mx-auto">
            Browse our seasonal menu and discover your new favorite treat. Every bite tells a story.
          </p>
          <Button asChild size="lg" className="font-body bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
            <Link to="/menu">
              Explore the Menu
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
