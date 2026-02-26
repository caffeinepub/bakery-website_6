import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

module {
  type Category = {
    #breads;
    #pastries;
    #cakes;
    #drinks;
  };

  type OldMenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    available : Bool;
    imageUrl : Text;
  };

  type NewMenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    available : Bool;
    image : ?Storage.ExternalBlob;
  };

  type RewardsConfig = {
    itemsPerFreeTreat : Nat;
  };

  type CustomerRewards = {
    principal : Principal;
    itemsPurchased : Nat;
    freeTreats : Nat;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    menuItems : Map.Map<Nat, OldMenuItem>;
    customerRewards : Map.Map<Principal, CustomerRewards>;
    userProfiles : Map.Map<Principal, UserProfile>;
    rewardsConfig : RewardsConfig;
    nextMenuItemId : Nat;
    accessControlState : AccessControl.AccessControlState;
    globalAdminToken : Text;
  };

  type NewActor = {
    menuItems : Map.Map<Nat, NewMenuItem>;
    customerRewards : Map.Map<Principal, CustomerRewards>;
    userProfiles : Map.Map<Principal, UserProfile>;
    rewardsConfig : RewardsConfig;
    nextMenuItemId : Nat;
    accessControlState : AccessControl.AccessControlState;
    globalAdminToken : Text;
  };

  public func run(old : OldActor) : NewActor {
    let newMenuItems = old.menuItems.map<Nat, OldMenuItem, NewMenuItem>(
      func(_id, oldItem) {
        {
          oldItem with
          image = null;
        };
      }
    );
    { old with menuItems = newMenuItems };
  };
};
