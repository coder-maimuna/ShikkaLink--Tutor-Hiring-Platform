"use client";

import { useState } from "react";

import SearchHero from "./components/SearchHero";
import FilterSidebar, {
  SearchFilters,
} from "./components/FilterSidebar";
import TutorList from "./components/TutorList";

import { useTutorSearch } from "./hooks/useTutorSearch";

export default function FindTutorPage() {
  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    subject: "",
    class_range: "",
    min_salary: "",
    max_salary: "",
    sort_by: "",
  });

  // Fetch tutors from backend
  const {
    tutors,
    loading,
    error,
  } = useTutorSearch(filters);

  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Search Hero */}
      <SearchHero />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
            />
          </div>

          {/* Tutor List */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            ) : (
              <TutorList
                tutors={tutors}
                loading={loading}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}