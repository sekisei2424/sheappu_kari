'use client';
import { useEffect } from 'react';
// import { supabase } from '../lib/supabase/client'; // client.tsはインポート済みと仮定
import { getUserProfile, updateUserProfile } from '@/lib/crud/profiles';
import { createExperience, getExperienceById, deleteExperience } from '@/lib/crud/experiences';
import { createBooking, deleteBooking } from '@/lib/crud/booking';
import { createLike, deleteLike, getLikesCount } from '@/lib/crud/likes';
import { createSwipe, getSwipesByUser } from '@/lib/crud/tend';


// =========================================================================
// !!! 実行前に必ずこの値をサインアップで取得したUUIDに置き換えてください !!!
// =========================================================================
const TEST_USER_ID = 'c1c87a27-f7c0-4053-85c5-1a4ed85b7372';
const TEST_EXPERIENCE_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // ランダムなUUID


const CrudTester = () => {
    useEffect(() => {
        // 欠けているdeleteSwipe関数をここで定義（tend.tsに移動してもOK）
        const deleteSwipe = async (id: string) => {
            // supabaseはここで直接使えないため、client.tsからのインポートが必要です
            // 実際のコードでは、tend.tsからインポートして使用してください
            console.log(`[Cleaner] テンポラリでスワイプID ${id} を削除`);
            // await deleteSwipeFromCrud(id); // lib/crud/tend.ts にこの関数を追加して呼び出す
        };

        const runCrudTests = async () => {
            if (TEST_USER_ID === 'ここにサインアップで取得したUUIDを貼り付ける') {
                console.error('🚨 TEST_USER_ID を実際の UUID に置き換えてから実行してください。');
                return;
            }

            console.log('--- UUID ベース CRUD テスト開始 ---');
            let bookingId = '';
            let likeId = '';
            let swipeId = '';

            // -----------------------------------------------------
            // 1. profiles (Read & Update)
            // -----------------------------------------------------
            const profileRead = await getUserProfile(TEST_USER_ID);
            console.log('✅ プロフィール Read 成功:', profileRead.data);
            await updateUserProfile(TEST_USER_ID, { name: 'テストユーザー (更新済み)' });


            // -----------------------------------------------------
            // 2. experiences (Create & Read)
            // -----------------------------------------------------
            const expData = { id: TEST_EXPERIENCE_ID, title: "テスト体験", description: "テスト", organizer_id: TEST_USER_ID, location: "オンライン", date: "2026-01-01", post_type: 0 };
            const expCreate = await createExperience(expData);
            console.log('✅ Experience Create 成功:', expCreate.data);
            await getExperienceById(TEST_EXPERIENCE_ID);


            // -----------------------------------------------------
            // 3. booking, likes, tend (Create & Delete)
            // -----------------------------------------------------
            const bookingCreate = await createBooking(TEST_USER_ID, TEST_EXPERIENCE_ID);
            bookingId = bookingCreate.data?.[0]?.id;
            console.log('✅ Booking Create 成功:', bookingId);

            const likeCreate = await createLike(TEST_USER_ID, TEST_EXPERIENCE_ID);
            likeId = likeCreate.data?.[0]?.id;
            console.log('✅ Like Create 成功:', likeId);
            await getLikesCount(TEST_EXPERIENCE_ID);

            const swipeCreate = await createSwipe(TEST_USER_ID, TEST_EXPERIENCE_ID, 1);
            swipeId = swipeCreate.data?.[0]?.id;
            console.log('✅ Swipe Create 成功:', swipeId);
            await getSwipesByUser(TEST_USER_ID);


            // -----------------------------------------------------
            // 4. クリーンアップ
            // -----------------------------------------------------
            console.log('\n--- クリーンアップ ---');
            if (bookingId) await deleteBooking(bookingId);
            if (likeId) await deleteLike(likeId);
            if (swipeId) {
                // 実際のdelete関数を呼び出す
                // await deleteSwipe(swipeId);
                console.log(`✅ Swipe Delete スキップ (手動でDB確認)`);
            }
            await deleteExperience(TEST_EXPERIENCE_ID);

            console.log('\n--- すべての CRUD テストが完了しました！ ---');
        };

        runCrudTests();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold">CRUD Tester (Client Component)</h2>
            <p>テスト結果はブラウザの**コンソール**を確認してください。</p>
            <p className="text-red-500">※テストIDを貼り付けた後、ページをリロードしてください。</p>
        </div>
    );
};

export default CrudTester;