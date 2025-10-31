import { notFound } from 'next/navigation';
import MessageDisplay from '@/components/features/messages/MessageDisplay';

// サーバー側で認証情報を取得するための関数は使用を停止します

interface MessagesPageProps {
  params: { userId: string };
}

// エラー回避のため、async キーワードを維持し、paramsを構造化代入で取得
export default async function MessagesPage({ params }: MessagesPageProps) {

  // App Routerの厳格なチェックを回避するための、最も安全なparamsの取得方法
  const { userId: applicantId } = params;

  // サーバー側での認証チェックとデータフェッチロジックはすべて削除し、
  // クライアントコンポーネント (MessageDisplay) に委譲します。

  return (
    <div>
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4">
        {/* 画面表示用 */}
        <h1 className="text-xl font-bold">Message with {applicantId.slice(0, 8)}...</h1>
      </header>

      {/* MessageDisplayに相手のIDだけを渡す。MessageDisplay内で全ロジックを実行 */}
      <MessageDisplay
        recipientId={applicantId}
      />
    </div>
  );
}