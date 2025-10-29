'use client';
import React, { useState } from 'react';
import { confirmAndTrackBooking } from '@/lib/crud/booking'; // RPC呼び出し関数

interface ReservationButtonProps {
    organizerId: string; // 企業ユーザーID (予約ボタンを押す人)
    applicantId: string; // 申し込みをした個人ユーザーID (予約される人)
    listingId: string;   // 予約対象の募集ID
}

export default function ReservationButton({ organizerId, applicantId, listingId }: ReservationButtonProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleConfirm = async () => {
        if (!confirm('このユーザーの予約を確定しますか？')) return;
        
        setStatus('loading');
        
        // confirmAndTrackBooking RPCを呼び出し
        const { data, error } = await confirmAndTrackBooking(
            applicantId, // 予約するユーザーは applicantId (個人)
            listingId    // 予約対象の募集
        );

        if (error) {
            console.error('予約確定失敗:', error);
            alert(`予約確定エラー: ${error.message}. (募集人数オーバーかID不正)`);
            setStatus('error');
        } else {
            console.log('予約確定成功:', data);
            // 予約確定通知メッセージを自動送信するロジックをここに追加しても良い
            setStatus('success');
        }
    };

    if (status === 'success') {
        return <div className="p-2 bg-green-500 text-white rounded mt-4">✅ 予約確定済み</div>;
    }

    return (
        <div className="p-4 border-t border-gray-700">
            <button 
                onClick={handleConfirm} 
                disabled={status === 'loading'}
                className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-500"
            >
                {status === 'loading' ? '予約確定処理中...' : '正式に予約を確定する'}
            </button>
        </div>
    );
}