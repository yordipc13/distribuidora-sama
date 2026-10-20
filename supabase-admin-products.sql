-- Ejecutar en Supabase SQL Editor después de crear el usuario administrador.
-- El usuario debe tener app_metadata.role = 'admin'; no usar user_metadata para este control.

grant select, insert, update on public.products to authenticated;

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products
  for all
  to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
