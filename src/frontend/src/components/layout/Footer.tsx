import { Gamepad2, Heart, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "1up-bakery",
  );

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-5 h-5 text-primary" />
              <h3 className="font-pixel text-xs text-primary neon-text-blue">
                1 Up Bakery
              </h3>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Level up your snack game with epic baked goods, power-up pastries,
              and legendary treats. Player 1 has entered the bakery.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-base font-semibold mb-3 text-primary tracking-wide">
              ⏱ Play Hours
            </h4>
            <ul className="font-body text-sm text-muted-foreground space-y-1">
              <li>Mon – Fri: 7am – 6pm</li>
              <li>Saturday: 8am – 5pm</li>
              <li>Sunday: 9am – 3pm</li>
            </ul>
          </div>

          {/* Rewards */}
          <div>
            <h4 className="font-display text-base font-semibold mb-3 text-accent tracking-wide neon-text-green">
              ⚡ XP Rewards
            </h4>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Earn XP with every visit. Collect 5 items to unlock free loot. Log
              in to track your progress and claim your power-ups!
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © {year} 1 Up Bakery. All rights reserved. Insert coin to continue.
          </p>
          <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-accent fill-accent" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
