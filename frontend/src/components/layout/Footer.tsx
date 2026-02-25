import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'bakery-website');

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-2">The Cozy Crumb</h3>
            <p className="font-body text-sm opacity-80 leading-relaxed">
              Handcrafted with love, baked fresh every morning. Come taste the difference.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-base font-semibold mb-2">Hours</h4>
            <ul className="font-body text-sm opacity-80 space-y-1">
              <li>Mon – Fri: 7am – 6pm</li>
              <li>Saturday: 8am – 5pm</li>
              <li>Sunday: 9am – 3pm</li>
            </ul>
          </div>

          {/* Rewards */}
          <div>
            <h4 className="font-display text-base font-semibold mb-2">Rewards Program</h4>
            <p className="font-body text-sm opacity-80 leading-relaxed">
              Every 5 items you buy earns you a free treat. Log in to track your progress!
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-70 font-body">
          <span>© {year} The Cozy Crumb. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 fill-current text-red-300" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-100 transition-opacity"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
