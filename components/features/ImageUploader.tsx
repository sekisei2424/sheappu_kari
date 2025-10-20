'use client';

import React from 'react';
// StorageとDB記録を統合した新しい関数を使用
import { uploadImageAndRecord } from '@/lib/crud/experience_images'; 

interface UploaderProps {
  // experienceIdではなく、postId (共通ID) に変更
  postId: string; 
  userId: string;
  onUploadSuccess: (url: string) => void;
}

export default function ExperienceImageUploader({ postId, userId, onUploadSuccess }: UploaderProps) {
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // StorageへのアップロードとDB記録を同時に実行
      // 関数名が uploadImageAndRecord に変更されている前提
      const { data, error } = await uploadImageAndRecord(file, postId, userId);

      if (error) {
        console.error('アップロード中にエラーが発生しました:', error);
        alert('画像アップロードに失敗しました。コンソールを確認してください。');
        return;
      }

      const imageUrl = data?.[0]?.url; // 挿入されたレコードからURLを取得
      if (imageUrl) {
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
      {/* ... JSX 省略 ... */}
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
        className="hidden"
      />
    </div>
  );
}