import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  public type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat; // Price in cents
    category : Category;
    available : Bool;
    imageUrl : Text;
  };

  public type Category = {
    #breads;
    #pastries;
    #cakes;
    #drinks;
  };

  module Category {
    public func compare(a : Category, b : Category) : Order.Order {
      switch (a, b) {
        case (#breads, #breads) { #equal };
        case (#pastries, #pastries) { #equal };
        case (#cakes, #cakes) { #equal };
        case (#drinks, #drinks) { #equal };
        case (#breads, _) { #less };
        case (#pastries, #cakes) { #less };
        case (#pastries, #drinks) { #less };
        case (#cakes, #drinks) { #less };
        case (_) { #greater };
      };
    };
  };

  module MenuItem {
    public func compare(a : MenuItem, b : MenuItem) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  public type RewardsConfig = {
    itemsPerFreeTreat : Nat;
  };

  public type CustomerRewards = {
    principal : Principal;
    itemsPurchased : Nat;
    freeTreats : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module CustomerRewards {
    public func compare(a : CustomerRewards, b : CustomerRewards) : Order.Order {
      Nat.compare(a.itemsPurchased, b.itemsPurchased);
    };

    public func compareByFreeTreats(a : CustomerRewards, b : CustomerRewards) : Order.Order {
      Nat.compare(a.freeTreats, b.freeTreats);
    };
  };

  var rewardsConfig : RewardsConfig = {
    itemsPerFreeTreat = 5;
  };

  let menuItems = Map.empty<Nat, MenuItem>();
  let customerRewards = Map.empty<Principal, CustomerRewards>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Admin authentication using Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Blob storage mixin
  include MixinStorage();

  func ensureAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
  };

  func ensureUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  var nextMenuItemId = 1;

  // ── User Profile Functions (required by frontend) ──────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ── Menu Item Functions ────────────────────────────────────────────────────

  public shared ({ caller }) func addMenuItem(item : MenuItem) : async Nat {
    ensureAdmin(caller);

    let newItem = {
      item with
      id = nextMenuItemId;
    };
    menuItems.add(nextMenuItemId, newItem);
    nextMenuItemId += 1;
    newItem.id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, updatedItem : MenuItem) : async () {
    ensureAdmin(caller);

    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.add(id, updatedItem);
  };

  public shared ({ caller }) func removeMenuItem(id : Nat) : async () {
    ensureAdmin(caller);

    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.remove(id);
  };

  // Public: no auth required — anyone can browse the menu
  public query func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort();
  };

  // Public: no auth required — anyone can browse the menu by category
  public query func getMenuItemsByCategory(category : Category) : async [MenuItem] {
    let filtered = menuItems.values().toArray().filter(
      func(item) { item.category == category }
    );
    filtered.sort();
  };

  // ── Rewards Functions ──────────────────────────────────────────────────────

  // Requires authenticated user — guests should not access reward balances
  public query ({ caller }) func getCustomerRewards() : async CustomerRewards {
    ensureUser(caller);

    let callerRewards = customerRewards.get(caller);
    switch (callerRewards) {
      case (null) {
        {
          principal = caller;
          itemsPurchased = 0;
          freeTreats = 0;
        };
      };
      case (?rewards) { rewards };
    };
  };

  // Admin only: look up any customer's rewards by principal
  public query ({ caller }) func getCustomerRewardsByPrincipal(customer : Principal) : async CustomerRewards {
    ensureAdmin(caller);

    switch (customerRewards.get(customer)) {
      case (null) {
        {
          principal = customer;
          itemsPurchased = 0;
          freeTreats = 0;
        };
      };
      case (?rewards) { rewards };
    };
  };

  // Admin only: record a purchase for a customer
  public shared ({ caller }) func recordPurchase(customer : Principal, itemsCount : Nat) : async () {
    ensureAdmin(caller);

    let currentRewards = switch (customerRewards.get(customer)) {
      case (null) {
        {
          principal = customer;
          itemsPurchased = 0;
          freeTreats = 0;
        };
      };
      case (?rewards) { rewards };
    };

    let totalItems = currentRewards.itemsPurchased + itemsCount;
    let newFreeTreats = totalItems / rewardsConfig.itemsPerFreeTreat;
    let remainingItems = totalItems % rewardsConfig.itemsPerFreeTreat;

    let updatedRewards = {
      currentRewards with
      itemsPurchased = remainingItems;
      freeTreats = currentRewards.freeTreats + newFreeTreats;
    };

    customerRewards.add(customer, updatedRewards);
  };

  // Admin only: manually adjust a customer's rewards balance
  public shared ({ caller }) func adjustCustomerRewards(customer : Principal, itemsPurchased : Nat, freeTreats : Nat) : async () {
    ensureAdmin(caller);

    let updatedRewards = {
      principal = customer;
      itemsPurchased = itemsPurchased;
      freeTreats = freeTreats;
    };

    customerRewards.add(customer, updatedRewards);
  };

  // Authenticated users only: claim a free treat from their own balance
  public shared ({ caller }) func claimFreeTreat() : async () {
    ensureUser(caller);

    let currentRewards = switch (customerRewards.get(caller)) {
      case (null) {
        {
          principal = caller;
          itemsPurchased = 0;
          freeTreats = 0;
        };
      };
      case (?rewards) { rewards };
    };

    if (currentRewards.freeTreats == 0) {
      Runtime.trap("No free treats available");
    };

    let updatedRewards = {
      currentRewards with
      freeTreats = currentRewards.freeTreats - 1;
    };

    customerRewards.add(caller, updatedRewards);
  };

  // Admin only: configure the rewards program rule
  public shared ({ caller }) func updateRewardsConfig(newItemsPerFreeTreat : Nat) : async () {
    ensureAdmin(caller);

    rewardsConfig := {
      itemsPerFreeTreat = newItemsPerFreeTreat;
    };
  };

  // Public: anyone can read the rewards configuration
  public query func getRewardsConfig() : async RewardsConfig {
    rewardsConfig;
  };

  // Public: anyone can check whether the caller is an admin
  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
