"use client";

import { useEffect, useState } from "react";
import { AlertCircle, XCircle, CheckCircle2 } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'http://localhost:5000/dashboard/admin/students',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (active) setStudents(result.students || []);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load students");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudents();
    return () => { active = false; };
  }, []);

  const handleSuspend = async (id: number) => {
    if (!confirm("Suspend this student?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/user/${id}/suspend`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to suspend student");

      setStudents(prev =>
        prev.map(s =>
          s.user_id === id ? { ...s, is_active: false } : s
        )
      );
      alert("Student suspended successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to suspend student");
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("Activate this student?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/user/${id}/activate`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to activate student");

      setStudents(prev =>
        prev.map(s =>
          s.user_id === id ? { ...s, is_active: true } : s
        )
      );
      alert("Student activated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to activate student");
    }
  };

  const filteredStudents = students.filter(s =>
    (s.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
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
            All Students
          </h1>
          <p className="mt-1 text-sm text-[#1A1A1A]/60">
            Manage and monitor all registered students
          </p>
        </section>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-lg border border-[#E8F5E9] bg-white px-4 py-2.5 text-sm focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
          />
        </div>

        <div className="space-y-3">
          {!filteredStudents.length ? (
            <div className="rounded-xl border border-dashed border-[#E8F5E9] p-8 text-center text-sm text-[#1A1A1A]/60">
              {searchTerm ? "No students match your search" : "No students found"}
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.user_id}
                className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-lg font-semibold text-[#2D7A3A]">
                      {String(student.full_name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1A1A1A]">
                        {student.full_name || "Student"}
                      </p>
                      <p className="text-sm text-[#1A1A1A]/60">
                        {student.email || "No email"} · {student.phone || "No phone"}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {student.studentProfile?.student_class && (
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                            Class {student.studentProfile.student_class}
                          </span>
                        )}
                        <span className="text-xs text-[#1A1A1A]/60">
                          Joined {student.created_at ? new Date(student.created_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {student.is_active ? (
                      <button
                        type="button"
                        onClick={() => handleSuspend(student.user_id!)}
                        disabled={false}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-orange-200 px-3 py-1.5 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleActivate(student.user_id!)}
                        disabled={false}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-green-200 px-3 py-1.5 text-sm font-semibold text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
