# 1 Up Bakery

## Current State
The bakery site has a menu, rewards program, admin panel, and an admin registration flow protected by code 73011. The backend's `registerAdmin` function is broken — it calls `AccessControl.assignRole` which requires the caller to already be an admin, causing a trap for new users. Additionally, `isAdmin` calls `getUserRole` which traps if the user has no role registered yet.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Fix `registerAdmin` so it directly inserts the caller into the `userRoles` map as `#admin` when the correct token is provided, bypassing the `assignRole` admin-only check
- Fix `isAdmin` to safely check the role map without trapping for unregistered users

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend with corrected `registerAdmin` logic: directly set `accessControlState.userRoles.add(caller, #admin)` when token matches, without going through `AccessControl.assignRole`
2. Fix `isAdmin` to use a safe switch on the role map rather than calling `AccessControl.isAdmin` which traps for unregistered users
3. Redeploy

## UX Notes
- The admin code remains 73011
- Multiple users can be registered as admin
- The light blue/purple/green video game theme stays unchanged
