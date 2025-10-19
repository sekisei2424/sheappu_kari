'use client';
import { useEffect, useState } from 'react';
import { createListing } from '@/lib/crud/listings'; // 募集作成
import { deletePost } from '@/lib/crud/posts';
import { getPostById } from '@/lib/crud/posts'; // 投稿取得
import ExperienceImageUploader from '@/components/features/ImageUploader';
import Image from 'next/image';

// !!! 実行前に必ず以下の値を置き換えてください !!!
const TEST_USER_ID = 'c1c87a27-f7c0-4053-85c5-1a4ed85b7372'; 
const TEST_EXPERIENCE_ID = 'e1a2b3c4-f5d6-7890-1234-567890abcdef'; 

export default function CrudTester() {
  const [listingId, setListingId] = useState('');
  const [message, setMessage] = useState('テスト準備完了');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const runTest = async () => {
    if (TEST_USER_ID.includes('ここにサインアップで取得したUUID')) {
        setMessage('🚨 TEST_USER_ID を実際のUUIDに置き換えてからリロードしてください。');
        return;
    }
    
    // --- 1. 募集の作成 (Create Listing) ---
    setMessage('1. 募集を作成中...');
    const listingData = {
        title: "統合テスト用案件",
        description: "募集作成と画像アップロードのテスト。",
        location: "東京",
        date: "2026-03-01",
        organizer_id: TEST_USER_ID, 
        slots_available: 5,
        application_deadline: new Date(Date.now() + 86400000).toISOString(),
        status: 'open',
    };
    
    const { data, error } = await createListing(listingData);

    if (error) {
        console.error('募集作成エラー:', error);
        setMessage('🚨 募集作成に失敗しました (コンソール確認)');
        return;
    }

    const newPostId = data.post.id;
    setListingId(newPostId);
    setMessage(`✅ 募集作成成功！Post ID: ${newPostId}。画像アップロードに進んでください。`);
    
    // --- 2. 作成された募集の Read テスト ---
    const readResult = await getPostById(newPostId);
    console.log('✅ 募集 Read 成功 (データ確認):', readResult.data);
  };
  
  const handleCleanup = async () => {
    if (!listingId) return;
    await deletePost(listingId);
    setListingId('');
    setUploadedImageUrl('');
    setMessage('🗑️ テストデータ削除完了。');
  };

  useEffect(() => {
    // ページロード時に、以前のデータをクリーンアップしてから新しいテストを開始
    // NOTE: 開発環境で無限ループを防ぐため、このuseEffectは手動実行などに切り替えるのが望ましい
    // runTest(); 
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">統合テスト</h1>
      <p className="mb-4">ユーザーID: {TEST_USER_ID}</p>
      <p className="mb-4 text-lg font-semibold" style={{ color: message.startsWith('🚨') ? 'red' : 'green' }}>{message}</p>

      {/* 実行ボタン */}
      <button 
        onClick={runTest} 
        disabled={!!listingId}
        className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400 mr-2"
      >
        1. 募集作成 (Post & Listing Create)
      </button>

      {/* 2. 画像アップロード (手動) */}
      {listingId && (
        <div className="mt-6 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-3">2. 画像アップロードテスト (Storage + DB)</h2>
          <ExperienceImageUploader
            postId={listingId}
            userId={TEST_USER_ID}
            onUploadSuccess={setUploadedImageUrl}
          />
          {uploadedImageUrl && (
            <div className="mt-4">
              <p>画像URLがDBに記録されました。</p>
              <Image src={uploadedImageUrl} alt="Uploaded" width={100} height={100} unoptimized />
            </div>
          )}
        </div>
      )}
      
      {/* 3. クリーンアップ */}
      <button 
        onClick={handleCleanup} 
        className="p-2 bg-red-500 text-white rounded mt-4"
      >
        3. テストデータ削除 (Cleanup)
      </button>
      
      {listingId && <p className="mt-4 text-sm">現在の募集ID: {listingId}</p>}
    </div>
  );
}