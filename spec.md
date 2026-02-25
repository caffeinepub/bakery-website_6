# Specification

## Summary
**Goal:** Build a full-featured bakery website for "Sweet Crumbs Bakery" with a public-facing site, admin panel, and customer rewards program on the Internet Computer.

**Planned changes:**
- Apply a warm artisan bakery visual theme (creams, tans, browns, terracotta) with handcrafted-style typography across all pages
- Create a public homepage with hero banner, navigation bar (linking to Menu and Rewards), and a brief bakery description
- Build a public Menu page at `/menu` showing available items grouped by category (name, description, price)
- Build a public Rewards page at `/rewards` where authenticated users can view their rewards status and progress toward the next free treat; unauthenticated users see a login prompt
- Implement Internet Identity authentication; a configurable admin principal unlocks the Admin Panel
- Build an Admin Panel for managing menu items (add, edit, toggle availability, delete) with changes reflected immediately on the public menu
- Add a Rewards admin section to configure the items-per-free-treat threshold and manually adjust customer rewards balances
- Add a "Record Purchase" form in the admin panel to credit a customer's rewards by principal and item count
- Implement backend data model for menu items (id, name, description, price, category, isAvailable, imageUrl) with full CRUD
- Implement backend rewards tracking (principal, totalItemsPurchased, freeTreeatsAvailable) with configurable threshold (default 5), purchase recording, and free treat redemption
- All backend logic in a single Motoko actor; data persisted in stable storage
- Serve hero banner and logo images from `frontend/public/assets/generated`

**User-visible outcome:** Visitors can browse the bakery menu and check their rewards status; an authenticated admin can manage menu items, configure the rewards program, record customer purchases, and manually adjust rewards balances.
