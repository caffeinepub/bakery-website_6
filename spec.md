# 1 Up Bakery - Shadow vs Silver Vote

## Current State
A video game/pop-culture themed bakery site with:
- Menu management (admin can add/edit/remove items)
- Rewards program (every 5 items = free treat)
- Admin panel protected by code 73011
- Light blue/purple/green color theme

## Requested Changes (Diff)

### Add
- A new "Vote" page accessible from the navigation bar
- Two competing candidates: **Shadow the Hedgehog** vs **Silver the Hedgehog**
- Shadow's items: Rocky Road Brownie (dessert) + Highway Smash Slushie (beverage)
- Silver's items: Telekinetic Cake Pops (dessert) + Future's Soda Pop (beverage)
- Each user (logged in) can cast one vote total for either Shadow or Silver
- Live vote count / progress bar showing Shadow vs Silver totals
- Backend: vote storage, castVote function (one vote per principal), getVoteResults query

### Modify
- Navigation bar to include a "Vote" link

### Remove
- Nothing removed

## Implementation Plan
1. Add vote types and state to backend (VoteChoice, VoteResult, castVote, getVoteResults, hasVoted)
2. Create VotePage.tsx with Shadow vs Silver themed voting UI
3. Display each character's two items (dessert + drink) with character art/description
4. Show live vote totals / progress bar after voting
5. Wire backend castVote and getVoteResults to the frontend
6. Add Vote nav link in Navigation.tsx
