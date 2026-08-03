import { Tutor } from "../types/tutor";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export interface SearchFilters {
  subject?: string;
  class_range?: string;
  min_salary?: string;
  max_salary?: string;
  sort_by?: string;
  page?: number;
}

interface TutorResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  tutors: Tutor[];
}

export async function searchTutors(
  filters: SearchFilters
): Promise<TutorResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined) {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${API_URL}/tutors/search?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch tutors");
  }

  return response.json();
}

export async function getTutorDetails(id: number) {
  const response = await fetch(
    `${API_URL}/tutors/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Tutor not found");
  }

  return response.json();
}