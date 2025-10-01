'use client';

import React from 'react';
import { uploadExperienceImage } from '@/lib/storage/images'; // Storageアップロード関数
import { addExperienceImage } from '@/lib/crud/experience_images'; // DB保存関数

interface UploaderProps {
  experienceId: string;
  userId: string;
  onUploadSuccess: (url: string) => void; // アップロード成功時のコールバック
}

export default function ExperienceImageUploader({ experienceId, userId, onUploadSuccess }: UploaderProps) {
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Storageに画像をアップロードし、公開URLを取得
      const imageUrl = await uploadExperienceImage(file, experienceId, userId);

      if (imageUrl) {
        // 2. 取得したURLをexperience_imagesテーブルに保存
        const { error } = await addExperienceImage(experienceId, imageUrl);

        if (error) {
          console.error('データベースへのURL保存に失敗:', error);
          alert('画像はアップロードされましたが、データベースへの登録に失敗しました。');
          return;
        }

        console.log('画像アップロードと保存が完了しました。', imageUrl);
        onUploadSuccess(imageUrl);
      }
    } catch (error) {
      console.error('アップロード中に致命的なエラーが発生しました:', error);
      alert('ファイルのアップロード中にエラーが発生しました。');
    }
  };

  return (
    <div>
      <label 
        htmlFor="image-upload" 
        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        画像を選択
      </label>
      <input 
        id="image-upload"
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload}
        className="hidden" // UIを隠して、上の<label>を使う
      />
    </div>
  );
}