"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CalendarDays, Star, Users, Trash2 } from "lucide-react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import StatCard from "@/components/dashboard/StatCard";
import api, { apiErrorMessage } from "@/lib/api";
import { formatTodayDate } from "@/lib/dashboard-utils";
import type { TutorDashboardResponse } from "@/lib/dashboard-types";

export default function TutorDashboardPage() {
  const [data, setData] = useState<TutorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingSession, setCancellingSession] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await api.get<TutorDashboardResponse>("/dashboard/tutor");
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
        // Refresh dashboard
        const response = await api.get<TutorDashboardResponse>("/dashboard/tutor");
        if (response.data) setData(response.data);
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
        title: "Active Students",
        value: data?.stats?.active_students ?? 0,
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Sessions This Month",
        value: data?.stats?.sessions_this_month ?? 0,
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        title: "Rating",
        value: data?.stats?.rating ?? 0,
        icon: <Star className="h-5 w-5" />,
      },
    ],
    [data?.stats],
  );

  if (loading) return <DashboardSkeleton label="Loading tutor dashboard…" />;

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

  const sessionCount = data?.todaySessions?.length ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">
          Welcome Back, {data?.user?.full_name || "Tutor"}! 👋
        </h1>
        <p className="mt-1 text-sm text-[#1A1A1A]/60">{formatTodayDate()}</p>
        <p className="mt-1 text-sm font-medium text-[#2D7A3A]">
          You have {sessionCount} class{sessionCount === 1 ? "" : "es"} today
        </p>
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
        ))}
      </div>

      {/* Booked Students Section */}
      <section className="rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Booked Students</h2>
        </div>
        <div className="space-y-3">
          {!data?.myStudents?.length ? (
            <p className="rounded-xl border border-dashed border-[#E8F5E9] p-6 text-center text-sm text-[#1A1A1A]/60">
              No bookings yet
            </p>
          ) : (
            data.myStudents.map((session, index) => (
              <div key={session.session_id ?? `${session.student_name}-${session.subject}-${index}`} className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/50">
                      {session.booked_date ? new Date(session.booked_date).toLocaleDateString() : ""}
                    </p>
                    <p className="mt-1 font-semibold text-[#2D7A3A]">{session.subject || "Session"}</p>
                    <p className="text-sm text-[#1A1A1A]/70">{session.student_name || `Student #${session.student_id}`}</p>
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Today&apos;s Sessions</h2>
          <div className="space-y-3">
            {!data?.todaySessions?.length ? (
              <p className="rounded-xl border border-dashed border-[#E8F5E9] p-6 text-center text-sm text-[#1A1A1A]/60">
                No classes today
              </p>
            ) : (
              data.todaySessions.map((session, index) => (
                <div key={session.session_id ?? `${session.subject}-${session.scheduled_time}`} className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#1A1A1A]/50">
                        {session.scheduled_time ? new Date(session.scheduled_time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : ""}
                      </p>
                      <p className="mt-1 font-semibold text-[#2D7A3A]">{session.subject || "Session"}</p>
                      <p className="text-sm text-[#1A1A1A]/70">Student #{session.student_id ?? "-"}</p>
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
                      {index === 0 && session.meeting_link ? (
                        <a
                          href={session.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#256830]"
                        >
                          Start
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">My Students</h2>
          </div>
          <div className="space-y-3">
            {!data?.myStudents?.length ? (
              <p className="rounded-xl border border-dashed border-[#E8F5E9] p-6 text-center text-sm text-[#1A1A1A]/60">
                No students yet
              </p>
            ) : (
              data.myStudents.slice(0, 5).map((student) => (
                <div key={student.student_id ?? student.student_name ?? student.subject ?? Math.random()} className="flex items-center justify-between gap-3 rounded-xl border border-[#E8F5E9] bg-white p-3 shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-semibold text-[#2D7A3A]">
                      {String(student.student_id ?? student.student_name ?? "S").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1A1A1A]">{student.subject || "Subject"}</p>
                      <p className="truncate text-xs text-[#1A1A1A]/60">Student #{student.student_id ?? "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Practice Tests</h2>
          </div>
          <div className="space-y-3">
            {!data?.practiceTests?.length ? (
              <p className="rounded-xl border border-dashed border-[#E8F5E9] p-6 text-center text-sm text-[#1A1A1A]/60">
                No tests created yet
              </p>
            ) : (
              data.practiceTests.map((test) => {
                const tone =
                  test.status === "published"
                    ? "bg-[#E8F5E9] text-[#2D7A3A]"
                    : test.status === "pending"
                      ? "bg-[#FFF3E0] text-[#F59E0B]"
                      : "text-[#DC2626]";

                return (
                  <div key={test.test_id ?? test.title ?? Math.random()} className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{test.title || "Untitled test"}</p>
                        <p className="mt-1 text-sm text-[#4B5563]">{test.type || "General"} · {test.question_count ?? 0} questions</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone}`}>
                        {test.status || "draft"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-xl bg-[#E8F5E9] p-5">
          <h2 className="mb-4 text-lg font-semibold text-[#2D7A3A]">Upcoming Slots</h2>
          {!data?.slots?.length ? (
            <p className="rounded-xl border border-dashed border-[#2D7A3A]/20 bg-white/50 p-6 text-center text-sm text-[#1A1A1A]/60">
              No availability set
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                data.slots.reduce<Record<string, Array<{ time_slot?: string; subject?: string }>>>((acc, slot) => {
                  const key = slot.day_of_week ?? "Other";
                  acc[key] = acc[key] ?? [];
                  acc[key].push({ time_slot: slot.time_slot, subject: slot.subject });
                  return acc;
                }, {}),
              ).map(([day, slots]) => (
                <div key={day} className="w-full rounded-xl bg-white/60 p-3">
                  <p className="mb-2 text-sm font-semibold text-[#2D7A3A]">{day}</p>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot, index) => (
                      <span key={`${day}-${slot.time_slot ?? index}`} className="rounded-full bg-[#2D7A3A] px-2.5 py-1 text-xs font-medium text-white">
                        {slot.time_slot || "Time"} · {slot.subject || "Subject"}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl bg-[#2D7A3A] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <h2 className="mb-4 text-lg font-semibold text-white">Tuition Board</h2>
        <div className="space-y-3">
          {!data?.tuitionBoard?.length ? (
            <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-white/75">
              No listings available
            </p>
          ) : (
            data.tuitionBoard.map((listing) => (
              <div
                key={listing.listing_id}
                className="flex flex-col gap-3 rounded-xl bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{listing.subject || "Subject"}</p>
                  <p className="mt-1 text-sm text-white/75">
                    {listing.mode || "Mode"} · {listing.days_per_week ?? 0} days/week · {listing.hours_per_session ?? 0} hrs/session · {listing.rate_bdt ?? 0} BDT
                  </p>
                </div>
                <button type="button" className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#2D7A3A] hover:bg-[#E8F5E9]">
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
