"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// ★修正点 1: createBooking を削除し、createApplicationMessage をインポート
import { createApplicationMessage } from "@/lib/crud/messages";
import { getListingById, type ListingWithPost } from "@/lib/crud/listings";
// import { createBooking } from "@/lib/crud/booking"; // 削除
import { useUser } from "@/hooks/useUser";
// ★修正点 2: 古い getExperienceById, Experience のインポートを削除
// import { getExperienceById, type Experience } from "@/lib/crud/experiences";


export type ListingDetailProps = {
  id: string;
  onApplied?: () => void;
};

// Experience 型へのアクセスを避けるため、ListingWithPost のみを扱う
// ListingWithPost は posts テーブルのデータを含む想定
type Experience = any;

export default function ListingDetail({ id, onApplied }: ListingDetailProps) {
  const [listing, setListing] = useState<ListingWithPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  // ★修正点 3: experience state を削除
  // const [experience, setExperience] = useState<Experience | null>(null); 
  const router = useRouter();
  const { user } = useUser(); // ログインユーザー情報を取得するカスタムフックと仮定

  // -----------------------------------------------------
  // 募集情報のフェッチと表示
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const { data, error } = await getListingById(id);
      if (error) {
        console.error("getListingById error", error);
        setError("募集情報の取得に失敗しました");
      }
      setListing(data ?? null);

      // ★修正点 4: 古いテーブルを参照するロジックを完全に削除★
      // const { data: exp, error: expErr } = await getExperienceById(id); 
      // if (expErr) { console.warn("getExperienceById warn", expErr); }
      // setExperience(exp ?? null);

      setLoading(false);
    };
    run();
  }, [id]);

  // -----------------------------------------------------
  // 応募（メッセージ開始）ロジック
  const handleApply = async () => {

    // ★ここを追加★
    console.log("--- 応募処理開始 ---");
    console.log("User Object:", user);

    if (!user) {
      router.push("/login");
      return;
    }
    // posts データが存在しない場合は処理を中断
    if (!listing || !listing.posts) return;

    const organizerId = listing.organizer_id;

    try {
      setApplying(true);

      const initialBody = `【応募】${listing.posts.title}への応募を希望します。メッセージで日程調整をお願いします。`;

      const { error: msgError } = await createApplicationMessage(
        user.id,        // 送信者: 個人 (ログインユーザー)
        organizerId,    // 受信者: 企業 (募集掲載者)
        listing.post_id, // 関連募集ID (listing.post_id)
        initialBody,
      );

      if (msgError) {
        console.error("createApplicationMessage error", msgError);
        alert("応募メッセージの送信に失敗しました。");
        return;
      }

      setApplied(true);
      onApplied?.();

      // モーダル内から直接別ページへ push すると、並列ルートのモーダルが残る場合があるため
      // まずモーダルの onClose に接続されている `router.back()` を実行してモーダルを閉じ、
      // その後メッセージ画面へ遷移します。
      // replace を使うことで履歴を増やさずに遷移します。
      try {
        router.back();
      } finally {
        // 少し遅延してから確実に置換遷移
        setTimeout(() => {
          router.replace(`/messages/${organizerId}`);
        }, 100);
      }

    } finally {
      setApplying(false);
    }
  };

  // -----------------------------------------------------
  // レンダリングロジックの修正
  // -----------------------------------------------------

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error ?? "募集が見つかりません"}</p>
      </div>
    );
  }

  // experience への依存を削除し、listing.posts に一本化
  const p = listing?.posts;
  const title = p?.title ?? "募集詳細";
  const description = p?.description ?? null;
  const location = p?.location ?? "場所未定";
  const dateStr = p?.date ?? null;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-gray-700">{description}</p>}
      <div className="text-sm text-gray-600 flex gap-2">
        <span>{location}</span>
        <span>・</span>
        <span>{dateStr ? new Date(dateStr).toLocaleDateString() : "日程未定"}</span>
      </div>

      <div className="rounded-lg bg-white border p-3">
        <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
          <div>
            <div className="text-gray-500">募集状況</div>
            <div className="font-medium">{listing ? listing.status : "公開準備中"}</div>
          </div>
          <div>
            <div className="text-gray-500">募集枠</div>
            <div className="font-medium">{listing ? listing.slots_available : "-"}</div>
          </div>
          <div>
            <div className="text-gray-500">締切</div>
            <div className="font-medium">{listing?.application_deadline ? new Date(listing.application_deadline).toLocaleDateString() : "未設定"}</div>
          </div>
          {/* experience に依存していた主催者名の表示ロジックを修正する必要がある場合があります */}
        </div>
      </div>

      <button
        onClick={handleApply}
        disabled={applied || applying || !listing}
        className={`w-full p-3 rounded-full text-white font-bold mt-2 transition ${!listing
          ? "bg-gray-300 cursor-not-allowed"
          : applied
            ? "bg-gray-400 cursor-not-allowed"
            : applying
              ? "bg-orange-400 cursor-wait"
              : "bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-md"
          }`}
      >
        {!listing ? "現在応募準備中" : applied ? "応募済み" : applying ? "応募中..." : "この案件に応募する!"}
      </button>

      {!user && (
        <p className="text-xs text-gray-500 text-center">
          応募にはログインが必要です。ボタンを押すとログインモーダルが開きます。
        </p>
      )}
    </div>
  );
}