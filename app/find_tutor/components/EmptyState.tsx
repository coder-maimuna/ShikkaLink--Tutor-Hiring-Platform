"use client";

import { SearchX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow">
      <SearchX className="mb-4 h-16 w-16 text-green-600" />

      <h2 className="text-2xl font-bold">
        No Tutors Found
      </h2>

      <p className="mt-2 text-gray-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}