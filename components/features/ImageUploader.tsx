'use client';

import React, { useEffect, useState } from 'react';
import { uploadImageAndRecord } from '@/lib/crud/experience_images';
import { supabase } from '@/lib/supabase/client'; // supabase クライアントを import

interface UploaderProps {
  postId: string;
  userId: string;
  onUploadSuccess: (url: string) => void;
}

export default function ExperienceImageUploader({ postId, userId, onUploadSuccess }: UploaderProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ページロード時にログインユーザー確認
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("ログイン中ユーザー:", user);
        setCurrentUserId(user.id);
      } else {
        console.warn("ユーザーがログインしていません");
      }
    };
    fetchUser();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ログインしているか確認
    if (!currentUserId) {
      alert("ログインが必要です");
      return;
    }

    try {
      const { data, error } = await uploadImageAndRecord(file, postId, currentUserId);

      if (error) {
        console.error('アップロード中にエラーが発生しました:', error);
        alert('画像アップロードに失敗しました。コンソールを確認してください。');
        return;
      }

      const imageUrl = data?.[0]?.url;
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
