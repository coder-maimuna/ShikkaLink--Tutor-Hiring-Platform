"use client";

import { useEffect, useState } from "react";
import {
  searchTutors,
  SearchFilters,
} from "../services/tutor.service";

import { Tutor } from "../types/tutor";

export function useTutorSearch(
  filters: SearchFilters
) {
  const [tutors, setTutors] =
    useState<Tutor[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);

        const result =
          await searchTutors(filters);

        setTutors(result.tutors);

        setError("");
      } catch (err) {
        setError("Unable to load tutors.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [filters]);

  return {
    tutors,
    loading,
    error,
  };
}