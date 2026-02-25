import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: Category;
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
export interface backendInterface {
    addMenuItem(item: MenuItem): Promise<bigint>;
    adjustCustomerRewards(customer: Principal, itemsPurchased: bigint, freeTreats: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimFreeTreat(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerRewards(): Promise<CustomerRewards>;
    getCustomerRewardsByPrincipal(customer: Principal): Promise<CustomerRewards>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: Category): Promise<Array<MenuItem>>;
    getRewardsConfig(): Promise<RewardsConfig>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    recordPurchase(customer: Principal, itemsCount: bigint): Promise<void>;
    removeMenuItem(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMenuItem(id: bigint, updatedItem: MenuItem): Promise<void>;
    updateRewardsConfig(newItemsPerFreeTreat: bigint): Promise<void>;
}
