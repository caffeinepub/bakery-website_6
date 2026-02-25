import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCustomerRewards, useGetRewardsConfig, useGetCallerUserProfile } from '../hooks/useQueries';
import RewardsStatus from '../components/rewards/RewardsStatus';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift, LogIn } from 'lucide-react';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';

export default function RewardsPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: rewards, isLoading: rewardsLoading, error: rewardsError } = useGetCustomerRewards();
  const { data: config, isLoading: configLoading } = useGetRewardsConfig();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-accent" />
        </div>
        <p className="font-script text-xl text-accent mb-1">Earn & Enjoy</p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">Rewards Program</h1>
        <p className="font-body text-muted-foreground">
          Buy 5 items, get a free treat — it's our way of saying thank you!
        </p>
      </div>

      {/* Not logged in */}
      {!isAuthenticated && (
        <div className="bg-card rounded-2xl p-8 shadow-warm border border-border text-center">
          <LogIn className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Log In to Track Rewards</h2>
          <p className="font-body text-muted-foreground mb-6 max-w-sm mx-auto">
            Sign in to see your rewards balance, track your progress, and claim your free treats.
          </p>
          <Button onClick={login} disabled={isLoggingIn} size="lg" className="font-body gap-2">
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? 'Logging in…' : 'Log In'}
          </Button>
          <div className="mt-8 bg-secondary/50 rounded-xl p-4">
            <h3 className="font-display text-base font-semibold mb-2">How It Works</h3>
            <ol className="font-body text-sm text-muted-foreground space-y-1.5 text-left list-decimal list-inside">
              <li>Log in with your account</li>
              <li>Make purchases at The Cozy Crumb</li>
              <li>Our staff records your items</li>
              <li>Every 5 items earns you 1 free treat!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Logged in */}
      {isAuthenticated && (
        <>
          {(rewardsLoading || configLoading) ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : rewardsError ? (
            <div className="text-center py-12 text-muted-foreground font-body">
              <p>Unable to load your rewards. Please try again.</p>
            </div>
          ) : rewards && config ? (
            <RewardsStatus
              rewards={rewards}
              config={config}
              userName={userProfile?.name}
            />
          ) : null}
        </>
      )}

      <ProfileSetupModal open={showProfileSetup} />
    </div>
  );
}
