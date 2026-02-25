import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type MenuItem, type UserProfile, type CustomerRewards, type RewardsConfig, Category } from '../backend';
import { Principal } from '@dfinity/principal';

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Admin Check ───────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });
}

// ── Menu Items ────────────────────────────────────────────────────────────────

export function useGetMenuItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, item }: { id: bigint; item: MenuItem }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMenuItem(id, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

export function useRemoveMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });
}

// ── Rewards ───────────────────────────────────────────────────────────────────

export function useGetCustomerRewards() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CustomerRewards>({
    queryKey: ['customerRewards'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCustomerRewards();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetRewardsConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RewardsConfig>({
    queryKey: ['rewardsConfig'],
    queryFn: async () => {
      if (!actor) return { itemsPerFreeTreat: BigInt(5) };
      return actor.getRewardsConfig();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateRewardsConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItemsPerFreeTreat: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRewardsConfig(newItemsPerFreeTreat);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardsConfig'] });
    },
  });
}

export function useClaimFreeTreat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimFreeTreat();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerRewards'] });
    },
  });
}

export function useRecordPurchase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customer, itemsCount }: { customer: Principal; itemsCount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordPurchase(customer, itemsCount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerRewards'] });
      queryClient.invalidateQueries({ queryKey: ['customerRewardsByPrincipal'] });
    },
  });
}

export function useGetCustomerRewardsByPrincipal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCustomerRewardsByPrincipal(customer);
    },
  });
}

export function useAdjustCustomerRewards() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customer,
      itemsPurchased,
      freeTreats,
    }: {
      customer: Principal;
      itemsPurchased: bigint;
      freeTreats: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adjustCustomerRewards(customer, itemsPurchased, freeTreats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerRewards'] });
    },
  });
}

export { Category };
