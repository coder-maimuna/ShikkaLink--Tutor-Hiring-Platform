"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, CalendarDays, Users, TrendingUp, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api, { apiErrorMessage } from "@/lib/api";
import DashboardStateCard from "@/components/dashboard/DashboardStateCard";

interface StudentDashboardData {
  profile?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    institution?: string;
  } | null;
  stats?: {
    upcomingSessions?: number;
    completedSessions?: number;
    activeTutors?: number;
    averageScore?: number;
  } | null;
  sessions?: Array<{
    id?: number | string;
    subject?: string;
    tutor?: string;
    time?: string;
    date?: string;
  }> | null;
  tutors?: Array<{
    id?: number | string;
    name?: string;
    subject?: string;
    rating?: number | string;
  }> | null;
  progress?: Array<{
    subject?: string;
    progress?: number;
  }> | null;
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await api.get<StudentDashboardData>("/dashboard/student");
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
      title: "Upcoming Sessions",
      value: data?.stats?.upcomingSessions ?? 0,
      description: "Scheduled this week",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: "Completed Sessions",
      value: data?.stats?.completedSessions ?? 0,
      description: "Lessons completed",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Active Tutors",
      value: data?.stats?.activeTutors ?? 0,
      description: "Current mentors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Average Score",
      value: `${data?.stats?.averageScore ?? 0}%`,
      description: "Progress average",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ], [data]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading dashboard…</div>;
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
          <p className="text-sm text-slate-500">Student Dashboard</p>
          <h1 className="text-2xl font-semibold text-slate-900">Hello, {data?.profile?.name || "Student"}</h1>
        </div>
        <Link href="/dashboard/find-tutor" className="inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          Find Tutors
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Profile</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-900">Name:</span> {data?.profile?.name || "—"}</p>
              <p><span className="font-medium text-slate-900">Email:</span> {data?.profile?.email || "—"}</p>
              <p><span className="font-medium text-slate-900">Phone:</span> {data?.profile?.phone || "—"}</p>
              <p><span className="font-medium text-slate-900">Institution:</span> {data?.profile?.institution || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Quick Summary</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-lg border bg-slate-50 p-3">
                <p className="font-medium text-slate-900">Role</p>
                <p className="mt-1">{data?.profile?.role || "Student"}</p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <p className="font-medium text-slate-900">Learning Focus</p>
                <p className="mt-1">Track sessions, progress, and tutor performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DashboardStateCard key={item.title} title={item.title} value={item.value} description={item.description} icon={item.icon} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Today&apos;s Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!data?.sessions || data.sessions.length === 0) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No sessions scheduled for today.</div>
            ) : (
              data.sessions.map((session) => (
                <div key={session.id ?? `${session.subject}-${session.time}`} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{session.subject || "Session"}</p>
                      <p className="text-sm text-slate-500">{session.tutor || "Tutor"}</p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>{session.date || "Today"}</p>
                      <p>{session.time || "—"}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Tutors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!data?.tutors || data.tutors.length === 0) ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No tutor data available.</div>
            ) : (
              data.tutors.map((tutor) => (
                <div key={tutor.id ?? tutor.name} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{tutor.name || "Tutor"}</p>
                      <p className="text-sm text-slate-500">{tutor.subject || "Subject"}</p>
                    </div>
                    <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">⭐ {tutor.rating ?? 0}</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(!data?.progress || data.progress.length === 0) ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No progress data available.</div>
          ) : (
            data.progress.map((item, index) => (
              <div key={`${item.subject}-${index}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.subject || "Subject"}</span>
                  <span className="text-slate-500">{item.progress ?? 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-green-700" style={{ width: `${Math.min(100, Math.max(0, item.progress ?? 0))}%` }} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}