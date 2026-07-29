"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, CalendarDays, Users, ClipboardList, Clock3, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStateCard from "@/components/dashboard/DashboardStateCard";
import api, { apiErrorMessage } from "@/lib/api";

interface TutorDashboardData {
  profile?: {
    name?: string;
    role?: string;
    email?: string;
    department?: string;
  } | null;
  stats?: {
    todaySessions?: number;
    activeStudents?: number;
    practiceTests?: number;
    availabilitySlots?: number;
  } | null;
  sessions?: Array<{
    id?: number | string;
    student?: string;
    subject?: string;
    time?: string;
  }> | null;
  students?: Array<{
    id?: number | string;
    name?: string;
    level?: string;
  }> | null;
  practiceTests?: Array<{
    id?: number | string;
    title?: string;
    status?: string;
  }> | null;
  availability?: Array<{
    id?: number | string;
    day?: string;
    slot?: string;
  }> | null;
  tuitionBoard?: Array<{
    id?: number | string;
    title?: string;
    dueDate?: string;
  }> | null;
}

export default function TutorDashboardPage() {
  const [data, setData] = useState<TutorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await api.get<TutorDashboardData>("/dashboard/tutor");
        if (active) {
          setData(response.data);
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

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => [
    {
      title: "Today&apos;s Sessions",
      value: data?.stats?.todaySessions ?? 0,
      description: "Scheduled today",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: "Active Students",
      value: data?.stats?.activeStudents ?? 0,
      description: "Current learners",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Practice Tests",
      value: data?.stats?.practiceTests ?? 0,
      description: "Assigned or pending",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Availability Slots",
      value: data?.stats?.availabilitySlots ?? 0,
      description: "Open time slots",
      icon: <Clock3 className="h-5 w-5" />,
    },
  ], [data]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading tutor dashboard…</div>;
  }

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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Tutor Dashboard</p>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {data?.profile?.name || "Tutor"}</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DashboardStateCard key={item.title} title={item.title} value={item.value} description={item.description} icon={item.icon} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Today&apos;s Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!data?.sessions || data.sessions.length === 0) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No sessions scheduled today.</div>
            ) : (
              data.sessions.map((session) => (
                <div key={session.id ?? `${session.student}-${session.time}`} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{session.subject || "Session"}</p>
                      <p className="text-sm text-slate-500">{session.student || "Student"}</p>
                    </div>
                    <p className="text-sm text-slate-500">{session.time || "—"}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!data?.students || data.students.length === 0) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No students assigned yet.</div>
            ) : (
              data.students.map((student) => (
                <div key={student.id ?? student.name} className="rounded-lg border p-4">
                  <p className="font-medium text-slate-900">{student.name || "Student"}</p>
                  <p className="text-sm text-slate-500">{student.level || "Level not provided"}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Practice Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!data?.practiceTests || data.practiceTests.length === 0) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No practice tests available.</div>
            ) : (
              data.practiceTests.map((item) => (
                <div key={item.id ?? item.title} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.title || "Test"}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">{item.status || "Pending"}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Availability Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!data?.availability || data.availability.length === 0) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No availability info provided.</div>
            ) : (
              data.availability.map((slot) => (
                <div key={slot.id ?? `${slot.day}-${slot.slot}`} className="rounded-lg border p-4">
                  <p className="font-medium text-slate-900">{slot.day || "Day"}</p>
                  <p className="text-sm text-slate-500">{slot.slot || "Time slot"}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle>Tuition Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!data?.tuitionBoard || data.tuitionBoard.length === 0) ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No tuition board items found.</div>
          ) : (
            data.tuitionBoard.map((item) => (
              <div key={item.id ?? item.title} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.title || "Board item"}</p>
                  <p className="text-sm text-slate-500">{item.dueDate || "—"}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
