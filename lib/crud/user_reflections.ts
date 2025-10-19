import { supabase } from '../supabase/client';
import { deletePost } from './posts';

interface UserReflectionData {
  title: string;
  description: string;
  location: string;
  date: string;
  user_id: string; // profiles.id (UUID)
  
  // reflections固有データ
  listing_id: string | null; // どの募集に対する投稿か
  rating: number; // 1-5
  review_body: string;
  moderation_status?: string; // 'pending'
}

// -----------------------------------------------------
// Create (個人の投稿の作成: 2段階挿入)
// -----------------------------------------------------
export const createUserReflection = async (reflectionData: UserReflectionData) => {
  // 1. postsテーブルに共通データを挿入 (post_type = 2)
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([{
        title: reflectionData.title,
        description: reflectionData.description,
        location: reflectionData.location,
        date: reflectionData.date,
        post_type: 2, // 個人の投稿を示す
    }])
    .select('id')
    .single();

  if (postError) return { data: null, error: postError };

  const postId = postData.id;

  // 2. user_reflectionsテーブルに固有データを挿入
  const { data, error } = await supabase
    .from('user_reflections') // テーブル名を修正
    .insert([{
        post_id: postId,
        user_id: reflectionData.user_id,
        listing_id: reflectionData.listing_id,
        rating: reflectionData.rating,
        review_body: reflectionData.review_body,
        moderation_status: reflectionData.moderation_status || 'pending',
    }])
    .select();
    
  // 挿入に失敗した場合、postsのレコードも削除
  if (error) {
    await deletePost(postId); 
    return { data: null, error };
  }
  
  return { data: { post: postData, reflection: data }, error: null };
};

// -----------------------------------------------------
// Update (個人の投稿の更新)
// -----------------------------------------------------
export const updateUserReflection = async (postId: string, updateData: Partial<UserReflectionData>) => {
  // 1. postsテーブルの共通データを更新
  const { error: postError } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', postId);

  if (postError) return { data: null, error: postError };

  // 2. user_reflectionsテーブルの固有データを更新
  const { data, error } = await supabase
    .from('user_reflections')
    .update(updateData)
    .eq('post_id', postId)
    .select();

  return { data, error };
};