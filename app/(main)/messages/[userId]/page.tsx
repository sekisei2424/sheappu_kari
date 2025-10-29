import { notFound } from 'next/navigation';
import MessageDisplay from '@/components/features/messages/MessageDisplay'; // 新しく作成するクライアントコンポーネント

interface MessagesPageProps {
  params: { userId: string };
}

export default async function MessagesPage({ params }: MessagesPageProps) {
    
    const recipientId = params.userId; // URLから取得した会話相手のID
    
    // サーバーサイドでのフェッチロジックをすべて削除

    return (
        <div>
            <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4">
                <h1 className="text-xl font-bold">Message with {recipientId.slice(0, 8)}...</h1>
            </header>

            {/* クライアントコンポーネントでメッセージロジックを実行 */}
            <MessageDisplay recipientId={recipientId} />
            
        </div>
    );
}