"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Modal from "@/components/ui/Modal";

export default function SignUpModalPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const close = () => router.back();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError("すべての項目を入力してください");
      return;
    }
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message || "サインアップ中にエラーが発生しました");
      return;
    }
    if (!data.user) {
      setError("ユーザー作成に失敗しました");
      return;
    }
    // 成功 → モーダルを閉じてUI更新
    router.back();
    router.refresh();
  };

  return (
    <Modal title="サインアップ" onClose={close}>
      <form onSubmit={handleSignUp} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-1">
          <label className="text-sm text-gray-700">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="山田 太郎"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 text-white py-2.5 font-medium transition disabled:opacity-50"
        >
          {loading ? "処理中..." : "サインアップ"}
        </button>
      </form>
    </Modal>
  );
}
