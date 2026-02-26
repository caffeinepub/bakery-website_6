import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/rewards', label: 'XP Rewards' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-panel">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/generated/1up-logo-icon.dim_256x256.png"
            alt="1 Up Bakery Logo"
            className="w-10 h-10 rounded-md object-cover"
          />
          <span className="font-pixel text-sm text-primary group-hover:neon-text-blue transition-colors neon-text-blue">
            1 Up Bakery
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-md font-body text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-secondary transition-colors tracking-wide"
              activeProps={{ className: 'px-4 py-2 rounded-md font-body text-sm font-semibold text-primary bg-secondary tracking-wide neon-border-blue border' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="px-4 py-2 rounded-md font-body text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-secondary transition-colors flex items-center gap-1.5 tracking-wide"
            activeProps={{ className: 'px-4 py-2 rounded-md font-body text-sm font-semibold text-primary bg-secondary flex items-center gap-1.5 tracking-wide neon-border-blue border' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2.5 rounded-md font-body text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-secondary transition-colors tracking-wide"
              activeProps={{ className: 'px-3 py-2.5 rounded-md font-body text-sm font-semibold text-primary bg-secondary tracking-wide' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="px-3 py-2.5 rounded-md font-body text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-secondary transition-colors flex items-center gap-1.5 tracking-wide"
            activeProps={{ className: 'px-3 py-2.5 rounded-md font-body text-sm font-semibold text-primary bg-secondary flex items-center gap-1.5 tracking-wide' }}
            onClick={() => setMobileOpen(false)}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
