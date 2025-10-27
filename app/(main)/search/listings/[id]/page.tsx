"use client";

import { useParams, useRouter } from "next/navigation";
import ListingDetail from "@/components/features/listings/ListingDetail";

export default function ListingDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="text-orange-500 underline mb-2">
        ← 戻る
      </button>
      <ListingDetail id={id} />
    </div>
  );
}
