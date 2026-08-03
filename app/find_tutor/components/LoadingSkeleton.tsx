"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow">

      <div className="flex gap-6">

        <div className="h-24 w-24 rounded-full bg-gray-200" />

        <div className="flex-1 space-y-4">

          <div className="h-5 w-52 rounded bg-gray-200" />

          <div className="h-4 w-40 rounded bg-gray-200" />

          <div className="h-4 w-64 rounded bg-gray-200" />

          <div className="h-10 w-full rounded bg-gray-200" />

        </div>

      </div>

    </div>
  );
}