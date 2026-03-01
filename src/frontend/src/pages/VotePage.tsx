import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Cookie,
  CupSoda,
  Loader2,
  Lock,
  Star,
  Sword,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  VoteChoice,
  useCastVote,
  useGetVoteResults,
  useHasVoted,
} from "../hooks/useQueries";

// ─── Item Card ────────────────────────────────────────────────────────────────

interface ItemCardProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  side: "shadow" | "silver";
}

function ItemCard({ icon, label, name, side }: ItemCardProps) {
  const isShadow = side === "shadow";
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        isShadow
          ? "border-red-900/40 bg-red-950/30"
          : "border-sky-300/30 bg-sky-100/40"
      }`}
    >
      <span className={isShadow ? "text-red-400" : "text-sky-500"}>{icon}</span>
      <div>
        <p
          className={`text-xs font-body font-semibold uppercase tracking-widest ${isShadow ? "text-red-400/70" : "text-sky-500/80"}`}
        >
          {label}
        </p>
        <p
          className={`font-display text-sm font-bold ${isShadow ? "text-gray-100" : "text-slate-800"}`}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

// ─── Character Battle Card ────────────────────────────────────────────────────

interface CharacterCardProps {
  side: "shadow" | "silver";
  characterName: string;
  tagline: string;
  imageSrc: string;
  dessert: string;
  beverage: string;
  canVote: boolean;
  onVote: () => void;
  isVoting: boolean;
  votePercent: number;
  voteCount: number;
  hasVoted: boolean;
  isLoggedIn: boolean;
}

function CharacterCard({
  side,
  characterName,
  tagline,
  imageSrc,
  dessert,
  beverage,
  canVote,
  onVote,
  isVoting,
  votePercent,
  voteCount,
  hasVoted,
  isLoggedIn,
}: CharacterCardProps) {
  const isShadow = side === "shadow";

  return (
    <motion.div
      initial={{ opacity: 0, x: isShadow ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
        delay: isShadow ? 0.1 : 0.25,
      }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 ${
        isShadow
          ? "border-red-700/50 shadow-neon-red"
          : "border-sky-400/50 shadow-neon-silver"
      }`}
      style={{
        background: isShadow
          ? "linear-gradient(160deg, oklch(0.14 0.04 290) 0%, oklch(0.10 0.06 15) 60%, oklch(0.08 0.03 300) 100%)"
          : "linear-gradient(160deg, oklch(0.90 0.05 230) 0%, oklch(0.95 0.04 210) 60%, oklch(0.88 0.07 205) 100%)",
      }}
    >
      {/* Header glow strip */}
      <div
        className={`h-1 w-full ${isShadow ? "bg-gradient-to-r from-transparent via-red-600 to-transparent" : "bg-gradient-to-r from-transparent via-sky-400 to-transparent"}`}
      />

      {/* Character Badge */}
      <div className="px-6 pt-5 pb-0 flex items-start justify-between">
        <Badge
          variant="outline"
          className={`font-pixel text-xs px-3 py-1 ${
            isShadow
              ? "border-red-600/60 text-red-400 bg-red-950/50"
              : "border-sky-400/60 text-sky-600 bg-sky-100/50"
          }`}
        >
          {isShadow ? "★ SHADOW" : "✦ SILVER"}
        </Badge>
        {hasVoted && (
          <Badge
            className={`font-body text-xs gap-1.5 ${isShadow ? "bg-red-700/80 text-white" : "bg-sky-500/80 text-white"}`}
          >
            <Star className="w-3 h-3" />
            {votePercent.toFixed(1)}%
          </Badge>
        )}
      </div>

      {/* Character Image */}
      <div
        className="relative flex justify-center items-end px-6 pt-2"
        style={{ minHeight: 220 }}
      >
        <motion.img
          src={imageSrc}
          alt={characterName}
          className="object-contain max-h-52 w-auto drop-shadow-2xl"
          whileHover={{ scale: 1.04, rotate: isShadow ? -2 : 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        {/* Glow halo under character */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-8 rounded-full blur-2xl opacity-60 ${
            isShadow ? "bg-red-600" : "bg-sky-400"
          }`}
        />
      </div>

      {/* Character Info */}
      <div className="px-6 pt-4 pb-2">
        <h2
          className={`font-display text-2xl font-black tracking-tight leading-tight ${
            isShadow ? "neon-text-red" : "neon-text-silver"
          }`}
        >
          {characterName}
        </h2>
        <p
          className={`font-body text-sm mt-1 ${isShadow ? "text-gray-400" : "text-slate-500"}`}
        >
          {tagline}
        </p>
      </div>

      {/* Menu Items */}
      <div className="px-6 pb-4 flex flex-col gap-2">
        <ItemCard
          icon={<Cookie className="w-4 h-4" />}
          label="Dessert"
          name={dessert}
          side={side}
        />
        <ItemCard
          icon={<CupSoda className="w-4 h-4" />}
          label="Beverage"
          name={beverage}
          side={side}
        />
      </div>

      {/* Vote Section */}
      <div className="px-6 pb-6 mt-auto">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="login-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-2 text-xs font-body ${isShadow ? "text-gray-500" : "text-slate-400"}`}
            >
              <Lock className="w-3.5 h-3.5" />
              Log in to vote for {characterName.split(" ")[0]}
            </motion.div>
          ) : canVote ? (
            <motion.div
              key="vote-btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={onVote}
                disabled={isVoting}
                className={`w-full font-display text-sm font-bold tracking-wider uppercase transition-all duration-200 ${
                  isShadow
                    ? "bg-red-700 hover:bg-red-600 text-white border border-red-500/50 hover:shadow-neon-red"
                    : "bg-sky-500 hover:bg-sky-400 text-white border border-sky-300/50 hover:shadow-neon-silver"
                }`}
              >
                {isVoting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Casting Vote...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Vote for {characterName.split(" ")[0]}
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="voted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 font-body text-sm font-semibold ${isShadow ? "text-red-400" : "text-sky-500"}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {voteCount.toLocaleString()} vote{voteCount !== 1 ? "s" : ""}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom glow strip */}
      <div
        className={`h-1 w-full ${isShadow ? "bg-gradient-to-r from-transparent via-red-600 to-transparent" : "bg-gradient-to-r from-transparent via-sky-400 to-transparent"}`}
      />
    </motion.div>
  );
}

// ─── VS Divider ────────────────────────────────────────────────────────────────

function VSDivider() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4 md:py-0 z-10">
      <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full blur-lg bg-purple-500/40 scale-150" />
        <div className="relative bg-gradient-to-br from-purple-700 to-purple-900 text-white font-pixel text-xs px-4 py-3 rounded-full border border-purple-500/60 shadow-neon-purple">
          VS
        </div>
      </motion.div>
      <Sword className="w-5 h-5 text-purple-400 opacity-60" />
      <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent" />
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface VoteProgressBarProps {
  shadowPercent: number;
  silverPercent: number;
  totalVotes: number;
}

function VoteProgressBar({
  shadowPercent,
  silverPercent,
  totalVotes,
}: VoteProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="w-full max-w-2xl mx-auto mt-8 px-4"
    >
      <div className="flex items-center justify-between mb-2 font-body text-sm font-semibold">
        <span className="neon-text-red text-xs uppercase tracking-widest">
          Shadow {shadowPercent.toFixed(1)}%
        </span>
        <span className="text-gray-300 font-pixel text-[10px]">
          {totalVotes.toLocaleString()} total votes
        </span>
        <span className="neon-text-silver text-xs uppercase tracking-widest">
          {silverPercent.toFixed(1)}% Silver
        </span>
      </div>
      <div
        className="h-4 rounded-full overflow-hidden flex border border-border/50"
        style={{ background: "oklch(0.15 0.03 270)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${shadowPercent}%` }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="h-full rounded-l-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.35 0.18 15) 0%, oklch(0.52 0.25 25) 100%)",
            boxShadow: "2px 0 12px oklch(0.52 0.25 25 / 0.5)",
          }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${silverPercent}%` }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="h-full rounded-r-full ml-auto"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.68 0.22 210) 0%, oklch(0.82 0.18 200) 100%)",
            boxShadow: "-2px 0 12px oklch(0.82 0.18 200 / 0.5)",
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Vote Page ───────────────────────────────────────────────────────────

export default function VotePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: voteResults, isLoading: resultsLoading } = useGetVoteResults();
  const { data: voted, isLoading: votedLoading } = useHasVoted();
  const castVote = useCastVote();

  const shadowVotes = Number(voteResults?.shadowVotes ?? 0n);
  const silverVotes = Number(voteResults?.silverVotes ?? 0n);
  const totalVotes = Number(voteResults?.totalVotes ?? 0n);

  const shadowPercent = totalVotes > 0 ? (shadowVotes / totalVotes) * 100 : 50;
  const silverPercent = totalVotes > 0 ? (silverVotes / totalVotes) * 100 : 50;

  const hasVotedAlready = voted ?? false;
  const canVote = isLoggedIn && !hasVotedAlready;

  const handleVote = async (choice: VoteChoice) => {
    if (!isLoggedIn) {
      toast.error("Please log in to vote!");
      return;
    }
    try {
      await castVote.mutateAsync(choice);
      toast.success(
        choice === VoteChoice.shadow
          ? "🖤 Voted for Shadow! The Chaos Emerald is yours."
          : "🤍 Voted for Silver! The future looks bright.",
        { duration: 4000 },
      );
    } catch {
      toast.error("Vote failed. Please try again.");
    }
  };

  const isVoting = castVote.isPending;
  const isLoadingData = resultsLoading || votedLoading;

  return (
    <div className="min-h-screen vote-arena-bg">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline pointer-events-none opacity-30 z-0" />

      <div className="relative z-10 container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-5 h-5 text-yellow-400 animate-pulse-glow" />
            <Badge
              variant="outline"
              className="font-pixel text-[9px] px-3 py-1.5 border-purple-500/60 text-purple-300 bg-purple-950/40 tracking-widest"
            >
              LIMITED EVENT
            </Badge>
            <Trophy className="w-5 h-5 text-yellow-400 animate-pulse-glow" />
          </div>
          <h1
            className="font-pixel text-xl md:text-3xl text-white leading-tight mb-2"
            style={{
              textShadow:
                "0 0 30px oklch(0.60 0.26 285 / 0.6), 0 0 60px oklch(0.60 0.26 285 / 0.3)",
            }}
          >
            SHADOW vs SILVER
          </h1>
          <p className="font-display text-sm md:text-base text-gray-300 max-w-lg mx-auto leading-relaxed">
            Two rivals. Two legendary menus. Vote for your champion — the
            winning team's items join the{" "}
            <span className="neon-text-blue">1 Up Bakery</span> menu
            permanently!
          </p>

          {/* Login CTA if not logged in */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-5 inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-purple-500/40 bg-purple-950/30 backdrop-blur-sm"
            >
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="font-body text-sm text-gray-300">
                Log in to cast your vote
              </span>
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-display text-xs uppercase tracking-wider"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </motion.div>
          )}

          {/* Already voted message */}
          {isLoggedIn && hasVotedAlready && !isLoadingData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/40 bg-green-950/30 text-green-400 font-body text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              You voted! Results are live.
            </motion.div>
          )}
        </motion.div>

        {/* Battle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch max-w-4xl mx-auto">
          <CharacterCard
            side="shadow"
            characterName="Shadow the Hedgehog"
            tagline="The Ultimate Life Form. Dark, relentless, unstoppable."
            imageSrc="/assets/generated/shadow-hedgehog.dim_400x500.png"
            dessert="Rocky Road Brownie"
            beverage="Highway Smash Slushie"
            canVote={canVote}
            onVote={() => handleVote(VoteChoice.shadow)}
            isVoting={isVoting}
            votePercent={shadowPercent}
            voteCount={shadowVotes}
            hasVoted={hasVotedAlready}
            isLoggedIn={isLoggedIn}
          />

          <VSDivider />

          <CharacterCard
            side="silver"
            characterName="Silver the Hedgehog"
            tagline="From the future, here to save what matters most."
            imageSrc="/assets/generated/silver-hedgehog.dim_400x500.png"
            dessert="Telekinetic Cake Pops"
            beverage="Future's Soda Pop"
            canVote={canVote}
            onVote={() => handleVote(VoteChoice.silver)}
            isVoting={isVoting}
            votePercent={silverPercent}
            voteCount={silverVotes}
            hasVoted={hasVotedAlready}
            isLoggedIn={isLoggedIn}
          />
        </div>

        {/* Live Results Bar — always visible */}
        <AnimatePresence>
          {!isLoadingData && (
            <VoteProgressBar
              shadowPercent={shadowPercent}
              silverPercent={silverPercent}
              totalVotes={totalVotes}
            />
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {isLoadingData && (
          <div className="flex justify-center mt-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center font-body text-xs text-gray-500 mt-10"
        >
          Votes are tallied live on-chain via Internet Computer. One vote per
          player.
        </motion.p>
      </div>
    </div>
  );
}
