-- 007_school_apps_demo.sql
-- Cẩm Canteen (real order flow) + Cẩm Pay (explicitly a DEMO school-credit
-- ledger only — no real money, no card data, per product decision).

create table public.canteens (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.canteens enable row level security;
create policy "canteens_select_authenticated" on public.canteens for select to authenticated using (true);

create table public.canteen_items (
  id uuid primary key default gen_random_uuid(),
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  category text not null check (category in ('Ăn sáng', 'Đồ uống', 'Ăn vặt', 'Dụng cụ học tập')),
  emoji text,
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.canteen_items enable row level security;
create index canteen_items_canteen_id_idx on public.canteen_items(canteen_id);
create policy "canteen_items_select_authenticated" on public.canteen_items for select to authenticated using (true);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled')),
  total_amount integer not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create index orders_buyer_id_idx on public.orders(buyer_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create policy "orders_select_own"
  on public.orders for select to authenticated using (buyer_id = auth.uid());
create policy "orders_insert_self"
  on public.orders for insert to authenticated with check (buyer_id = auth.uid());

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  canteen_item_id uuid not null references public.canteen_items(id),
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0)
);
alter table public.order_items enable row level security;
create index order_items_order_id_idx on public.order_items(order_id);

create policy "order_items_select_via_order"
  on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.buyer_id = auth.uid()));
create policy "order_items_insert_via_order"
  on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.buyer_id = auth.uid()));

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  changed_at timestamptz not null default now()
);
alter table public.order_status_history enable row level security;

create policy "order_status_history_select_via_order"
  on public.order_status_history for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_status_history.order_id and o.buyer_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Cẩm Pay — DEMO wallet only.
-- No real currency processing, no card/bank data ever stored here.
-- Every user gets a starting demo balance; orders/transfers just move the
-- number around via a ledger so the UI has something real to read/write.
-- ---------------------------------------------------------------------------
create table public.wallet_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance integer not null default 150000 check (balance >= 0), -- demo VNĐ, not real money
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.wallet_accounts enable row level security;

create trigger wallet_accounts_set_updated_at
  before update on public.wallet_accounts
  for each row execute function public.set_updated_at();

create policy "wallet_accounts_select_self"
  on public.wallet_accounts for select to authenticated using (user_id = auth.uid());

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,              -- negative = debit, positive = credit (demo units)
  kind text not null check (kind in ('demo_topup', 'canteen_order', 'transfer_out', 'transfer_in')),
  related_order_id uuid references public.orders(id),
  note text,
  created_at timestamptz not null default now()
);
alter table public.wallet_transactions enable row level security;
create index wallet_transactions_user_id_idx on public.wallet_transactions(user_id);

create policy "wallet_transactions_select_self"
  on public.wallet_transactions for select to authenticated using (user_id = auth.uid());
-- No direct insert policy: transactions are only ever written by the
-- security-definer function below, which also updates the balance, so a
-- client can never fabricate a transaction or push balance negative.

create or replace function public.ensure_wallet_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallet_accounts (user_id) values (auth.uid())
  on conflict (user_id) do nothing;
end;
$$;

create or replace function public.wallet_apply_transaction(p_amount integer, p_kind text, p_note text default null, p_order_id uuid default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  perform public.ensure_wallet_account();

  update public.wallet_accounts
    set balance = balance + p_amount
    where user_id = auth.uid()
    returning balance into new_balance;

  if new_balance < 0 then
    raise exception 'Insufficient demo balance';
  end if;

  insert into public.wallet_transactions (user_id, amount, kind, related_order_id, note)
  values (auth.uid(), p_amount, p_kind, p_order_id, p_note);

  return new_balance;
end;
$$;
