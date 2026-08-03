"use client";

import { useEffect, useState } from "react";
import { AlertCircle, XCircle, CheckCircle2 } from "lucide-react";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTutors() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'http://localhost:5000/dashboard/admin/tutors',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (active) setTutors(result.tutors || []);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load tutors");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTutors();
    return () => { active = false; };
  }, []);

  const handleSuspend = async (id: number) => {
    if (!confirm("Suspend this tutor?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/user/${id}/suspend`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to suspend tutor");

      setTutors(prev =>
        prev.map(t =>
          t.user_id === id ? { ...t, is_active: false } : t
        )
      );
      alert("Tutor suspended successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to suspend tutor");
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("Activate this tutor?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/user/${id}/activate`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to activate tutor");

      setTutors(prev =>
        prev.map(t =>
          t.user_id === id ? { ...t, is_active: true } : t
        )
      );
      alert("Tutor activated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to activate tutor");
    }
  };

  const filteredTutors = tutors.filter(t =>
    (t.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return null;

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">
            All Tutors
          </h1>
          <p className="mt-1 text-sm text-[#1A1A1A]/60">
            Manage and monitor all registered tutors
          </p>
        </section>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-[#E8F5E9] bg-white px-4 py-2.5 text-sm focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
          />
        </div>

        <div className="space-y-3">
          {!filteredTutors.length ? (
            <div className="rounded-xl border border-dashed border-[#E8F5E9] p-8 text-center text-sm text-[#1A1A1A]/60">
              {searchTerm ? "No tutors match your search" : "No tutors found"}
            </div>
          ) : (
            filteredTutors.map((tutor) => (
              <div
                key={tutor.user_id}
                className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-lg font-semibold text-[#2D7A3A]">
                      {String(tutor.full_name || "T").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1A1A1A]">
                        {tutor.full_name || "Tutor"}
                      </p>
                      <p className="text-sm text-[#1A1A1A]/60">
                        {tutor.email || "No email"} · {tutor.phone || "No phone"}
                      </p>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        {tutor.verification_status === 'submitted' && (
                          <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                            Submitted
                          </span>
                        )}
                        {tutor.is_verified && (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                            Verified ✓
                          </span>
                        )}
                        {!tutor.is_active && (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                            Suspended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#1A1A1A]/60">
                      {tutor.tutorProfile?.student_preference || "No preference"}
                    </span>
                    <span className="text-sm text-[#1A1A1A]/60">·</span>
                    <span className="text-sm text-[#1A1A1A]/60">
                      Rating: {tutor.tutorProfile?.rating || "N/A"}
                    </span>
                    <span className="text-sm text-[#1A1A1A]/60">·</span>
                    <span className="text-sm text-[#1A1A1A]/60">
                      Joined {tutor.created_at ? new Date(tutor.created_at).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E8F5E9] pt-4">
                  <a
                    href={`/dashboard/admin/tutor/${tutor.user_id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#E8F5E9] px-3 py-1.5 text-sm font-semibold text-[#2D7A3A] hover:bg-[#E8F5E9]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    View Profile
                  </a>
                  {tutor.is_active ? (
                    <button
                      type="button"
                      onClick={() => handleSuspend(tutor.user_id!)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-orange-200 px-3 py-1.5 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleActivate(tutor.user_id!)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-green-200 px-3 py-1.5 text-sm font-semibold text-green-600 hover:bg-green-50"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
