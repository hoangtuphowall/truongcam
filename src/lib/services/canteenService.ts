import { supabase } from '../supabase/client';

export const CAM_BINH_CANTEEN_ID = '00000000-0000-0000-0000-000000000101';

export interface DbCanteenItem {
  id: string;
  name: string;
  price: number;
  category: 'Ăn sáng' | 'Đồ uống' | 'Ăn vặt' | 'Dụng cụ học tập';
  emoji: string | null;
}

export async function listMenu(canteenId: string = CAM_BINH_CANTEEN_ID): Promise<DbCanteenItem[]> {
  const { data, error } = await supabase
    .from('canteen_items')
    .select('id, name, price, category, emoji')
    .eq('canteen_id', canteenId)
    .eq('is_available', true);
  if (error) throw error;
  return data ?? [];
}

/** Places an order via the place_canteen_order() RPC, which looks up real
 * prices server-side and debits the wallet in the same transaction — the
 * client only says WHAT to order, never HOW MUCH it costs (see
 * 015_secure_canteen_order.sql for why that split matters). */
export async function placeOrder(params: {
  buyerId: string;
  canteenId?: string;
  items: { canteenItemId: string; quantity: number }[];
}): Promise<string> {
  const canteenId = params.canteenId ?? CAM_BINH_CANTEEN_ID;
  const { data, error } = await supabase.rpc('place_canteen_order', {
    p_canteen_id: canteenId,
    p_items: params.items.map((it) => ({ canteen_item_id: it.canteenItemId, quantity: it.quantity }))
  });
  if (error) throw error;
  return data as string;
}

