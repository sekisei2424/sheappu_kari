import MessageDisplay from '@/components/features/messages/MessageDisplay'; 
// サーバーサイドでのAuth/DB処理をすべて削除し、純粋なレイアウトコンポーネントに戻す

interface MessagesPageProps {
  params: { userId: string };
}

// サーバー認証やデータフェッチは行いません
export default function MessagesPage({ params }: MessagesPageProps) {
  
  // params エラーを避けるため、安全に構造化代入を行う
  const { userId: applicantId } = params; 

  return (
    <div>
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4">
            <h1 className="text-xl font-bold">Message with {applicantId.slice(0, 8)}...</h1>
        </header>

        {/* MessageDisplayに相手のIDだけを渡す。MessageDisplay内で全ロジックを実行 */}
        <MessageDisplay 
            recipientId={applicantId} 
        />
    </div>
  );
}