create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null references public.products("Sku") on delete cascade,
  image_url text not null,
  source_url text,
  source_page_url text,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_images_sku_idx
on public.product_images (product_sku);

create unique index if not exists product_images_primary_unique_idx
on public.product_images (product_sku)
where is_primary = true;

alter table public.product_images enable row level security;
grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images"
  on public.product_images for select to anon, authenticated
  using (exists (
    select 1 from public.products
    where public.products."Sku" = product_images.product_sku
      and public.products.is_active = true
  ));

drop policy if exists "Admins can manage product images" on public.product_images;
create policy "Admins can manage product images"
  on public.product_images for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
