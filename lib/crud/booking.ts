import { supabase } from '../supabase/client';

// 参加申し込みを作成
export const createBooking = async (userId: string, listingId: string) => { 
  const { data, error } = await supabase
    .from('booking')
    .insert([
      // experience_id を listing_id に変更
      { user_id: userId, listing_id: listingId }
    ])
    .select();
  return { data, error };
};

// 特定の募集の参加申し込みリストを取得
export const getBookingsForListing = async (listingId: string) => { 
  const { data, error } = await supabase
    .from('booking')
    // 参照するテーブルを users から profiles に変更し、カラム名も experience_id から listing_id に変更
    .select('*, profile:user_id(name, email)') 
    .eq('listing_id', listingId); // 検索カラムを listing_id に変更
  return { data, error };
};

// 参加申し込みを削除
export const deleteBooking = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('booking')
    .delete()
    .eq('id', bookingId)
    .select();
  return { data, error };
};