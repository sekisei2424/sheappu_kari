import { supabase } from '../supabase/client';

// -----------------------------------------------------
// Storageとの連携とDB記録を行う関数
// -----------------------------------------------------

/**
 * [CREATE操作] ファイルをStorageにアップロードし、DBにそのURLを記録する
 * @param file アップロードするFileオブジェクト
 * @param postId 紐づける投稿のID (UUID)
 * @param userId アップロードするユーザーのID (UUID)
 * @returns データベースに挿入されたレコード
 */
export const uploadImageAndRecord = async (file: File, postId: string, userId: string) => {
  // 1. Storageへのアップロード処理 (提供されたロジックを統合)
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = crypto.randomUUID();
  const filePath = `${userId}/${postId}_${uniqueFileName}.${fileExtension}`;

  // Storageにアップロード
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('experience-images') // バケット名
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Storageへのアップロードエラー:', uploadError);
    return { data: null, error: uploadError };
  }

  // 公開URLを取得
  const { data: publicUrlData } = supabase.storage
    .from('experience-images')
    .getPublicUrl(uploadData.path);

  const imageUrl = publicUrlData.publicUrl;


  // 2. データベース (experience_images) にURLを記録
  const { data: dbData, error: dbError } = await supabase
    .from('experience_images')
    .insert([
      { post_id: postId, url: imageUrl }
    ])
    .select();

  if (dbError) {
    // DB登録に失敗した場合、Storageにアップロードされたファイルも削除（理想的なロールバック）
    await supabase.storage.from('experience-images').remove([filePath]);
    console.error('DBへのURL記録失敗。Storageファイル削除済み:', dbError);
    return { data: null, error: dbError };
  }

  return { data: dbData, error: null };
};


/**
 * [READ操作] 特定の投稿に紐づく画像の取得
 * @param postId 投稿ID
 */
export const getImagesForPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('experience_images')
    .select('*')
    .eq('post_id', postId);
  return { data, error };
};


/**
 * [DELETE操作] DBレコードとStorageのファイル両方を削除
 * @param imageId experience_imagesテーブルのID
 * @param filePathToDelete Storage内のファイルのフルパス (例: 'user_1/post_a/uuid.jpg')
 */
export const deleteImageAndRecord = async (imageId: string, filePathToDelete: string) => {

  // 1. Storageからファイルを削除
  const { error: storageError } = await supabase.storage
    .from('experience-images')
    .remove([filePathToDelete]);

  if (storageError) {
    console.error('Storageファイル削除エラー:', storageError);
    // Storage削除が失敗してもDB操作は続行することが多いが、ここではエラーを返す
    return { data: null, error: storageError };
  }

  // 2. データベースからレコードを削除
  const { data: dbData, error: dbError } = await supabase
    .from('experience_images')
    .delete()
    .eq('id', imageId)
    .select();

  if (dbError) {
    console.error('DBレコード削除エラー:', dbError);
    return { data: null, error: dbError };
  }

  return { data: dbData, error: null };
};

// -----------------------------------------------------
// 注意: filePathToDeleteを取得するRead関数を追加
// -----------------------------------------------------

/**
 * ファイルのURLからStorageパスを取得するヘルパー関数
 * (deleteImageAndRecordに必要な filePath を逆算するために利用)
 * @param imageUrl DBに保存されている公開URL
 * @returns Storage内のパス文字列 (例: 'user_1/post_a/uuid.jpg')
 */
export const getFilePathFromUrl = (imageUrl: string): string => {
  // Supabaseの公開URLは通常、[URL]/storage/v1/object/public/[bucket]/[path] の形式
  const urlSegments = imageUrl.split('experience-images/');
  if (urlSegments.length > 1) {
    return urlSegments[1];
  }
  return '';
};