"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Tutor {
  id: number;
  name: string;
  subject: string;
  rating: number;
}

export default function FindTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/tutors"
        );

        const data = await res.json();
        setTutors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold mb-6">
        Find Tutors
      </h1>

      {loading ? (
        <p>Loading tutors...</p>
      ) : tutors.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <Search className="mx-auto mb-4 text-gray-400" />
          <h3 className="font-medium">
            No tutors available
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            New tutors will appear here once added.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white border rounded-2xl p-5"
            >
              <h3 className="font-semibold">
                {tutor.name}
              </h3>

              <p className="text-sm text-gray-500">
                {tutor.subject}
              </p>

              <p className="mt-3">
                ⭐ {tutor.rating}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}