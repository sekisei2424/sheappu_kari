"use client";

import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import ListingDetail from "@/components/features/listings/ListingDetail";

export default function ListingDetailModalPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  return (
    <Modal onClose={() => router.back()}>
      <div className="p-2">
        <ListingDetail id={id} />
      </div>
    </Modal>
  );
}
