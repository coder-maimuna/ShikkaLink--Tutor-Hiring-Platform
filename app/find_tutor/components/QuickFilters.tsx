"use client";

import { quickFilters } from "../constants/filters";

interface Props {
  onSelect: (subject: string) => void;
}

export default function QuickFilters({
  onSelect,
}: Props) {

  return (

    <div className="mt-8 flex flex-wrap justify-center gap-4">

      {quickFilters.map((item) => (

        <button
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-full border border-green-200 bg-green-50 px-5 py-2 font-medium text-green-700 transition hover:bg-green-700 hover:text-white"
        >
          {item}
        </button>

      ))}

    </div>

  );
}