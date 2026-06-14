-- ============================================================
-- RENTIX — Migrations (jalankan SEKALI di SQL Editor SETELAH schema.sql)
-- Berisi penyempurnaan: auto-update rating produk + Storage buckets.
-- Aman dijalankan ulang (idempotent).
-- ============================================================

-- ------------------------------------------------------------
-- 1. AUTO-UPDATE RATING PRODUK
--    Setiap ada/ubah/hapus review (direction = to_owner),
--    kolom products.rating & products.reviews dihitung ulang.
-- ------------------------------------------------------------
create or replace function public.recalc_product_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  pid bigint := coalesce(new.product_id, old.product_id);
begin
  if pid is null then
    return coalesce(new, old);
  end if;
  update public.products p
  set
    rating = coalesce((
      select round(avg(r.rating)::numeric, 1)
      from public.reviews r
      where r.product_id = pid and r.direction = 'to_owner'
    ), 5.0),
    reviews = (
      select count(*)
      from public.reviews r
      where r.product_id = pid and r.direction = 'to_owner'
    )
  where p.id = pid;
  return coalesce(new, old);
end;
$$;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.recalc_product_rating();

-- Selaraskan nilai awal dengan data seed yang sudah ada
update public.products p
set
  rating = coalesce((
    select round(avg(r.rating)::numeric, 1)
    from public.reviews r
    where r.product_id = p.id and r.direction = 'to_owner'
  ), p.rating),
  reviews = greatest(p.reviews, (
    select count(*) from public.reviews r
    where r.product_id = p.id and r.direction = 'to_owner'
  ));

-- ------------------------------------------------------------
-- 2. STORAGE BUCKETS (upload KTP & foto produk)
--    - kyc      : privat (dokumen identitas, tidak boleh publik)
--    - products : publik (foto produk tampil di marketplace)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('kyc', 'kyc', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Kebijakan: user hanya boleh mengunggah ke foldernya sendiri (prefix = uid)
drop policy if exists "kyc upload own" on storage.objects;
create policy "kyc upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'kyc' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "kyc read own" on storage.objects;
create policy "kyc read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'kyc' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "products read public" on storage.objects;
create policy "products read public" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "products upload auth" on storage.objects;
create policy "products upload auth" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and (storage.foldername(name))[1] = auth.uid()::text);

-- ------------------------------------------------------------
-- 3. RATING DUA ARAH — pemilik boleh melihat sewa pada produknya
--    (agar bisa menilai penyewa). Tetap aman: hanya pemilik produk.
-- ------------------------------------------------------------
drop policy if exists "rentals read owner" on public.rentals;
create policy "rentals read owner" on public.rentals
  for select using (
    exists (
      select 1 from public.products p
      where p.id = rentals.product_id and p.owner_id = auth.uid()
    )
  );

-- simpan id penyewa di review agar bisa diberi rating balik
alter table public.reviews add column if not exists target_user_id uuid references public.profiles(id) on delete set null;
