'use client';
import React, { useState } from 'react';
import { confirmAndTrackBooking } from '@/lib/crud/booking'; // RPC呼び出し関数
import { createMessage } from '@/lib/crud/messages'; // ★追加: メッセージ送信関数をインポート

interface ReservationButtonProps {
    organizerId: string; // 企業ユーザーID (予約ボタンを押す人)
    applicantId: string; // 申し込みをした個人ユーザーID (予約される人)
    listingId: string;   // 予約対象の募集ID
    // ★追加のProps: 予約確定後にメッセージリストをリフレッシュするためのコールバック
    onBookingConfirmed: () => Promise<void>; 
}

export default function ReservationButton({ organizerId, applicantId, listingId, onBookingConfirmed }: ReservationButtonProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleConfirm = async () => {
        if (status === 'loading') return;
        if (!confirm('このユーザーの予約を確定しますか？（キャンセルはできません）')) return;
        
        setStatus('loading');
        
        // 1. RPCを呼び出し、データベース処理（予約記録と募集人数の削減）を実行
        const { data, error } = await confirmAndTrackBooking(
            applicantId, // 予約するユーザーは applicantId (個人)
            listingId    // 予約対象の募集
        );

        if (error) {
            console.error('予約確定失敗:', error);
            alert(`予約確定エラー: ${error.message}. (募集人数オーバー、またはID不正)`);
            setStatus('error');
            return; // エラーの場合はここで処理終了
        }
        
        // 2. 予約確定通知メッセージの自動送信 (成功時のみ)
        try {
            const confirmationBody = "✅ 予約が正式に確定しました。当日はよろしくお願いします。";
            
            // 企業 (organizerId) から 個人 (applicantId) へ通知メッセージを送信
            await createMessage(
                organizerId, 
                applicantId, 
                confirmationBody
            );

            // 3. 親コンポーネント (MessageDisplay) にメッセージリストの更新を通知
            await onBookingConfirmed();

            console.log('予約確定と通知メッセージ送信に成功しました。');
            setStatus('success');
            
        } catch (messageError) {
            console.error('通知メッセージ送信は失敗しましたが、予約確定自体は成功しています。', messageError);
            setStatus('success'); // 予約確定は成功しているのでUIは成功状態にする
        }
    };

    if (status === 'success') {
        return <div className="p-2 bg-green-500 text-white rounded mt-4 text-center">✅ 予約確定済み</div>;
    }
    
    // エラー時の表示
    if (status === 'error') {
        return <div className="p-2 bg-red-500 text-white rounded mt-4 text-center">❌ 予約確定に失敗しました。</div>;
    }

    // 通常ボタン
    return (
        <div className="p-0"> {/* 親コンポーネント (MessageDisplay) でパディングを設定するため、ここでは削除 */}
            <button 
                onClick={handleConfirm} 
                disabled={status === 'loading'}
                className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-500 transition duration-150"
            >
                {status === 'loading' ? '予約確定処理中...' : '正式に予約を確定する'}
            </button>
        </div>
    );
}