import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import {
  AlertCircle,
  KeyRound,
  Loader2,
  ShieldCheck,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import MenuManagement from "../components/admin/MenuManagement";
import RewardsManagement from "../components/admin/RewardsManagement";

const ADMIN_PASSCODE = "73011";

export default function AdminPanelPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Client-side passcode check first
      if (passcode !== ADMIN_PASSCODE) {
        setError("Incorrect passcode. Access denied.");
        setPasscode("");
        return;
      }

      // Wait for actor to be available
      if (!actor) {
        setError(
          "Backend connection unavailable. Please wait a moment and try again.",
        );
        return;
      }

      // Call registerAdmin — backend validates the token and registers the caller
      await actor.registerAdmin(passcode);

      // Confirm the registration took effect by calling isAdmin()
      const confirmed = await actor.isAdmin();
      if (!confirmed) {
        setError(
          "Registration completed but admin status could not be confirmed. Please try again.",
        );
        return;
      }

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Admin registration failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("Invalid token") || message.includes("token")) {
        setError("Incorrect passcode. Access denied.");
      } else {
        setError(`Registration failed: ${message}`);
      }
      setPasscode("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-sm">
        <div className="bg-card border border-border rounded-lg p-8 shadow-panel">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-md flex items-center justify-center border border-primary/40 neon-glow-blue">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl font-bold text-center text-foreground tracking-wide mb-1">
            Admin Access
          </h1>
          <p className="font-body text-sm text-muted-foreground text-center mb-6 font-medium">
            Enter the admin passcode to continue.
          </p>

          {actorFetching ? (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground font-body text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting to backend…</span>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="passcode"
                  className="font-body font-semibold tracking-wide text-foreground"
                >
                  Passcode
                </Label>
                <Input
                  id="passcode"
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError("");
                  }}
                  className="font-body text-center text-lg tracking-widest bg-secondary border-border focus:border-primary"
                  autoFocus
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm font-body font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || passcode.length === 0}
                size="lg"
                className="w-full font-body font-bold tracking-wide neon-glow-blue"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  "▶ Enter Admin Panel"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-md flex items-center justify-center border border-primary/40 neon-glow-blue">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-wide">
            Admin Panel
          </h1>
          <p className="font-body text-sm text-muted-foreground font-medium">
            Welcome back, Admin 🎮
          </p>
        </div>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="mb-6 font-body bg-secondary border border-border">
          <TabsTrigger
            value="menu"
            className="gap-1.5 font-body font-semibold tracking-wide"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Item Shop
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="gap-1.5 font-body font-semibold tracking-wide"
          >
            <Trophy className="w-4 h-4" />
            XP Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <div className="bg-card rounded-lg p-6 shadow-panel border border-border">
            <MenuManagement />
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="bg-card rounded-lg p-6 shadow-panel border border-border">
            <RewardsManagement />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
