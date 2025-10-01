import { supabase } from '../supabase/client';

/**
 * Storageに画像をアップロードし、公開URLを返す関数
 * @param file アップロードするFileオブジェクト
 * @param experienceId 紐づけるお仕事体験のID
 * @param userId アップロードするユーザーのID
 * @returns 画像の公開URL
 */
export const uploadExperienceImage = async (file: File, experienceId: string, userId: string): Promise<string | null> => {
  // 拡張子を取得 (例: .jpg)
  const fileExtension = file.name.split('.').pop();
  
  // UUIDを生成してファイル名として使用 (ファイル衝突を回避)
  const uniqueFileName = crypto.randomUUID(); 

  // フォルダー構造: {userId}/{experienceId}/{UUID}.{拡張子}
  const filePath = `${userId}/${experienceId}/${uniqueFileName}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from('experience-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false 
    });

  if (error) {
    console.error('Storageへのアップロードエラー:', error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('experience-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};