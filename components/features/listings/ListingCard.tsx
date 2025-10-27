"use client";

import Link from "next/link";

export type ListingCardProps = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  href?: string; // override link path
};

export default function ListingCard({ id, title, description, location, date, href }: ListingCardProps) {
  const to = href ?? `/search/listings/${id}`;
  return (
    <Link href={to} className="block no-underline text-black">
      <div className="bg-white border rounded-lg shadow-md p-3 hover:shadow-lg transition cursor-pointer h-40 flex flex-col">
        <h3 className="font-bold line-clamp-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">{description}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>{location ?? "場所未定"}</span>
          <span>{date ? new Date(date).toLocaleDateString() : "日程未定"}</span>
        </div>
      </div>
    </Link>
  );
}
