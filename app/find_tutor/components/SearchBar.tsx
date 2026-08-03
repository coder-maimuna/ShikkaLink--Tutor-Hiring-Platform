"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {

  return (

    <div className="mt-10 flex w-full max-w-4xl overflow-hidden rounded-full border-1 border-border border-green-900 bg-white shadow-lg">

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by Subject, Tutor Name..."
        className="flex-1 px-8 py-5 outline-none"
      />

      <button className="bg-green-700 px-8 text-white hover:bg-green-800">

        <Search />

      </button>

    </div>

  );
}