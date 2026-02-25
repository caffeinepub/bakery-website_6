import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin, useGetCallerUserProfile } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import MenuManagement from '../components/admin/MenuManagement';
import RewardsManagement from '../components/admin/RewardsManagement';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';
import { ShieldCheck, UtensilsCrossed, Gift, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPanelPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <ShieldCheck className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-2">Admin Access</h1>
        <p className="font-body text-muted-foreground mb-6">
          Please log in to access the admin panel.
        </p>
        <Button onClick={login} disabled={isLoggingIn} size="lg" className="font-body gap-2">
          <LogIn className="w-4 h-4" />
          {isLoggingIn ? 'Logging in…' : 'Log In'}
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <ShieldCheck className="w-14 h-14 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-2">Access Denied</h1>
        <p className="font-body text-muted-foreground">
          You don't have admin permissions to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Panel</h1>
          {userProfile && (
            <p className="font-body text-sm text-muted-foreground">Welcome back, {userProfile.name}</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="mb-6 font-body">
          <TabsTrigger value="menu" className="gap-1.5 font-body">
            <UtensilsCrossed className="w-4 h-4" />
            Menu Management
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-1.5 font-body">
            <Gift className="w-4 h-4" />
            Rewards Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <div className="bg-card rounded-2xl p-6 shadow-warm border border-border">
            <MenuManagement />
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="bg-card rounded-2xl p-6 shadow-warm border border-border">
            <RewardsManagement />
          </div>
        </TabsContent>
      </Tabs>

      <ProfileSetupModal open={showProfileSetup} />
    </div>
  );
}
