import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VoteResults {
    totalVotes: bigint;
    shadowVotes: bigint;
    silverVotes: bigint;
}
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    category: Category;
    image?: ExternalBlob;
    price: bigint;
}
export interface RewardsConfig {
    itemsPerFreeTreat: bigint;
}
export interface CustomerRewards {
    freeTreats: bigint;
    principal: Principal;
    itemsPurchased: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    breads = "breads",
    cakes = "cakes",
    pastries = "pastries",
    drinks = "drinks"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VoteChoice {
    shadow = "shadow",
    silver = "silver"
}
export interface backendInterface {
    addMenuItem(item: MenuItem): Promise<bigint>;
    adjustCustomerRewards(customer: Principal, itemsPurchased: bigint, freeTreats: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    castVote(choice: VoteChoice): Promise<void>;
    claimFreeTreat(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerRewards(): Promise<CustomerRewards>;
    getCustomerRewardsByPrincipal(customer: Principal): Promise<CustomerRewards>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: Category): Promise<Array<MenuItem>>;
    getRewardsConfig(): Promise<RewardsConfig>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVoteResults(): Promise<VoteResults>;
    hasVoted(): Promise<boolean>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    recordPurchase(customer: Principal, itemsCount: bigint): Promise<void>;
    registerAdmin(userProvidedToken: string): Promise<void>;
    removeMenuItem(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMenuItem(id: bigint, updatedItem: MenuItem): Promise<void>;
    updateRewardsConfig(newItemsPerFreeTreat: bigint): Promise<void>;
}
