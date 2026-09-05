# Product Requirements Document (PRD)
## VYNTRO — Custom Gaming Deskmat E-Commerce Store

**Version:** 1.0
**Prepared for:** Solo-founder build using Claude + Gemini (Antigravity) as vibe-coding partners
**Status:** Draft for build

---

## 1. Product Overview

An e-commerce storefront selling premium custom-printed XXL gaming deskmats, RGB deskmats, and desk-setup bundles. Orders are Cash on Delivery (COD) only at launch. The owner manages products and orders through a custom admin panel with cost/margin visibility on every order.

**Two surfaces to build:**
1. **Storefront** — public-facing site where customers browse, customize, and place COD orders.
2. **Admin Panel** — private dashboard for the owner to manage products, view orders, and track cost/profit.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), JavaScript (no TypeScript) |
| Animation | GSAP (ScrollTrigger for scroll reveals, hover/entrance micro-interactions) |
| Database / Backend | Supabase (Postgres + Auth + Storage for product images) |
| Auth (admin only) | Supabase Auth, single admin role, email/password |
| Email (order confirmation) | Resend (or Supabase Edge Function + email provider) triggered on order creation |
| Hosting | Vercel (standard for Next.js) |
| Dev environment | Claude + Gemini in Google Antigravity |

---

## 3. Design Direction

**Visual reference:** Dark, minimal, premium hero (à la reference image 1 — dark background, large 3D product render, big soft display type, floating glass-style feature callouts, circular glass "Buy" button) combined with the **page flow structure** of reference image 2 (category strip → category grid → promo banner → best-seller grid → trust badges → newsletter → footer), reskinned dark and gaming-oriented instead of light/fashion.

### 3.1 Color Palette
- **Background (primary):** `#0A0A0C` near-black
- **Surface/cards:** `#131316` with subtle `#1F1F24` border
- **Primary text:** `#F5F3EF` off-white
- **Secondary text:** `#9A9A9F` muted grey
- **Accent (brand/gold, from hero reference):** `#D8B26A` warm gold — used for headlines, key highlights, price tags
- **Gaming accent (RGB cue, used sparingly):** a subtle cyan→magenta gradient (`#5EE7FF` → `#C77DFF`) reserved for interactive states — hover glows, "Buy Now" button, active nav underline, stock/sale badges. This is the one place the site nods to "gaming peripheral" without going full RGB-neon.
- **Success/Sale:** `#7CD98C` used only for stock and discount badges

