'use client';
import { useEffect, useState } from 'react';
import { createApplicationMessage, createMessage, getConversation } from '@/lib/crud/messages';
import { deletePost } from '@/lib/crud/posts'; // クリーンアップ用

// !!! 実行前に必ず以下の値を存在する UUID に置き換えてください !!!
const USER_A_ID = 'c1c87a27-f7c0-4053-85c5-1a4ed85b7372'; // 例: 応募者
const USER_B_ID = '036e078c-bc56-4d7e-bee8-9340d39346fa'; // 例: 募集掲載者
const LISTING_ID = '036e078c-bc56-4d7e-bee8-9340d39346fa'; // 例: 紐づけ先

const MessageTester = () => {
    const [status, setStatus] = useState('テスト待機中...');
    const [messages, setMessages] = useState<any[]>([]);

    const runMessageTests = async () => {
        if (USER_A_ID.includes('貼り付ける') || LISTING_ID.includes('貼り付ける')) {
            setStatus('🚨 エラー: テストIDを正しく設定してください。');
            return;
        }

        setStatus('1. 応募メッセージ送信中...');

        // -----------------------------------------------------
        // 1. 応募メッセージの作成 (Create Application Message)
        // -----------------------------------------------------
        const appBody = "この案件に応募します。";
        const appMessageResult = await createApplicationMessage(
            USER_A_ID,
            USER_B_ID,
            LISTING_ID,
            appBody
        );

        if (appMessageResult.error) {
            console.error('🚨 応募メッセージ作成失敗:', appMessageResult.error);
            setStatus(`🚨 応募メッセージ失敗: ${appMessageResult.error.message}`);
            return;
        }

        // -----------------------------------------------------
        // 2. 通常メッセージの作成 (返信)
        // -----------------------------------------------------
        setStatus('2. 通常メッセージ送信中 (企業からの返信)...');
        const replyBody = "承知しました！日程調整お願いします。";
        const replyMessageResult = await createMessage(USER_B_ID, USER_A_ID, replyBody);

        if (replyMessageResult.error) {
            console.error('🚨 通常メッセージ作成失敗:', replyMessageResult.error);
            setStatus('🚨 通常メッセージ失敗。');
            return;
        }

        // -----------------------------------------------------
        // 3. 会話履歴の取得
        // -----------------------------------------------------
        setStatus('3. 会話履歴を取得中...');
        const conversationResult = await getConversation(USER_A_ID, USER_B_ID);

        if (conversationResult.error) {
            console.error('🚨 会話履歴の取得失敗:', conversationResult.error);
            setStatus('🚨 会話履歴取得失敗。');
            return;
        }

        if (conversationResult.data) {
            setMessages(conversationResult.data);
            setStatus(`✅ 全てのメッセージテスト成功！合計 ${conversationResult.data.length} 件`);
            console.log('取得データ（構造確認）:', conversationResult.data);
        } else {
            // データが null だった場合の処理 (エラーではないがデータなし)
            setMessages([]);
            setStatus('✅ 会話履歴なし。');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-3">メッセージテスト制御</h2>
            <button
                onClick={runMessageTests}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={status.includes('成功')}
            >
                メッセージ機能テスト実行
            </button>
            <p className="mt-3 font-semibold">{status}</p>

            {messages.map((msg, index) => {
                // 送信者の名前を安全に取得。取得できなければ「不明なユーザー」とする
                const senderName = msg.sender?.name || '不明なユーザー';

                return (
                    <div key={index} className={`p-2 my-1 rounded ${msg.sender_id === USER_A_ID ? 'bg-gray-700 text-right' : 'bg-gray-600'}`}>
                        <p className="text-xs text-gray-400">{senderName} ({msg.is_application ? '応募' : '通常'})</p>
                        <p>{msg.body}</p>
                    </div>
                );
            })}

            {/* クリーンアップ機能は省略しましたが、必要であれば追加してください */}
        </div>
    );
};

export default MessageTester;