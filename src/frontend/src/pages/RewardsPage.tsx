import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, Trophy } from "lucide-react";
import ProfileSetupModal from "../components/auth/ProfileSetupModal";
import RewardsStatus from "../components/rewards/RewardsStatus";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetCustomerRewards,
  useGetRewardsConfig,
} from "../hooks/useQueries";

export default function RewardsPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: rewards,
    isLoading: rewardsLoading,
    error: rewardsError,
  } = useGetCustomerRewards();
  const { data: config, isLoading: configLoading } = useGetRewardsConfig();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center mx-auto mb-4 border border-accent/30 neon-glow-green">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
        <p className="font-pixel text-xs text-accent mb-3 neon-text-green">
          — XP TRACKER —
        </p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-3 tracking-wide">
          Rewards & Loot
        </h1>
        <p className="font-body text-muted-foreground font-medium">
          Earn XP with every purchase. Collect 5 items to unlock a free treat —
          your loyalty is legendary!
        </p>
      </div>

      {/* Not logged in */}
      {!isAuthenticated && (
        <div className="bg-card rounded-lg p-8 shadow-panel border neon-border-blue text-center">
          <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2 tracking-wide">
            Log In to Track XP
          </h2>
          <p className="font-body text-muted-foreground mb-6 max-w-sm mx-auto font-medium">
            Sign in to view your XP balance, track your progress, and claim your
            free loot.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="font-body font-bold gap-2 neon-glow-blue tracking-wide"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? "Connecting…" : "Log In"}
          </Button>
          <div className="mt-8 bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="font-display text-base font-bold mb-2 tracking-wide">
              How It Works
            </h3>
            <ol className="font-body text-sm text-muted-foreground space-y-1.5 text-left list-decimal list-inside font-medium">
              <li>Log in with your account</li>
              <li>Make purchases at 1 Up Bakery</li>
              <li>Our staff records your XP</li>
              <li>Every 5 items unlocks 1 free treat!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Logged in */}
      {isAuthenticated &&
        (rewardsLoading || configLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {(["a", "b", "c"] as const).map((k) => (
                <Skeleton key={k} className="h-28 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-24 rounded-lg" />
          </div>
        ) : rewardsError ? (
          <div className="text-center py-12 text-muted-foreground font-body">
            <p className="font-semibold">
              ⚠ Unable to load your XP. Please try again.
            </p>
          </div>
        ) : rewards && config ? (
          <RewardsStatus
            rewards={rewards}
            config={config}
            userName={userProfile?.name}
          />
        ) : null)}

      <ProfileSetupModal open={showProfileSetup} />
    </div>
  );
}
