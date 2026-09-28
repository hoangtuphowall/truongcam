-- 015_secure_canteen_order.sql
-- SECURITY FIX: the original client flow inserted `orders.total_amount` and
-- each `order_items.unit_price` directly from client-computed values, and
-- separately debited the wallet by that same client-computed total. A
-- tampered client could submit an arbitrary (e.g. zero) price. This function
-- looks up the real price of every item server-side and is the only
-- supported way to place an order from now on.

create or replace function public.place_canteen_order(p_canteen_id uuid, p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total integer := 0;
  v_item record;
  v_qty integer;
  v_real_price integer;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (buyer_id, canteen_id, total_amount)
  values (auth.uid(), p_canteen_id, 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_to_recordset(p_items) as x(canteen_item_id uuid, quantity integer)
  loop
    v_qty := v_item.quantity;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for item %', v_item.canteen_item_id;
    end if;

    select price into v_real_price
    from public.canteen_items
    where id = v_item.canteen_item_id and canteen_id = p_canteen_id and is_available = true;

    if v_real_price is null then
      raise exception 'Item % is not available', v_item.canteen_item_id;
    end if;

    insert into public.order_items (order_id, canteen_item_id, quantity, unit_price)
    values (v_order_id, v_item.canteen_item_id, v_qty, v_real_price);

    v_total := v_total + v_real_price * v_qty;
  end loop;

  update public.orders set total_amount = v_total where id = v_order_id;

  perform public.ensure_wallet_account();

  update public.wallet_accounts
    set balance = balance - v_total
    where user_id = auth.uid() and balance >= v_total;

  if not found then
    raise exception 'Insufficient demo balance';
  end if;

  insert into public.wallet_transactions (user_id, amount, kind, related_order_id, note)
  values (auth.uid(), -v_total, 'canteen_order', v_order_id, 'Đặt món tại căng-tin');

  return v_order_id;
end;
$$;

-- The client no longer inserts orders/order_items directly (it now goes
-- through place_canteen_order above, which bypasses RLS as the function
-- owner), so revoke direct client INSERT on both — SELECT stays so a buyer
-- can still read their own past orders.
drop policy if exists "orders_insert_self" on public.orders;
drop policy if exists "order_items_insert_via_order" on public.order_items;
