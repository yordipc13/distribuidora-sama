-- Minimal public catalog schema for Distribuidora SAMA.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category_id uuid references public.categories(id),
  brand_id uuid references public.brands(id),
  subcategory text,
  description text,
  image_url text,
  stock integer check (stock is null or stock >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;

grant select on public.categories, public.brands, public.products to anon, authenticated;

create policy "Public can read active categories"
  on public.categories for select to anon, authenticated
  using (is_active);

create policy "Public can read active brands"
  on public.brands for select to anon, authenticated
  using (is_active);

create policy "Public can read active products"
  on public.products for select to anon, authenticated
  using (is_active);

notify pgrst, 'reload schema';