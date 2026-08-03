"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import QuickFilters from "./QuickFilters";

export default function SearchHero() {

  const [search, setSearch] = useState("");

  return (

    <section className="bg-gradient-to-b from-green-50 to-white py-20">

      <div className="mx-auto flex max-w-7xl flex-col items-center px-6">

        <h1 className="text-center text-5xl font-bold text-gray-900">

          Find the Perfect Tutor

        </h1>

        <p className="mt-5 max-w-3xl text-center text-lg text-gray-600">

          Discover experienced tutors across Bangladesh for school, college,
          university and professional learning.

        </p>

        <SearchBar

          value={search}

          onChange={setSearch}

        />

        <QuickFilters

          onSelect={(subject) => setSearch(subject)}

        />

      </div>

    </section>

  );
}