"use client";
import SearchHero from "./components/SearchHero";
import FilterSidebar from "./components/FilterSidebar";
import TutorList from "./components/TutorList";

export default function FindTutorPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">

      <SearchHero />

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Sidebar */}

          <div className="lg:col-span-1">
            <FilterSidebar
              filters={{
                subject: "",
                class_range: "",
                min_salary: "",
                max_salary: "",
                sort_by: "",
              }}
              onChange={() => {}}
            />
          </div>

          {/* Tutor List */}

          <div className="lg:col-span-3">
            <TutorList />
          </div>

        </div>

      </section>

    </main>
  );
}