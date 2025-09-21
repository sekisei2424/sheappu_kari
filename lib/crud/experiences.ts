import { supabase } from '../supabase/client';

interface ExperienceData {
  title: string;
  description: string;
  organizer_id: string;
  location: string;
  date: string;
  post_type: number;
}

// お仕事体験を作成
export const createExperience = async (experienceData: ExperienceData) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert([experienceData])
    .select();
  return { data, error };
};

// 全てのお仕事体験を取得
export const getExperiences = async () => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*');
  return { data, error };
};

// 特定のお仕事体験を取得
export const getExperienceById = async (id: string) => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// お仕事体験を更新
export const updateExperience = async (id: string, updateData: Partial<ExperienceData>) => {
  const { data, error } = await supabase
    .from('experiences')
    .update(updateData)
    .eq('id', id)
    .select();
  return { data, error };
};

// お仕事体験を削除
export const deleteExperience = async (id: string) => {
  const { data, error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .select();
  return { data, error };
};