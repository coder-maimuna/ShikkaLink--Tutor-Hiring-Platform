"use client";

import TutorCard from "./TutorCard";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

import { Tutor } from "../types/tutor";
import { mockTutors } from "../data/mockTutors";

interface TutorListProps {
  tutors?: Tutor[];
  loading?: boolean;
}

export default function TutorList({
  tutors = mockTutors,
  loading = false,
}: TutorListProps) {

  if (loading) {
    return (
      <section className="flex-1 space-y-6">

        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />

      </section>
    );
  }

  if (!tutors.length) {
    return (
      <section className="flex-1">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="flex-1">

      {/* Header */}

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h2 className="text-3xl font-bold text-gray-900">
            Available Tutors
          </h2>

          <p className="mt-1 text-gray-500">
            {tutors.length} tutor{tutors.length > 1 ? "s" : ""} found
          </p>

        </div>

      </div>

      {/* Tutor Cards */}

      <div className="space-y-6">

        {tutors.map((tutor) => (
          <TutorCard
            key={tutor.tutor_id}
            tutor={tutor}
          />
        ))}

      </div>

    </section>
  );
}