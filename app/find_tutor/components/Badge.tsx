"use client";

interface BadgeProps {
  text: string;
}

export default function Badge({
  text,
}: BadgeProps) {
  return (
    <span
      className="
      rounded-full
      bg-green-100
      text-green-700
      px-3
      py-1
      text-xs
      font-medium
      "
    >
      {text}
    </span>
  );
}