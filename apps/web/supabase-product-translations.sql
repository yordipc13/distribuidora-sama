-- Run once in the Supabase SQL Editor to enable cached English product translations.
create table if not exists public.product_translations (
  sku text primary key,
  name_en text not null,
  description_en text not null default '',
  category_en text not null default '',
  subcategory_en text not null default '',
  source_name text not null,
  source_description text not null default '',
  source_category text not null default '',
  source_subcategory text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.product_translations enable row level security;

grant select on public.product_translations to anon, authenticated;
grant all on public.product_translations to service_role;

drop policy if exists "Public can read product translations" on public.product_translations;
create policy "Public can read product translations"
  on public.product_translations
  for select
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';