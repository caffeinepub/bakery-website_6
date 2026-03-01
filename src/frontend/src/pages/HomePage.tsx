import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Gamepad2, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Power-Up Pastries",
    desc: "Every item is crafted fresh each morning — legendary recipes that restore your HP and boost your stats.",
    color: "neon-border-blue",
  },
  {
    icon: <Trophy className="w-6 h-6 text-accent" />,
    title: "Earn XP & Loot",
    desc: "Buy 5 items and unlock a free treat! Log in to track your XP, level up, and claim your rewards.",
    color: "neon-border-green",
  },
  {
    icon: <Gamepad2 className="w-6 h-6 text-gaming-purple" />,
    title: "Boss-Level Flavor",
    desc: "From sourdough shields to croissant swords — our bakers are the final boss of flavor. You won't survive without trying one.",
    color: "border-gaming-purple/40",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/gaming-hero-banner.dim_1400x600.png"
            alt="1 Up Bakery — Epic gaming-themed bakery scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/20" />
          <div className="absolute inset-0 scanline pointer-events-none" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-xl">
            <p className="font-pixel text-xs text-accent mb-3 neon-text-green animate-flicker">
              ▶ PLAYER 1 HAS ENTERED
            </p>
            <h1 className="font-pixel text-3xl md:text-4xl text-primary leading-tight mb-4 neon-text-blue">
              1 Up Bakery
            </h1>
            <p className="font-body text-lg text-foreground/85 mb-8 leading-relaxed font-medium">
              Level up your snack game with epic baked goods, power-up pastries,
              and legendary treats. Every bite is a new high score.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="font-body font-bold gap-2 neon-glow-green bg-accent text-accent-foreground hover:bg-accent/90 tracking-wide"
              >
                <Link to="/menu">
                  Unlock the Menu
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-body font-bold neon-border-blue text-primary hover:bg-primary/10 tracking-wide"
              >
                <Link to="/rewards">Collect XP Rewards</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="font-pixel text-xs text-accent mb-3 neon-text-green">
            — SELECT YOUR POWER-UP —
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-wide">
            Why Choose 1 Up Bakery?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className={`bg-card rounded-lg p-6 shadow-panel text-center border ${f.color} hover:shadow-panel-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center mx-auto mb-4 border border-border">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-bold mb-2 tracking-wide">
                {f.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Game Screenshots / Vibe Section */}
      <section className="bg-secondary/30 border-y border-border py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="font-pixel text-xs text-primary mb-3 neon-text-blue">
              — LOADING LEVEL —
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
              Inspired by the Worlds We Love
            </h2>
            <p className="font-body text-muted-foreground mt-2 max-w-lg mx-auto">
              From the neon-drenched depths of Rapture to the pixelated plains
              of the Mushroom Kingdom — our flavors are as legendary as the
              games that inspire them.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "BioShock Special",
                desc: "Would you kindly try our Big Daddy Brownie?",
                color: "border-primary/40",
              },
              {
                label: "Zelda Loaf",
                desc: "It's dangerous to go alone. Take this bread.",
                color: "border-accent/40",
              },
              {
                label: "Mario Mushroom",
                desc: "Super-sized muffins that make you grow.",
                color: "border-gaming-purple/40",
              },
              {
                label: "Halo Ring Cake",
                desc: "Finish the fight — and the whole cake.",
                color: "border-primary/40",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`bg-card rounded-lg p-4 border ${item.color} shadow-panel hover:shadow-panel-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-full h-24 bg-secondary rounded-md mb-3 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h4 className="font-display text-sm font-bold text-foreground mb-1 tracking-wide">
                  {item.label}
                </h4>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-4 py-14 text-center">
          <p className="font-pixel text-xs text-accent mb-3 neon-text-green animate-pulse-glow">
            ★ NEW HIGH SCORE UNLOCKED ★
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-wide">
            Ready to Level Up?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Browse our legendary menu and discover your new favorite power-up.
            Every bite tells an epic story.
          </p>
          <Button
            asChild
            size="lg"
            className="font-body font-bold neon-glow-blue gap-2 tracking-wide"
          >
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
