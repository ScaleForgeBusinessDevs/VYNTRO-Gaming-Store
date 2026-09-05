-- ============================================================
-- VYNTRO Gaming Store — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  description       text,
  category          text not null,
  images            text[] default '{}',
  cost_price        numeric(10,2) not null default 0,   -- COGS per unit
  selling_price     numeric(10,2) not null,
  discount_percentage numeric(5,2) default 0,
  stock_quantity    integer not null default 0,
  is_active         boolean not null default true,
  collections       text[] default '{}',                -- e.g. {'anime', 'fps', 'minimalistic', 'hot-picks', 'best-sellers'}
  -- Structured info blocks
  delivery_time     text,
  warranty_period   text,
  care_instructions text,
  material_specs    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Migration helper if table already exists:
alter table public.products add column if not exists collections text[] default '{}';
alter table public.products add column if not exists size_pricing jsonb default '{}';
create index if not exists products_collections_idx on public.products using gin(collections);

-- RLS for products
alter table public.products enable row level security;

-- Public can read products
drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
  on public.products for select
  using (true);

-- Allow product operations
create policy "Allow insert for products"
  on public.products for insert
  with check (true);

create policy "Allow update for products"
  on public.products for update
  using (true)
  with check (true);

create policy "Allow delete for products"
  on public.products for delete
  using (true);

-- Service role has full access (admin operations)
-- (Service role bypasses RLS by default in Supabase)

-- ============================================================
-- CUSTOMERS
-- ============================================================
create table public.customers (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  phone      text not null,
  address    text,
  city       text,
  created_at timestamptz not null default now()
);

-- Index for repeat customer detection
create index customers_email_idx on public.customers (email);
create index customers_phone_idx on public.customers (phone);

alter table public.customers enable row level security;
-- Customers table: public cannot read; only service role (admin) can access

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text not null unique,
  customer_id     uuid not null references public.customers(id),
  status          text not null default 'Pending'
                    check (status in ('Pending','Confirmed','Shipped','Delivered','Cancelled','Returned')),
  payment_method  text not null default 'COD',
  subtotal        numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount    numeric(10,2) not null default 0,
  total_cogs      numeric(10,2) not null default 0,
  profit_margin   numeric(6,2) not null default 0,  -- stored as %
  notes           text default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index orders_customer_id_idx on public.orders (customer_id);
create index orders_status_idx on public.orders (status);
create index orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;
-- Only service role (admin) can access orders

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id                    uuid primary key default uuid_generate_v4(),
  order_id              uuid not null references public.orders(id) on delete cascade,
  product_id            uuid references public.products(id),
  product_name_snapshot text not null,   -- Frozen at time of order
  quantity              integer not null check (quantity > 0),
  unit_price            numeric(10,2) not null,  -- Price at time of order
  unit_cost             numeric(10,2) not null default 0,  -- COGS at time of order
  line_total            numeric(10,2) not null
);

create index order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;
-- Only service role

-- ============================================================
-- STOCK HELPER FUNCTIONS (called by API route on status change)
-- ============================================================
create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void language plpgsql security definer as $$
begin
  update public.products
  set stock_quantity = greatest(0, stock_quantity - p_quantity),
      updated_at     = now()
  where id = p_product_id;
end;
$$;

create or replace function public.increment_stock(p_product_id uuid, p_quantity integer)
returns void language plpgsql security definer as $$
begin
  update public.products
  set stock_quantity = stock_quantity + p_quantity,
      updated_at     = now()
  where id = p_product_id;
end;
$$;

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ADMIN STORAGE BUCKET (for product images)
-- Run this in Supabase Dashboard > Storage, or via the SDK:
-- create bucket 'product-images' with public = true
-- ============================================================

-- ============================================================
-- SAMPLE DATA (optional — delete before production)
-- ============================================================
insert into public.products (name, slug, description, category, collections, images, cost_price, selling_price, discount_percentage, stock_quantity, is_active, delivery_time, warranty_period, care_instructions, material_specs) values
(
  'Midnight Black XL', 'midnight-black-xl',
  'The Midnight Black XL is our flagship deskmat — an expansive 900×400mm surface that covers your entire desk. Premium rubber base, stitched edges, and a smooth texture optimised for both speed and control mice.',
  'XXL Deskmats', array['minimalistic', 'hot-picks', 'best-sellers'], array['/red_mousepad.jpg'], 900, 2499, 0, 12, true,
  '3–5 business days', '6 months',
  'Wipe clean with a damp cloth. Do not machine wash.',
  '900×400mm, 4mm thickness, stitched edge, non-slip rubber base'
),
(
  'Arctic White Pro', 'arctic-white-pro',
  'Clean. Minimal. Premium. The Arctic White Pro is designed for setups that speak for themselves. Ultra-smooth surface with reinforced stitching.',
  'XXL Deskmats', array['minimalistic', 'best-sellers'], array['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'], 900, 2999, 20, 4, true,
  '3–5 business days', '6 months',
  'Wipe clean with a damp cloth. Do not machine wash.',
  '900×400mm, 4mm thickness, stitched edge, non-slip rubber base'
),
(
  'RGB Horizon Mat', 'rgb-horizon-mat',
  'Light up your setup with the RGB Horizon. USB-powered RGB lighting lines the perimeter — 11 lighting modes, fully controllable. Because your desk deserves ambiance.',
  'RGB Deskmats', array['fps', 'hot-picks', 'best-sellers'], array['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'], 1400, 3499, 0, 8, true,
  '3–5 business days', '6 months',
  'Wipe clean with a damp cloth. Unplug before cleaning. Do not machine wash.',
  '900×400mm, USB RGB, 4mm thickness, stitched edge'
),
(
  'Galaxy Bundle', 'galaxy-bundle',
  'The complete desk upgrade: Galaxy-print XXL mat + ergonomic wrist rest + cable management anchor. Everything your setup has been missing.',
  'Bundles', array['anime', 'hot-picks', 'best-sellers'], array['/jjk_mousepad.jpg'], 1800, 4999, 15, 5, true,
  '5–7 business days', '6 months',
  'Wipe clean with a damp cloth. Do not machine wash.',
  'Bundle: 900×400mm mat + wrist rest + cable anchor'
),
(
  'Stealth Tactical XXL', 'stealth-tactical-xxl',
  'Heavy-duty non-fray stitched edge with precision micro-weave texture for low friction and instant mouse flick response.',
  'XXL Deskmats', array['fps', 'best-sellers'], array['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'], 1000, 2799, 0, 14, true,
  '3–5 business days', '6 months',
  'Wipe clean with a damp cloth. Do not machine wash.',
  '900×400mm, 4mm thickness, stitched edge'
);
