-- ============================================================
-- Om Namashivaya Agents — Initial Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable pgvector extension (for future AI/RAG features)
create extension if not exists vector;

-- ─── User Profiles ────────────────────────────────────────────────────────────
create table user_profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'shop', 'consumer')) default 'consumer',
  full_name text,
  phone text,
  shop_name text,
  shop_address text,   -- saved once, auto-filled on bulk orders
  shop_phone text,     -- shop contact number (may differ from owner's phone)
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Categories ───────────────────────────────────────────────────────────────
create table categories (
  id serial primary key,
  name text not null,
  slug text unique not null,
  icon text
);

insert into categories (name, slug, icon) values
  ('Electronics', 'electronics', '⚡'),
  ('Food (Pirangoon)', 'food', '🛒');

-- ─── Products ─────────────────────────────────────────────────────────────────
create table products (
  id serial primary key,
  category_id int references categories(id) on delete set null,
  name text not null,
  description text,
  price_retail numeric(10,2) not null,
  price_wholesale numeric(10,2),
  stock_quantity int default 0 check (stock_quantity >= 0),
  unit text default 'piece',
  image_url text,
  is_active boolean default true,
  embedding vector(1536),   -- pgvector: for AI product search (Phase 4)
  created_at timestamptz default now()
);

create index on products(category_id);
create index on products(is_active);

-- ─── Orders ───────────────────────────────────────────────────────────────────
create table orders (
  id serial primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_type text check (order_type in ('retail', 'wholesale')) default 'retail',
  status text check (
    status in ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')
  ) default 'pending',
  payment_method text check (payment_method in ('cod', 'upi')) default 'cod',
  payment_status text check (payment_status in ('pending', 'paid')) default 'pending',
  total_amount numeric(10,2),
  delivery_address text,
  phone text,
  notes text,
  created_at timestamptz default now()
);

create index on orders(user_id);
create index on orders(status);
create index on orders(created_at desc);

-- ─── Order Items ──────────────────────────────────────────────────────────────
create table order_items (
  id serial primary key,
  order_id int references orders(id) on delete cascade,
  product_id int references products(id) on delete set null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

create index on order_items(order_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table user_profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- user_profiles: users can read/update their own profile
create policy "users read own profile"
  on user_profiles for select using (auth.uid() = id);
create policy "users update own profile"
  on user_profiles for update using (auth.uid() = id);

-- orders: users see only their own; admins see all (handled in backend with service role)
create policy "users see own orders"
  on orders for select using (auth.uid() = user_id);
create policy "users insert own orders"
  on orders for insert with check (auth.uid() = user_id);

-- order_items: visible if parent order belongs to user
create policy "users see own order items"
  on order_items for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- products and categories are public read
alter table products enable row level security;
alter table categories enable row level security;
create policy "public read products" on products for select using (true);
create policy "public read categories" on categories for select using (true);
