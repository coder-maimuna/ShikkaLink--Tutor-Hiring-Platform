"use client";

import {
  Bell,
  Search,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import StatCard from "@/components/student/StatsGrid";
import SessionRow from "@/components/student/SessionRow";
import TutorRow from "@/components/student/TutorRow";
import ProgressRow from "@/components/student/ProgressRow";
import SidebarItem from "@/components/student/StudentSidebar";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Session {
  id: number;
  subject: string;
  tutor: string;
  time: string;
}

interface Tutor {
  id: number;
  name: string;
  subject: string;
  rating: number;
}

interface ProgressItem {
  subject: string;
  progress: number;
}

interface DashboardData {
  student: {
    name: string;
  };
  stats: {
    upcomingSessions: number;
    completedSessions: number;
    activeTutors: number;
    averageScore: number;
  };
  sessions: Session[];
  tutors: Tutor[];
  progress: ProgressItem[];
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          //"http://localhost:5000/api/student/dashboard"
        );

        const data = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
<div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-green-800/70 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                S
              </div>

              <div>
                <h3 className="font-semibold text-white">
  {dashboardData?.student.name}
</h3>
                <p className="text-sm text-white/60">
                  Student Account
                </p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">

<Link href="/student"><SidebarItem active label="Dashboard" /></Link>
<Link href="/find-tutors"><SidebarItem label="Find Tutors" /></Link>
<Link href="/progress"><SidebarItem label="Progress" /></Link>
<Link href="/schedule"><SidebarItem label="Schedule" /></Link>
          </nav>
        </div>

        <div className="p-4 border-t space-y-2">
          <SidebarItem label="Settings" />
          <SidebarItem label="Logout" />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-amber-50/40">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">
              Hello, {dashboardData?.student.name} 👋</h1>

            <p className="text-muted-foreground mt-1">
              You have 2 tutoring sessions scheduled today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                placeholder="Search tutors..."
                className="pl-10"
              />
            </div>

            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recommendation */}
        <Card className="mt-6 border shadow-none">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-700">
                AI Recommendation
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Based on your Chemistry progress, we found 3 tutors that can
                help improve your performance.
              </p>
            </div>

            <Button>View Tutors</Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 mt-6 md:grid-cols-2 xl:grid-cols-4">
  <StatCard
    title="Upcoming Sessions"
    value={String(
      dashboardData?.stats.upcomingSessions ?? 0
    )}
    icon={<Calendar className="h-5 w-5" />}
  />

  <StatCard
    title="Completed Sessions"
    value={String(
      dashboardData?.stats.completedSessions ?? 0
    )}
    icon={<BookOpen className="h-5 w-5" />}
  />

  <StatCard
    title="Active Tutors"
    value={String(
      dashboardData?.stats.activeTutors ?? 0
    )}
    icon={<Users className="h-5 w-5" />}
  />

  <StatCard
    title="Average Score"
    value={`${dashboardData?.stats.averageScore ?? 0}%`}
    icon={<TrendingUp className="h-5 w-5" />}
  />
</div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Sessions */}
            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="flex justify-between mb-5">
                  <h2 className="font-semibold">
                    Today's Sessions
                  </h2>

                  <button className="text-sm text-green-700">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {dashboardData?.sessions.map((session) => (
  <SessionRow
    key={session.id}
    subject={session.subject}
    tutor={session.tutor}
    time={session.time}
  />
))}                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="flex justify-between mb-5">
                  <h2 className="font-semibold">
                    Learning Progress
                  </h2>

                  <button className="text-sm text-green-700">
                    Full Report
                  </button>
                </div>

                <div className="space-y-5">
                  <ProgressRow
                    subject="Physics"
                    progress={78}
                  />

                  <ProgressRow
                    subject="Higher Math"
                    progress={32}
                  />

                  <ProgressRow
                    subject="Chemistry"
                    progress={46}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutors */}
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex justify-between mb-5">
                <h2 className="font-semibold">My Tutors</h2>

                <button className="text-sm text-green-700">
                  Find More
                </button>
              </div>

              <div className="space-y-4">
                {dashboardData?.tutors.map((tutor) => (
  <TutorRow
    key={tutor.id}
    name={tutor.name}
    subject={tutor.subject}
    rating={String(tutor.rating)}
  />
))}              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}