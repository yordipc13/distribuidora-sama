create table if not exists public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_sku text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_sku)
);

create index if not exists user_favorites_product_sku_idx
  on public.user_favorites (product_sku);

alter table public.user_favorites enable row level security;

grant select, insert, update, delete on public.user_favorites to authenticated;

create policy "Users can read own favorites"
  on public.user_favorites for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add own favorites"
  on public.user_favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own favorites"
  on public.user_favorites for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own favorites"
  on public.user_favorites for delete to authenticated
  using ((select auth.uid()) = user_id);