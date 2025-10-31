import ConversationListClient from '@/components/features/messages/ConversationListClient'; 

// サーバー認証ロジックは一切含まず、純粋なコンポーネントとして定義
export default function ConversationListPage() {
  return (
    <div>
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4">
        <h1 className="text-xl font-bold">メッセージ一覧</h1>
      </header>
      
      {/* クライアント側で認証と全データフェッチを実行 */}
      <ConversationListClient />
    </div>
  );
}