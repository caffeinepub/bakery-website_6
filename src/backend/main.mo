import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

// Use explicit migration to support type evolution of menuItems Map
(with migration = Migration.run)
actor {
  include MixinStorage();

  public type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    available : Bool;
    image : ?Storage.ExternalBlob;
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

  let globalAdminToken = "73011";
  var nextMenuItemId = 1;

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.name == "") {
      Runtime.trap("Name cannot be empty");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Menu Item Functions
  public shared ({ caller }) func addMenuItem(item : MenuItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let newItem = {
      item with
      id = nextMenuItemId;
    };
    menuItems.add(nextMenuItemId, newItem);
    nextMenuItemId += 1;
    newItem.id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, updatedItem : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.add(id, updatedItem);
  };

  public shared ({ caller }) func removeMenuItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.remove(id);
  };

  public query func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort();
  };

  public query func getMenuItemsByCategory(category : Category) : async [MenuItem] {
    let filtered = menuItems.values().toArray().filter(
      func(item) { item.category == category }
    );
    filtered.sort();
  };

  public query ({ caller }) func getCustomerRewards() : async CustomerRewards {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };
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

  public query ({ caller }) func getCustomerRewardsByPrincipal(customer : Principal) : async CustomerRewards {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

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

  public shared ({ caller }) func recordPurchase(customer : Principal, itemsCount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

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

  public shared ({ caller }) func adjustCustomerRewards(customer : Principal, itemsPurchased : Nat, freeTreats : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let updatedRewards = {
      principal = customer;
      itemsPurchased = itemsPurchased;
      freeTreats = freeTreats;
    };

    customerRewards.add(customer, updatedRewards);
  };

  public shared ({ caller }) func claimFreeTreat() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim free treats");
    };

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
      freeTreats = Nat.sub(currentRewards.freeTreats, 1);
    };

    customerRewards.add(caller, updatedRewards);
  };

  public shared ({ caller }) func updateRewardsConfig(newItemsPerFreeTreat : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    rewardsConfig := {
      itemsPerFreeTreat = newItemsPerFreeTreat;
    };
  };

  public query func getRewardsConfig() : async RewardsConfig {
    rewardsConfig;
  };

  public shared ({ caller }) func registerAdmin(userProvidedToken : Text) : async () {
    if (userProvidedToken == globalAdminToken) {
      if (caller.isAnonymous()) {
        Runtime.trap("Anonymous users cannot be admins");
      } else {
        accessControlState.userRoles.add(caller, #admin);
      };
    } else {
      Runtime.trap("Invalid admin token");
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (null) { false };
      case (?#admin) { true };
      case (_) { false };
    };
  };
};