### 3.2 Typography
- **Display/headline:** a tall, light-weight serif or thin display sans (reference image 1's "Lumie Lamp" style) — large scale, letter-spaced, used for hero and section titles.
- **Body/UI:** clean geometric sans (e.g. Inter or General Sans) for product info, nav, buttons, admin panel.

### 3.3 Hero Section (Home Page)
- Full-bleed dark hero, large oversized wordmark/type sitting *behind* the product image (illusion of depth), consistent with reference image 1.
- Center: large 3D-rendered deskmat product image (provided later by user).
- **Hover interaction:** on hovering the hero product image, the mousepad's primary color (default: white) swaps to an alternate color-way in real time — implemented as either (a) a crossfade between two pre-rendered images, or (b) a masked color-overlay/duotone effect if only one render is available. **This is a homepage-only visual/marketing effect on the flagship hero product** — it is not a customer-selectable product variant and does not need to be driven by per-product database records. The two (or more) hero images can be static assets swapped via GSAP/CSS, not part of the product data model.
- Floating glass-panel callouts (e.g. "XXL Surface," "Stitched Edges," "Custom Print") connected to parts of the product with thin leader lines, revealed via GSAP stagger on load.
- A circular glass "Buy Now" button overlapping the product image, linking to the product/shop page.
- Small color-swatch thumbnails bottom-right for quick color selection, mirroring the hover-color mechanic.
- GSAP: staggered fade/slide-up entrance for headline, callouts, and CTA; subtle floating/parallax drift on the product image on scroll.

### 3.4 Page Flow (Home, below hero) — structure from reference image 2
1. Hero (above)
2. **Category strip** — icon row: XXL Deskmats / RGB Deskmats / Bundles / Wrist Rests / Sale
3. **Category grid** — large image tiles (e.g. "Gaming Collection," "RGB Series," "Bundles," "Corporate/Custom Orders")
4. **Promo banner** — e.g. "Limited Time — 20% Off Bundles"
5. **Best Sellers grid** — product cards with image, name, price (+ struck-through original price if discounted), rating placeholder (optional, can be static/off for v1), quick "Add to Cart"
6. **Trust badges row** — "Cash on Delivery," "Custom Design, Made to Order," "Karachi-wide Delivery," "Support via WhatsApp"
7. **Newsletter / WhatsApp signup** — capture email or WhatsApp number for future marketing
8. **Footer** — brand blurb, shop links, customer care, socials

### 3.5 Other Pages
- **Shop/Category listing** — filterable grid of products
- **Product Detail Page (PDP)** — image gallery, price/discount display, description, structured info blocks (delivery time, warranty, etc. — see §5.3), quantity selector, Add to Cart. No design-upload/customization step in v1 (see §9).
- **Cart** — line items with thumbnail/name/price, quantity edit, remove item, running subtotal, "Checkout" CTA. Guest cart persisted client-side (localStorage) since there are no customer accounts in v1; cart survives a page refresh but is device-local.
- **Checkout** — COD only; form fields: full name, email, phone, address, city, order notes; order summary; "Place Order" button
- **Order Confirmation page** — order number + summary, "check your email" note

---

## 4. Functional Requirements — Storefront

| ID | Requirement |
|---|---|
| FR-1 | Customer can browse products by category and view individual product pages |
| FR-2 | Product page shows live stock status (in stock / low stock / out of stock) sourced from Supabase |
| FR-3 | Customer can add product(s) to cart, adjust quantity, or remove items; cart is accessible from anywhere on the site (persistent header icon with item count) |
| FR-4 | Checkout form requires: full name, email, phone number, delivery address, city — email and phone are mandatory fields |
| FR-5 | Only payment method available at launch is **Cash on Delivery**; the field is present in the schema to support future methods (card/bank) without rework |
| FR-6 | On successful order placement, system creates an order record and sends an **order confirmation email** to the customer's provided email address |
| FR-7 | Discounted products display original price struck through and the discounted price, computed from a stored discount percentage |
| FR-8 | Homepage hero product image supports a color-change hover effect (visual only, not tied to product data — see §3.3) |
| FR-9 | Each product page displays the admin-authored description plus its structured info blocks (delivery time, warranty period, etc.) in a consistent, pre-formatted layout |

---

## 5. Functional Requirements — Admin Panel

### 5.1 Dashboard (landing view)
- Total orders (all-time / today / this week — filterable)
- Total revenue, total COGS, total profit, blended profit margin %
- Repeat-customer rate
- Low-stock alerts

### 5.2 Orders Management
Table view with columns:
- Order # / Date placed
- Customer name, phone, email, delivery address
- Payment method (COD)
- Order status (Pending → Confirmed → Shipped → Delivered / Cancelled / Returned) — editable inline. Moving to **Confirmed** triggers stock deduction for each line item; moving a Confirmed+ order to **Cancelled** restores that stock.
- **Cost of Acquisition (COGS)** — sum of per-item cost price × quantity (raw blank mousepad + print cost, etc., pulled from each product's stored cost field at time of order)
- **Profit margin** — `(Order Total − COGS) / Order Total`, shown as PKR value and %
- **Returning customer** — badge/flag if this email or phone has a prior order in the system
- Search/filter by name, phone, status, date range

Order detail drawer/page: full line-item breakdown (product, qty, unit price, unit cost, line profit), customer contact info, address, and internal notes field.

### 5.3 Product Management (CRUD)
- Add/edit product: name, category, product images (multiple; upload to Supabase Storage), **cost price** (COGS input — what it costs the owner to produce one unit), **selling price**, **discount percentage** (system auto-calculates the discounted price and displays both), stock quantity, active/inactive toggle
- **Description** — a free-text/rich-text field for the product's own write-up
- **Structured info blocks** — separate, pre-labeled fields the admin fills in per product so this info doesn't need to be typed into the description each time. Rendered on the PDP in a consistent format. Fixed fields for v1:
  - Delivery time (e.g. "3–5 business days")
  - Warranty period (e.g. "6 months")
  - Care instructions (e.g. "Wipe clean, do not machine wash")
  - Material/specs (e.g. "900x400mm, stitched edge, rubber base")
  *(This list is a fixed set of labeled fields per product, not a freeform block builder — keeps the admin UI simple as requested. More fields can be added to this fixed set later if needed.)*
- Product list view: thumbnail, name, price, discount, stock, status, quick edit/deactivate
- **Stock quantity is decremented when an order's status is moved to "Confirmed"** in the admin panel — not at the moment the customer places the order. This avoids deducting stock for orders that turn out to be invalid/unreachable COD orders (a common issue with COD stores). If an order is later cancelled after being confirmed, stock should be restored (+quantity back) automatically.

### 5.4 Customers (derived view, optional but recommended)
- List of unique customers (matched by email or phone), each showing order count and lifetime value — this is what powers the "returning customer" flag on orders.

---

## 6. Data Model (Supabase / Postgres — high level)

**products**
`id, name, slug, description, category, images[] (or child table), cost_price, selling_price, discount_percentage, stock_quantity, is_active, delivery_time, warranty_period, care_instructions, material_specs, created_at, updated_at`

*(The hero hover color-change is a static homepage asset swap, not product-driven — no color-variant table needed in v1.)*

**customers**
`id, name, email, phone, address, city, created_at`
*(uniqueness/matching on email + phone to detect repeat customers)*

**orders**
`id, order_number, customer_id, status, payment_method (default 'COD'), subtotal, discount_amount, total_amount, total_cogs, profit_margin, notes, created_at, updated_at`

**order_items**
`id, order_id, product_id, product_name_snapshot, quantity, unit_price, unit_cost, line_total`

**admin_users**
`id, email, password_hash (handled via Supabase Auth), role`

> Storing `product_name_snapshot` and `unit_cost`/`unit_price` on the order_item (rather than only referencing the live product) preserves historical accuracy — if you change a product's price or cost later, past orders' recorded profit margins stay correct.

---

## 7. Non-Functional Requirements

- Mobile-first responsive design (majority of COD e-commerce traffic in Pakistan is mobile)
- Fast image loading — use Next.js `Image` optimization for product/hero renders
- Admin panel behind Supabase Auth login; not publicly indexed/accessible
- Basic form validation on checkout (valid email format, valid PK phone number format)
- Email delivery should not block order confirmation — order is created first, email sent async/best-effort with a retry or at least a logged failure

---

## 8. Resolved Decisions

| Decision | Outcome |
|---|---|
| Custom design upload on PDP | **Deferred** — out of scope for v1 (see §9). Handled manually via WhatsApp/Instagram after order for now. |
| Hero hover color-change | **Homepage visual effect only** — static asset swap, not a customer-selectable product variant. |
| Stock deduction timing | **On order confirmation**, not on placement — avoids deducting for unconfirmed/unreachable COD orders. |
| Brand name | **VYNTRO** |

## 9. Open Questions

1. **Domain name** — needed to finalize email sender address and footer/social links.

## 10. Out of Scope (v1)

- Custom design upload/customization flow on the storefront (planned for a later phase)
- Online payment gateway integration (COD only at launch; schema supports adding later)
- Customer accounts/login (guest checkout + guest cart only for v1)
- Reviews/ratings system (static/off for v1)
- SMS notifications (email only for v1)
