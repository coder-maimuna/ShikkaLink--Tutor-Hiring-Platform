"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

type StudentSummary = {
  student_id?: number;
  student_name?: string;
  subject?: string;
  student_class?: string;
  session_count?: number;
};

export default function TutorMyStudentsPage() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/dashboard/tutor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents(response.data?.myStudents ?? []);
      } catch (error) {
        console.error("Failed to load tutor students", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">My students</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Students currently assigned to you</h1>
          </div>
          <Link
            href="/dashboard/tutor"
            className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#DCEFE2] bg-white p-10 text-center text-sm text-[#4B5563]">
          Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCEFE2] bg-white p-8 text-center text-sm text-[#4B5563]">
          No students are assigned yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div key={student.student_id ?? student.student_name ?? student.subject} className="rounded-2xl border border-[#DCEFE2] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#1F2937]">{student.student_name || "Unknown student"}</h2>
                  <p className="mt-1 text-sm text-[#4B5563]">Subject: {student.subject || "Not specified"}</p>
                </div>
                <div className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#2D7A3A]">
                  {student.session_count ?? 0} sessions
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#4B5563]">
                <span>Class: {student.student_class || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
