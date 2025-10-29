import MessageTester from '@/components/MessageTester';

// App Routerではpage.tsxはデフォルトでサーバーコンポーネントです
export default function MessageTestPage() { // 関数名を MessageTestPage に変更しても良い

  // サーバーコンポーネントで、クライアントコンポーネントをレンダリングします
  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">メッセージ機能 統合テスト</h1>
      <p className="mb-4">このページは、応募とメッセージの送受信が新しい設計で動作することを検証します。</p>

      <MessageTester />

    </div>
  );
}