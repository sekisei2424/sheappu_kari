import { notFound } from 'next/navigation';
import CrudTester from '@/components/CrudTester';

// App Routerではpage.tsxはデフォルトでサーバーコンポーネントです
export default function CrudTestPage() {

  // サーバーコンポーネントで、クライアントコンポーネントをレンダリングします
  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Supabase UUID CRUD 統合テスト</h1>
      <p className="mb-4">このページは、すべてのデータベース操作が新しいUUIDベースの設計で正しく動作することを検証します。</p>

      <CrudTester />

    </div>
  );
}

notFound();