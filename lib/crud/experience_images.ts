import { supabase } from '../supabase/client';

// 画像の追加
export const addExperienceImage = async (experienceId: string, url: string) => {
  const { data, error } = await supabase
    .from('experience_images')
    .insert([
      { experience_id: experienceId, url }
    ])
    .select();
  return { data, error };
};

// 特定のお仕事体験に紐づく画像の取得
export const getImagesForExperience = async (experienceId: string) => {
  const { data, error } = await supabase
    .from('experience_images')
    .select('*')
    .eq('experience_id', experienceId);
  return { data, error };
};

// 画像の削除
export const deleteExperienceImage = async (imageId: string) => {
  const { data, error } = await supabase
    .from('experience_images')
    .delete()
    .eq('id', imageId)
    .select();
  return { data, error };
};