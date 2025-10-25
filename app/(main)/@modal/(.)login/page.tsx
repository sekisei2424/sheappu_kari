"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Modal from "@/components/ui/Modal";

export default function LoginModalPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const close = () => {
    // 直前の画面に戻る（モーダルを閉じる）
    router.back();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    // 成功 → モーダルを閉じてUI更新
    router.back();
    router.refresh();
  };

  return (
    <Modal title="ログイン" onClose={close}>
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
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
          {loading ? "処理中..." : "ログイン"}
        </button>
      </form>
    </Modal>
  );
}
