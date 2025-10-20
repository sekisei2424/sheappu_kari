import { supabase } from '../supabase/client';

// -----------------------------------------------------
// Read (全投稿の取得と表示)
// -----------------------------------------------------
// 全ての子テーブルをJOINして、全ての投稿を取得する (フィード用)
export const getAllPosts = async () => {
  // postsを起点に、post_typeに応じて子テーブルにJOINし、固有情報を取得
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      listing:listings(*),            // type=1 (募集) の固有情報
      reflection:user_reflections(*),  // type=2 (個人投稿) の固有情報
      company_reflection:company_reflections(*) // type=3 (企業投稿) の固有情報
    `)
    // 必要に応じて、ここで created_at で並び替え
    .order('created_at', { ascending: false }); 
    
  return { data, error };
};

// 特定の投稿を取得 (IDは posts.id)
export const getPostById = async (id: string) => {
  // 全投稿取得と同様に、JOINを使い、投稿タイプに関わらずデータを取得
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      listing:listings(*),
      reflection:user_reflections(*),
      company_reflection:company_reflections(*)
    `)
    .eq('id', id)
    .single();
    
  return { data, error };
};

// -----------------------------------------------------
// Delete (全投稿の削除)
// -----------------------------------------------------
// postsテーブルから削除すれば、CASCADE制約により子テーブルも自動削除されます。
export const deletePost = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .select();
  return { data, error };
};