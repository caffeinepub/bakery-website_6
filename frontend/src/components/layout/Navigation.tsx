import { Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, ChefHat, ShieldCheck } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/rewards', label: 'Rewards' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/generated/bakery-logo.dim_128x128.png"
            alt="Bakery Logo"
            className="w-10 h-10 rounded-full object-cover shadow-xs"
          />
          <span className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
            The Cozy Crumb
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-md font-body text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{ className: 'px-4 py-2 rounded-md font-body text-sm font-medium text-foreground bg-secondary' }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-md font-body text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
              activeProps={{ className: 'px-4 py-2 rounded-md font-body text-sm font-medium text-foreground bg-secondary flex items-center gap-1.5' }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="font-body"
          >
            {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Log Out' : 'Log In'}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
              className="px-3 py-2.5 rounded-md font-body text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{ className: 'px-3 py-2.5 rounded-md font-body text-sm font-medium text-foreground bg-secondary' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2.5 rounded-md font-body text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
              activeProps={{ className: 'px-3 py-2.5 rounded-md font-body text-sm font-medium text-foreground bg-secondary flex items-center gap-1.5' }}
              onClick={() => setMobileOpen(false)}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
          <div className="pt-2 border-t border-border mt-1">
            <Button
              onClick={() => { handleAuth(); setMobileOpen(false); }}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="w-full font-body"
            >
              {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Log Out' : 'Log In'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
