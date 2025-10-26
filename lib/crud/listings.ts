import { supabase } from '../supabase/client';
import { deletePost } from './posts';

interface ListingData {
  title: string;
  description: string;
  location: string;
  date: string;
  organizer_id: string; // profiles.id (UUID)
  
  // listings固有データ
  slots_available: number;
  application_deadline: string;
  status: string; // 'open' など
}

// -----------------------------------------------------
// Create (募集の作成: 2段階挿入)
// -----------------------------------------------------
export const createListing = async (listingData: ListingData) => {
  // 1. postsテーブルに共通データを挿入 (post_type = 1)
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([{
        title: listingData.title,
        description: listingData.description,
        location: listingData.location,
        date: listingData.date,
        post_type: 1, // 募集を示す
    }])
    .select('id')
    .single();

  if (postError) return { data: null, error: postError };

  const postId = postData.id;

  // 2. listingsテーブルに固有データを挿入
  const { data, error } = await supabase
    .from('listings')
    .insert([{
        post_id: postId,
        organizer_id: listingData.organizer_id,
        slots_available: listingData.slots_available,
        application_deadline: listingData.application_deadline,
        status: listingData.status,
    }])
    .select();
    
  // 挿入に失敗した場合、postsのレコードも削除する（トランザクション的な動作）
  if (error) {
    await deletePost(postId); // postを削除
    return { data: null, error };
  }
  
  return { data: { post: postData, listing: data }, error: null };
};

// -----------------------------------------------------
// Update (募集の更新)
// -----------------------------------------------------
// post ID (post_id) を使って更新
export const updateListing = async (postId: string, updateData: Partial<ListingData>) => {
  // 1. postsテーブルの共通データを更新
  const { error: postError } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', postId);

  if (postError) return { data: null, error: postError };

  // 2. listingsテーブルの固有データを更新
  const { data, error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('post_id', postId)
    .select();

  return { data, error };
};

// -----------------------------------------------------
// Read (募集の取得)
// -----------------------------------------------------
export type ListingWithPost = {
  id: string;
  post_id: string;
  organizer_id: string;
  slots_available: number;
  application_deadline: string;
  status: string;
  posts: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
  } | null;
};

// 単一募集の取得（listings と posts を結合）
export const getListingById = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select(
      `id, post_id, organizer_id, slots_available, application_deadline, status,
       posts:post_id ( id, title, description, location, date )`
    )
    .eq('id', id)
    .maybeSingle<ListingWithPost>();

  return { data, error };
};

// 募集一覧の取得（新着順）
export const listListings = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('listings')
    .select(
      `id, post_id, organizer_id, slots_available, application_deadline, status,
       posts:post_id ( id, title, description, location, date )`
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data: (data as ListingWithPost[] | null) ?? null, error };
};