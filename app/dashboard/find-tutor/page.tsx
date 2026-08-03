"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api, { apiErrorMessage } from "@/lib/api";

interface Tutor {
  tutor_id?: number | string;
  full_name?: string;
  subjects?: string;
  rating?: number | string;
  salary_min?: number | string;
  salary_max?: number | string;
  class_range?: string;
}

export default function FindTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTutors() {
      try {
        const response = await api.get<{ tutors?: Tutor[] }>("/api/tutors/search");
        if (active) {
          setTutors(response.data?.tutors || []);
        }
      } catch (err) {
        if (active) {
          setError(apiErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTutors();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">Find Tutors</h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading tutors…</p>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : tutors.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          <Search className="mx-auto mb-4 text-gray-400" />
          <h3 className="font-medium text-slate-900">No tutors available</h3>
          <p className="mt-2 text-sm text-slate-500">New tutors will appear here once added.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tutors.map((tutor) => (
            <Card key={tutor.tutor_id ?? tutor.full_name} className="shadow-none">
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900">{tutor.full_name || "Tutor"}</h3>
                <p className="mt-1 text-sm text-slate-500">{tutor.subjects || tutor.class_range || "Subject"}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {tutor.salary_min && tutor.salary_max ? `৳${tutor.salary_min} - ৳${tutor.salary_max}` : "Rate available on request"}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-700">⭐ {tutor.rating ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}