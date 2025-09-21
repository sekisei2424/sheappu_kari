import { useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import {
  createUserProfile, getUserProfile,
} from '../lib/crud/users';
import {
  createExperience, getExperiences, updateExperience, deleteExperience,
} from '../lib/crud/experiences';
import {
  addExperienceImage, getImagesForExperience, deleteExperienceImage,
} from '../lib/crud/experience_images';
import {
  createBooking, getBookingsForExperience, deleteBooking,
} from '../lib/crud/booking';
import {
  createLike, getLikesCount, deleteLike,
} from '../lib/crud/likes';
import {
  createMessage, getConversation,
} from '../lib/crud/messages';
import {
  createSwipe, getSwipesByUser,
} from '../lib/crud/tend';

// テスト用の一時的なユーザーID
const TEST_USER_ID_1 = '00000000-0000-0000-0000-000000000001';
const TEST_USER_ID_2 = '00000000-0000-0000-0000-000000000002';

const runAllTests = async () => {
  console.log('--- すべてのCRUDテストを開始します ---');

  // **ユーザーテーブル (users)**
  console.log('\n✅ usersテーブルのCRUDテスト');
  await createUserProfile(TEST_USER_ID_1, 'Test User 1', 'test1@example.com');
  await createUserProfile(TEST_USER_ID_2, 'Test User 2', 'test2@example.com');
  const user1 = await getUserProfile(TEST_USER_ID_1);
  console.log('取得したユーザー1:', user1.data);

  // **お仕事体験テーブル (experiences)**
  console.log('\n✅ experiencesテーブルのCRUDテスト');
  const expData = {
    title: 'テスト体験',
    description: 'CRUDテスト用のお仕事体験です。',
    organizer_id: TEST_USER_ID_1,
    location: '東京',
    date: '2025-10-20',
    post_type: 0,
  };
  const expResult = await createExperience(expData);
  const createdExperience = expResult.data?.[0]; // 作成されたオブジェクトを取得
  if (!createdExperience) {
    console.error('体験の作成に失敗しました。', expResult.error);
    return;
  }
  const createdExpId = createdExperience.id;
  console.log('作成された体験:', createdExperience);

  const allExperiences = await getExperiences();
  console.log('すべてのお仕事体験:', allExperiences.data);
  const updatedExp = await updateExperience(createdExpId, { title: '更新されたテスト体験' });
  console.log('更新された体験:', updatedExp.data);

  // **お仕事体験画像テーブル (experience_images)**
  console.log('\n✅ experience_imagesテーブルのCRUDテスト');
  await addExperienceImage(createdExpId, 'http://example.com/image1.jpg');
  const images = await getImagesForExperience(createdExpId);
  console.log('取得した画像:', images.data);
  if (images.data && images.data.length > 0) {
    await deleteExperienceImage(images.data[0].id);
    console.log('画像が削除されました。');
  }

  // **参加申し込みテーブル (booking)**
  console.log('\n✅ bookingテーブルのCRUDテスト');
  await createBooking(TEST_USER_ID_2, createdExpId);
  const bookings = await getBookingsForExperience(createdExpId);
  console.log('取得した参加申し込み:', bookings.data);
  if (bookings.data && bookings.data.length > 0) {
    await deleteBooking(bookings.data[0].id);
    console.log('参加申し込みが削除されました。');
  }
  
  // **いいねテーブル (likes)**
  console.log('\n✅ likesテーブルのCRUDテスト');
  await createLike(TEST_USER_ID_2, createdExpId);
  const likesCount = await getLikesCount(createdExpId);
  console.log('いいねの数:', likesCount.count);
  // deleteLike のテストは今回は割愛します

  // **メッセージテーブル (messages)**
  console.log('\n✅ messagesテーブルのCRUDテスト');
  await createMessage(TEST_USER_ID_1, TEST_USER_ID_2, 'こんにちは！');
  const conversation = await getConversation(TEST_USER_ID_1, TEST_USER_ID_2);
  console.log('取得した会話:', conversation.data);
  
  // **スワイプ操作テーブル (tend)**
  console.log('\n✅ tendテーブルのCRUDテスト');
  await createSwipe(TEST_USER_ID_1, createdExpId, 1);
  const swipes = await getSwipesByUser(TEST_USER_ID_1);
  console.log('取得したスワイプ履歴:', swipes.data);

  // **クリーンアップ (experiencesの削除)**
  // 最後に作成した体験談を削除します
  await deleteExperience(createdExpId);
  console.log('\n--- すべてのテストが完了しました。体験談を削除しました。---');
};

export default function CrudTestPage() {
  useEffect(() => {
    // ページロード時にすべてのテストを実行
    runAllTests();
  }, []);

  return (
    <div>
      <h1>CRUDテスト実行中</h1>
      <p>結果はブラウザの開発者ツールのコンソールで確認してください。</p>
    </div>
  );
}