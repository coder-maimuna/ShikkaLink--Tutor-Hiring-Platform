"use client";

import { Filter, RotateCcw } from "lucide-react";

export interface SearchFilters {
  subject: string;
  class_range: string;
  min_salary: string;
  max_salary: string;
  sort_by: string;
}

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onApply?: () => void;
}

const SUBJECTS = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "English",
  "Bangla",
  "Accounting",
  "Finance",
  "Programming",
];

const CLASSES = [
  "All",
  "PSC",
  "JSC",
  "SSC",
  "HSC",
  "O Level",
  "A Level",
  "University",
];

const SORT_OPTIONS = [
  {
    label: "Highest Rating",
    value: "rating",
  },
  {
    label: "Lowest Salary",
    value: "salary_low",
  },
  {
    label: "Highest Salary",
    value: "salary_high",
  },
];

export default function FilterSidebar({
  filters,
  onChange,
  onApply,
}: FilterSidebarProps) {
  const update = (
    key: keyof SearchFilters,
    value: string
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onChange({
      subject: "",
      class_range: "",
      min_salary: "",
      max_salary: "",
      sort_by: "",
    });
  };

  return (
    <aside
      className="
      sticky
      top-24
      h-fit
      rounded-2xl
      border
      border-green-100
      bg-white
      p-6
      shadow-md
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Filter
            className="text-green-700"
            size={22}
          />

          <h2 className="text-xl font-bold">
            Filters
          </h2>

        </div>

        <button
          onClick={clearFilters}
          className="
          flex
          items-center
          gap-1
          text-sm
          text-red-500
          hover:text-red-700
          "
        >
          <RotateCcw size={16} />
          Reset
        </button>

      </div>

      <div className="space-y-5">

        {/* Subject */}

        <div>

          <label className="mb-2 block font-medium">
            Subject
          </label>

          <select
            value={filters.subject}
            onChange={(e) =>
              update("subject", e.target.value)
            }
            className="
            w-full
            rounded-lg
            border
            border-gray-300
            p-3
            focus:border-green-500
            focus:outline-none
            "
          >
            <option value="">All Subjects</option>

            {SUBJECTS.map((subject) => (
              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>
            ))}
          </select>

        </div>

        {/* Class */}

        <div>

          <label className="mb-2 block font-medium">
            Class
          </label>

          <select
            value={filters.class_range}
            onChange={(e) =>
              update(
                "class_range",
                e.target.value
              )
            }
            className="
            w-full
            rounded-lg
            border
            border-gray-300
            p-3
            focus:border-green-500
            focus:outline-none
            "
          >
            <option value="">All Classes</option>

            {CLASSES.map((cls) => (
              <option
                key={cls}
                value={cls}
              >
                {cls}
              </option>
            ))}
          </select>

        </div>

        {/* Salary */}

        <div>

          <label className="mb-2 block font-medium">
            Salary Range
          </label>

          <div className="flex gap-3">

            <input
              type="number"
              placeholder="Min"
              value={filters.min_salary}
              onChange={(e) =>
                update(
                  "min_salary",
                  e.target.value
                )
              }
              className="
              w-full
              rounded-lg
              border
              border-gray-300
              p-3
              "
            />

            <input
              type="number"
              placeholder="Max"
              value={filters.max_salary}
              onChange={(e) =>
                update(
                  "max_salary",
                  e.target.value
                )
              }
              className="
              w-full
              rounded-lg
              border
              border-gray-300
              p-3
              "
            />

          </div>

        </div>

        {/* Sort */}

        <div>

          <label className="mb-2 block font-medium">
            Sort By
          </label>

          <select
            value={filters.sort_by}
            onChange={(e) =>
              update(
                "sort_by",
                e.target.value
              )
            }
            className="
            w-full
            rounded-lg
            border
            border-gray-300
            p-3
            focus:border-green-500
            focus:outline-none
            "
          >
            <option value="">
              Select
            </option>

            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}

          </select>

        </div>

        {/* Apply */}

        <button
          onClick={onApply}
          className="
          mt-4
          w-full
          rounded-lg
          bg-green-700
          py-3
          font-semibold
          text-white
          transition
          hover:bg-green-800
          "
        >
          Apply Filters
        </button>

      </div>

    </aside>
  );
}