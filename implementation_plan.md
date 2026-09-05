# VYNTRO — Custom Gaming Deskmat E-Commerce Store

Full-stack build of a premium dark-themed gaming deskmat e-commerce store using Next.js App Router, Supabase, and GSAP. Two surfaces: a public storefront and a private admin panel.

---

## Architecture Overview

```
VYNTRO Gaming Store/
├── app/
│   ├── (storefront)/
│   │   ├── page.js                    # Home page
│   │   ├── shop/page.js               # Shop listing
│   │   ├── shop/[category]/page.js    # Category listing
│   │   ├── product/[slug]/page.js     # Product Detail Page
│   │   ├── cart/page.js               # Cart page
│   │   ├── checkout/page.js           # Checkout form
│   │   └── order-confirmation/page.js # Post-order page
│   ├── admin/
│   │   ├── login/page.js              # Admin login
│   │   ├── page.js                    # Dashboard
│   │   ├── orders/page.js             # Orders list
│   │   ├── orders/[id]/page.js        # Order detail drawer
│   │   ├── products/page.js           # Product list
│   │   ├── products/new/page.js       # Add product
│   │   └── products/[id]/edit/page.js # Edit product
│   └── api/
│       ├── orders/route.js            # POST create order
│       ├── orders/[id]/route.js       # PATCH update status
│       └── products/route.js          # Product CRUD endpoints
├── components/
│   ├── storefront/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── CategoryStrip.js
│   │   ├── CategoryGrid.js
│   │   ├── PromoBanner.js
│   │   ├── BestSellers.js
│   │   ├── TrustBadges.js
│   │   ├── Newsletter.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   └── CartDrawer.js
│   └── admin/
│       ├── AdminNav.js
│       ├── StatCard.js
│       ├── OrdersTable.js
│       └── ProductForm.js
├── lib/
│   ├── supabase.js                    # Supabase client
│   ├── supabaseAdmin.js               # Server-side admin client
│   └── cartStore.js                   # Zustand cart store
├── styles/
│   └── globals.css
└── public/
    └── placeholders/                  # Placeholder images
```

---

## Tech Stack Confirmed

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), JavaScript |
| Animation | GSAP + ScrollTrigger |
| Database | Supabase (Postgres + Auth + Storage) |
| Cart State | Zustand (client-side, localStorage persist) |
| Email | Resend API |
| Hosting | Vercel |

---

## Open Questions

> [!IMPORTANT]
> **Supabase Project:** You'll need to provide your Supabase `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` after project creation. I'll add placeholder env vars and provide the SQL schema to run.

> [!IMPORTANT]
> **Resend API Key:** You'll need a Resend account and API key for order confirmation emails. I'll wire the integration with a placeholder key.

> [!NOTE]
> **Domain:** Left open per PRD §9. Footer/email sender will use `vyntro.com` as placeholder — easy to swap.

---

## Proposed Changes

### Phase 1 — Frontend (Storefront)

#### [NEW] Next.js project scaffold
- `npx create-next-app@latest` with App Router, JavaScript, no TypeScript, Tailwind disabled (using custom CSS)
- Install deps: `gsap`, `@supabase/supabase-js`, `zustand`, `resend`

#### [NEW] Design System — `styles/globals.css`
- CSS custom properties for the full color palette (`#0A0A0C`, `#131316`, `#D8B26A`, etc.)
- Typography setup with Google Fonts (Playfair Display for display, Inter for UI)
- Global resets, transitions, card/glass mixins
- Scrollbar styling

#### [NEW] Navbar — `components/storefront/Navbar.js`
- Fixed, dark background with blur backdrop
- Logo left, nav links center (Home, Shop, Categories), cart icon right with item-count badge
- Cart drawer that slides in from the right
- Mobile: hamburger menu

#### [NEW] Hero — `components/storefront/Hero.js`
- Full-bleed dark hero, oversized wordmark behind the product image (z-index layering trick)
- Placeholder div for hero product image (user will add renders later)
- GSAP stagger entrance: headline → callouts → CTA → swatch thumbs
- Floating glass-panel callouts with SVG leader lines (`XXL Surface`, `Stitched Edges`, `Custom Print`)
- Color-swatch thumbnails bottom-right; GSAP crossfade between hero images on hover/click
- Circular glass "Buy Now" CTA button

#### [NEW] CategoryStrip — `components/storefront/CategoryStrip.js`
- Icon row: XXL Deskmats / RGB Deskmats / Bundles / Wrist Rests / Sale
- Smooth scroll-reveal with GSAP ScrollTrigger stagger

#### [NEW] CategoryGrid — `components/storefront/CategoryGrid.js`
- 2×2 large image tiles: Gaming Collection / RGB Series / Bundles / Corporate Orders
- Hover: scale + overlay label reveal

#### [NEW] PromoBanner — `components/storefront/PromoBanner.js`
- Full-width gradient banner: "Limited Time — 20% Off Bundles"
- Animated shimmer edge effect

