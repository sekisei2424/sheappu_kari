'use client';
import { useEffect, useState } from 'react';
import { createListing } from '@/lib/crud/listings'; // 募集作成
import { deletePost } from '@/lib/crud/posts';
import { getPostById } from '@/lib/crud/posts'; // 投稿取得
import ExperienceImageUploader from '@/components/features/ImageUploader';
import Image from 'next/image';

// !!! 実行前に必ず以下の値を置き換えてください !!!
const TEST_USER_ID = 'fc956d47-ff75-4e78-af9a-053b836e86eb'; 
const TEST_EXPERIENCE_ID = 'e1a2b3c4-f5d6-7890-1234-567890abcdef'; 

export default function CrudTester() {
  const [listingId, setListingId] = useState('');
  const [postId, setPostId] = useState('');
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
    // listings は post_id を主キーとして持つ構成のため、詳細ページも post_id で参照する
    const newListingId = newPostId;
    setPostId(newPostId);
    setListingId(newListingId);
    setMessage(`✅ 募集作成成功！Post ID = Listing(post_id): ${newPostId}。画像アップロードに進んでください。`);
    
    // --- 2. 作成された募集の Read テスト ---
    const readResult = await getPostById(newPostId);
    console.log('✅ 募集 Read 成功 (データ確認):', readResult.data);
  };
  
  const handleCleanup = async () => {
  if (!postId) return;
  await deletePost(postId);
  setListingId('');
  setPostId('');
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
      {listingId && (
        <p className="mb-2 text-sm">
          確認: /search/listings/<span className="font-mono">{listingId}</span> にアクセスで詳細ページ（listings.post_id ベース）が開きます（/search 経由の移動でモーダル表示）。
        </p>
      )}

      {/* 実行ボタン */}
      <button 
        onClick={runTest} 
        disabled={!!listingId}
        className="p-2 bg-green-500 text-white rounded disabled:bg-gray-400 mr-2"
      >
        1. 募集作成 (Post & Listing Create)
      </button>

      {/* 2. 画像アップロード (手動) */}
      {postId && (
        <div className="mt-6 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-3">2. 画像アップロードテスト (Storage + DB)</h2>
          <ExperienceImageUploader
            postId={postId}
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
      
  {listingId && <p className="mt-2 text-sm">現在の募集ID (listings.id): {listingId}</p>}
  {postId && <p className="mt-1 text-sm">現在のポストID (posts.id): {postId}</p>}
    </div>
  );
}