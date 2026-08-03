"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'http://localhost:5000/dashboard/admin',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (active) setData(result);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, []);

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

  const stats = data?.stats || {
    total_students: 0,
    total_tutors: 0,
    verified_tutors: 0,
    pending_tutors: 0,
    open_complaints: 0,
    total_sessions: 0
  };
  const recentPendingTutors = data?.recentPendingTutors || [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">
            Admin Dashboard
          </h1>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-3xl font-bold text-[#2D7A3A] mt-1">
              {stats.total_students}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Tutors</p>
            <p className="text-3xl font-bold text-[#2D7A3A] mt-1">
              {stats.total_tutors}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Verified Tutors</p>
            <p className="text-3xl font-bold text-[#2D7A3A] mt-1">
              {stats.verified_tutors}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-3xl font-bold text-[#2D7A3A] mt-1">
              {stats.pending_tutors}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Open Complaints</p>
            <p className="text-3xl font-bold text-[#2D7A3A] mt-1">
              {stats.open_complaints}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-3xl font-bold text-[#2D7A3A] mt-1">
              {stats.total_sessions}
            </p>
          </div>
        </div>

        {stats.pending_tutors > 0 && (
          <section className="mb-6 rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                Recent Pending Tutors ({stats.pending_tutors})
              </h2>
              <a
                href="/dashboard/admin/pending"
                className="inline-flex items-center rounded-lg bg-[#2D7A3A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#256830]"
              >
                Review All
              </a>
            </div>
            <div className="space-y-3">
              {!recentPendingTutors.length ? (
                <p className="text-sm text-[#1A1A1A]/60">No pending tutor requests</p>
              ) : (
                recentPendingTutors.map((tutor: any) => (
                  <div
                    key={tutor.user_id}
                    className="flex items-center justify-between rounded-xl border border-[#E8F5E9] bg-[#E8F5E9]/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D7A3A] text-sm font-semibold text-white">
                        {String(tutor.full_name || "T").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {tutor.full_name || "Tutor"}
                        </p>
                        <p className="text-sm text-[#1A1A1A]/60">
                          {tutor.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <a
                      href="/dashboard/admin/pending"
                      className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#2D7A3A] hover:bg-[#E8F5E9]"
                    >
                      Review
                    </a>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
