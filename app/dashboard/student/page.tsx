"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, CalendarDays, GraduationCap, Headphones, Users, Trash2 } from "lucide-react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import StatCard from "@/components/dashboard/StatCard";
import api, { apiErrorMessage } from "@/lib/api";
import { formatTodayDate } from "@/lib/dashboard-utils";
import type { StudentDashboardResponse } from "@/lib/dashboard-types";

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardResponse | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingSession, setCancellingSession] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await api.get<StudentDashboardResponse>("/dashboard/student");
        if (active) setData(response.data);
      } catch (err) {
        if (active) setError(apiErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  // Fetch student sessions from booking endpoint
  useEffect(() => {
    let active = true;

    async function loadSessions() {
      try {
        const response = await api.get("/student/sessions");
        if (active && response.data.success && response.data.sessions) {
          setSessions(response.data.sessions);
        }
      } catch (err) {
        console.error('Failed to load sessions:', err);
      }
    }

    loadSessions();
    return () => {
      active = false;
    };
  }, []);

  const handleCancelSession = async (sessionId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to cancel bookings");
        return;
      }

      if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
      }

      setCancellingSession(sessionId);

      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Booking cancelled successfully");
        // Refresh sessions list
        const sessionsResponse = await api.get("/student/sessions");
        setSessions(sessionsResponse.data.sessions || []);
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel booking: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error cancelling session:', err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingSession(null);
    }
  };

  const stats = useMemo(
    () => [
      {
        title: "Active Subjects",
        value: data?.stats?.active_subjects ?? 0,
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Session Hours",
        value: data?.stats?.session_hours ?? 0,
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        title: "My Tutors",
        value: data?.stats?.my_tutors ?? 0,
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Today's Sessions",
        value: data?.stats?.today_sessions ?? 0,
        icon: <GraduationCap className="h-5 w-5" />,
      },
    ],
    [data?.stats],
  );

  if (loading) return <DashboardSkeleton label="Loading student dashboard…" />;

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const sessionCount = data?.stats?.today_sessions ?? data?.todaySessions?.length ?? 0;
  const tutorMatchCount = data?.stats?.my_tutors ?? data?.myTutors?.length ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">
          Welcome Back, {data?.user?.full_name || "Student"}! 👋
        </h1>
        <p className="mt-1 text-sm text-[#1A1A1A]/60">{formatTodayDate()}</p>
        <p className="mt-1 text-sm font-medium text-[#2D7A3A]">
          You have {sessionCount} session{sessionCount === 1 ? "" : "s"} today
        </p>
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl bg-[#E8F5E9] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-[#2D7A3A]">
            Based on your progress, {tutorMatchCount} verified tutor{tutorMatchCount === 1 ? "" : "s"} found
          </p>
          <p className="mt-1 text-sm text-[#1A1A1A]/60">Personalized matches from your learning history</p>
        </div>
        <Link
          href="/dashboard/student/find-tutor"
          className="inline-flex items-center justify-center rounded-lg bg-[#2D7A3A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#256830]"
        >
          View Matches →
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Today&apos;s Sessions</h2>
          <div className="space-y-3">
            {!sessions.length ? (
              <p className="rounded-xl border border-dashed border-[#E8F5E9] p-6 text-center text-sm text-[#1A1A1A]/60">
                No sessions today 📚
              </p>
            ) : (
              sessions.map((session) => (
                <div key={session.session_id ?? `${session.subject}-${session.scheduled_time}`} className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/50">
                        {session.scheduled_time ? new Date(session.scheduled_time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : ""}
                      </p>
                      <p className="mt-1 font-semibold text-[#2D7A3A]">{session.subject || "Session"}</p>
                      <p className="text-sm text-[#1A1A1A]/70">{session.tutor_name || `Tutor #${session.tutor_id}`}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2D7A3A]">
                        {session.status || "upcoming"}
                      </span>
                      {cancellingSession === session.session_id ? (
                        <span className="text-xs text-[#1A1A1A]/50">Cancelling...</span>
                      ) : (
                        <button
                          onClick={() => handleCancelSession(session.session_id!)}
                          className="inline-flex items-center rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={12} className="mr-1" />
                          Cancel
                        </button>
                      )}
                      {session.meeting_link ? (
                        <a
                          href={session.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#256830]"
                        >
                          Join
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl bg-[#2D7A3A] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <h2 className="mb-4 text-lg font-semibold text-white">My Tutors</h2>
          <div className="space-y-3">
            {!data?.myTutors?.length ? (
              <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-white/75">
                No tutors yet. Find a tutor to get started!
              </p>
            ) : (
              data.myTutors.map((tutor) => (
                <div key={tutor.tutor_id ?? tutor.tutor_name ?? tutor.subject ?? Math.random()} className="flex items-center justify-between gap-3 rounded-xl bg-white/10 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
                      {String(tutor.tutor_id ?? tutor.tutor_name ?? "T").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{tutor.subject || "Subject"}</p>
                      <p className="truncate text-xs text-white/70">Tutor #{tutor.tutor_id ?? "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Learning Progress</h2>
        <div className="space-y-4">
          {!data?.progress?.length ? (
            <p className="rounded-xl border border-dashed border-[#E8F5E9] p-6 text-center text-sm text-[#1A1A1A]/60">
              Complete sessions to track progress!
            </p>
          ) : (
            data.progress.map((item, index) => (
              <div key={`${item.subject ?? "subject"}-${index}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#1A1A1A]">{item.subject || "Subject"}</span>
                  <span className="text-[#1A1A1A]/60">{item.session_count ?? 0} sessions</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#E8F5E9]">
                  <div
                    className={[
                      "h-full rounded-full",
                      index % 3 === 0 ? "bg-[#2D7A3A]" : index % 3 === 1 ? "bg-[#4CAF50]" : "bg-[#8BC34A]",
                    ].join(" ")}
                    style={{ width: `${Math.max(0, Math.min(100, item.progress_percentage ?? 0))}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]/50">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/dashboard/student/find-tutor"
            className="rounded-xl border border-[#E8F5E9] bg-white p-4 text-center text-sm font-medium text-[#2D7A3A] shadow-sm hover:bg-[#E8F5E9]"
          >
            Find a Tutor
          </Link>
          <Link
            href="/dashboard/student/schedule"
            className="rounded-xl border border-[#E8F5E9] bg-white p-4 text-center text-sm font-medium text-[#2D7A3A] shadow-sm hover:bg-[#E8F5E9]"
          >
            View Schedule
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8F5E9] bg-white p-4 text-sm font-medium text-[#2D7A3A] shadow-sm hover:bg-[#E8F5E9]"
          >
            <Headphones className="h-4 w-4" />
            Support
          </button>
        </div>
      </section>
    </div>
  );
}
