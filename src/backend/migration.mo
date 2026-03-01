import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  public type Category = {
    #breads;
    #pastries;
    #cakes;
    #drinks;
  };

  public type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    available : Bool;
    image : ?Storage.ExternalBlob;
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

  public type VoteChoice = {
    #shadow;
    #silver;
  };

  public type OldActor = {
    menuItems : Map.Map<Nat, MenuItem>;
    customerRewards : Map.Map<Principal, CustomerRewards>;
    userProfiles : Map.Map<Principal, UserProfile>;
    rewardsConfig : RewardsConfig;
    nextMenuItemId : Nat;
    globalAdminToken : Text;
  };

  public type NewActor = {
    menuItems : Map.Map<Nat, MenuItem>;
    customerRewards : Map.Map<Principal, CustomerRewards>;
    userProfiles : Map.Map<Principal, UserProfile>;
    rewardsConfig : RewardsConfig;
    votes : Map.Map<Principal, VoteChoice>;
    nextMenuItemId : Nat;
    globalAdminToken : Text;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      votes = Map.empty<Principal, VoteChoice>();
    };
  };
};
