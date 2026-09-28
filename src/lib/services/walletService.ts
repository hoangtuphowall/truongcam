import { supabase } from '../supabase/client';

export interface DbWalletTransaction {
  id: string;
  amount: number;
  kind: 'demo_topup' | 'canteen_order' | 'transfer_out' | 'transfer_in';
  note: string | null;
  createdAt: string;
}

export async function getBalance(): Promise<number> {
  await supabase.rpc('ensure_wallet_account');
  const { data, error } = await supabase.from('wallet_accounts').select('balance').single();
  if (error) throw error;
  return data.balance;
}

export async function listTransactions(userId: string, limit = 20): Promise<DbWalletTransaction[]> {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('id, amount, kind, note, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, amount: row.amount, kind: row.kind, note: row.note, createdAt: row.created_at }));
}

/** Applies a signed demo transaction and returns the new balance. Throws if
 * it would push the balance negative (see wallet_apply_transaction in
 * 007_school_apps_demo.sql). */
export async function applyTransaction(
  amount: number,
  kind: DbWalletTransaction['kind'],
  note?: string,
  orderId?: string
): Promise<number> {
  const { data, error } = await supabase.rpc('wallet_apply_transaction', {
    p_amount: amount,
    p_kind: kind,
    p_note: note ?? null,
    p_order_id: orderId ?? null
  });
  if (error) throw error;
  return data as number;
}
