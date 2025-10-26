"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ title, children, onClose }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 直下のcontent以外(=オーバーレイ)をクリックしたら閉じる
    if (e.target === containerRef.current) onClose();
  };

  return (
    <div
      ref={containerRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white text-black shadow-xl">
        <button
          aria-label="閉じる"
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-black/5"
        >
          <X size={18} />
        </button>
        {title && (
          <div className="px-5 pt-5 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
