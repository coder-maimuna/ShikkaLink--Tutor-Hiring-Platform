"use client";

import { Star } from "lucide-react";

interface Props {
  rating: number;
}

export default function Rating({
  rating,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <Star
        size={18}
        className="fill-yellow-400 text-yellow-400"
      />
      <span className="font-semibold">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}