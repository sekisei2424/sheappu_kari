"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getListingById, type ListingWithPost } from "@/lib/crud/listings";
import { createBooking } from "@/lib/crud/booking";
import { useUser } from "@/hooks/useUser";
import { getExperienceById, type Experience } from "@/lib/crud/experiences";

export type ListingDetailProps = {
  id: string;
  onApplied?: () => void;
};

export default function ListingDetail({ id, onApplied }: ListingDetailProps) {
  const [listing, setListing] = useState<ListingWithPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const { data, error } = await getListingById(id);
      if (error) {
        console.error("getListingById error", error);
        setError("募集情報の取得に失敗しました");
      }
      setListing(data ?? null);

      // experiences テーブルにも同一IDがある想定（listings.post_id = experiences.id）
      const { data: exp, error: expErr } = await getExperienceById(id);
      if (expErr) {
        console.warn("getExperienceById warn", expErr);
      }
      setExperience(exp ?? null);
      setLoading(false);
    };
    run();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      // ログインモーダルを開く（既存の intercept ルートを利用）
      router.push("/login");
      return;
    }
    if (!listing) return;

    try {
      setApplying(true);
        const { error } = await createBooking(user.id, listing.post_id);
      if (error) {
        console.error("createBooking error", error);
        alert("応募に失敗しました。時間をおいて再度お試しください。");
        return;
      }
      setApplied(true);
      onApplied?.();
      // 応募完了後に軽くリフレッシュ（応募数などが表示される場合に）
      router.refresh();
    } finally {
      setApplying(false);
    }
  };

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

  const p = listing?.posts;
  const title = experience?.title ?? p?.title ?? "募集詳細";
  const description = experience?.description ?? p?.description ?? null;
  const location = experience?.location ?? p?.location ?? "場所未定";
  const dateStr = experience?.date ?? p?.date ?? null;

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
          {experience?.organizer_name && (
            <div>
              <div className="text-gray-500">主催</div>
              <div className="font-medium">{experience.organizer_name}</div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleApply}
        disabled={applied || applying || !listing}
        className={`w-full p-3 rounded-full text-white font-bold mt-2 transition ${
          !listing
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