#### [NEW] BestSellers — `components/storefront/BestSellers.js`
- Responsive product card grid
- Cards: placeholder image, name, price (with struck-through original if discounted), gold accent pricing, "Add to Cart" button
- Data fetched from Supabase (best sellers = first 4 active products for v1)

#### [NEW] TrustBadges — `components/storefront/TrustBadges.js`
- 4 badges: "Cash on Delivery" / "Custom Design, Made to Order" / "Karachi-wide Delivery" / "Support via WhatsApp"
- SVG icons, dark glass card style

#### [NEW] Newsletter — `components/storefront/Newsletter.js`
- Email + WhatsApp number capture form
- Minimal glass panel, no backend for v1 (just UI)

#### [NEW] Footer — `components/storefront/Footer.js`
- Brand blurb, shop links, customer care, social icons

#### [NEW] Shop / Category Listing — `app/(storefront)/shop/`
- Filterable product grid (filter by category, price range)
- Products loaded from Supabase

#### [NEW] Product Detail Page — `app/(storefront)/product/[slug]/`
- Image gallery (main image + thumbnails)
- Price with discount display
- Stock status badge (In Stock / Low Stock / Out of Stock)
- Structured info blocks rendered consistently (Delivery Time, Warranty, Care, Material)
- Quantity selector + Add to Cart

#### [NEW] Cart — `app/(storefront)/cart/`
- Line items, quantity edit, remove, subtotal
- localStorage-persisted via Zustand + zustand/middleware persist

#### [NEW] Checkout — `app/(storefront)/checkout/`
- COD form: name, email, phone, address, city, notes
- Order summary panel
- Form validation (email format, PK phone `+92...`)
- POST to `/api/orders`

#### [NEW] Order Confirmation — `app/(storefront)/order-confirmation/`
- Order number, summary, "check your email" message

---

### Phase 2 — Backend (API Routes + Supabase)

#### [NEW] Supabase Schema — `supabase/schema.sql`
- Full SQL for `products`, `customers`, `orders`, `order_items`, `admin_users` tables
- RLS policies: public read for products, authenticated-only write, admin-only for full access
- Triggers: stock decrement on order status → Confirmed, stock restore on Cancelled

#### [NEW] API: Create Order — `app/api/orders/route.js`
- Validates payload, upserts customer, creates order + order_items
- Async email via Resend (non-blocking)
- Returns `{ order_number }`

#### [NEW] API: Update Order Status — `app/api/orders/[id]/route.js`
- PATCH: updates status, triggers stock logic
- Admin auth guard via Supabase session

#### [NEW] Cart Store — `lib/cartStore.js`
- Zustand store with `persist` middleware → localStorage
- Actions: addItem, removeItem, updateQty, clearCart

#### [NEW] Supabase Client — `lib/supabase.js` + `lib/supabaseAdmin.js`
- Browser client (anon key) + server client (service role key for admin routes)

---

### Phase 3 — Admin Panel

#### [NEW] Admin Login — `app/admin/login/page.js`
- Email/password login via Supabase Auth
- Redirect to `/admin` on success

#### [NEW] Admin Middleware — `middleware.js`
- Protects all `/admin/*` routes (except `/admin/login`) using Supabase session

#### [NEW] Admin Dashboard — `app/admin/page.js`
- Stat cards: Total Orders, Total Revenue, Total COGS, Profit Margin %
- Filter: all-time / today / this week
- Low-stock alerts panel
- Repeat customer rate

#### [NEW] Orders Management — `app/admin/orders/`
- Sortable/searchable table: order #, date, customer, status, COGS, profit, returning flag
- Inline status edit dropdown
- Order detail drawer with line items + notes field

#### [NEW] Product CRUD — `app/admin/products/`
- Product list: thumbnail, name, price, discount, stock, status, quick edit
- Add/Edit form: all fields per §5.3, image upload to Supabase Storage

---

## Verification Plan

### Frontend
- `npm run dev` — visual review of each page/section
- Check GSAP animations load correctly
- Test cart persistence across page refreshes
- Test checkout form validation

### Backend
- Run SQL schema against Supabase, verify tables + RLS
- Test order creation via checkout form end-to-end
- Test order status change triggers stock update

### Admin
- Login/logout flow
- CRUD a product
- Change order status, verify stock deduction/restore

---

## Implementation Order

1. `[ ]` Scaffold Next.js project + install deps
2. `[ ]` Design system (globals.css, fonts)
3. `[ ]` Navbar + Cart store + CartDrawer
4. `[ ]` Hero section (with GSAP)
5. `[ ]` Home page sections (CategoryStrip, CategoryGrid, PromoBanner, BestSellers, TrustBadges, Newsletter, Footer)
6. `[ ]` Shop / Category listing page
7. `[ ]` Product Detail Page
8. `[ ]` Cart page
9. `[ ]` Checkout page + Order Confirmation
10. `[ ]` Supabase schema SQL
11. `[ ]` API routes (orders CRUD)
12. `[ ]` Cart store (Zustand + persist)
13. `[ ]` Supabase client lib
14. `[ ]` Admin login + middleware
15. `[ ]` Admin dashboard
16. `[ ]` Admin orders management
17. `[ ]` Admin product CRUD + image upload
