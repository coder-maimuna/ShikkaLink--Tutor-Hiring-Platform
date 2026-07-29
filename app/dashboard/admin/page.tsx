"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle, ShieldCheck, Users, BookOpen, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardStateCard from "@/components/dashboard/DashboardStateCard";
import api, { apiErrorMessage } from "@/lib/api";

interface AdminDashboardData {
  stats?: {
    totalUsers?: number;
    verifiedUsers?: number;
    pendingVerifications?: number;
    activeTutors?: number;
  } | null;
  queue?: Array<{
    id?: number | string;
    name?: string;
    role?: string;
    email?: string;
    submittedAt?: string;
  }> | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await api.get<AdminDashboardData>("/dashboard/admin");
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
      title: "Total Users",
      value: data?.stats?.totalUsers ?? 0,
      description: "Registered accounts",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Verified Users",
      value: data?.stats?.verifiedUsers ?? 0,
      description: "Approved in system",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      title: "Pending Verification",
      value: data?.stats?.pendingVerifications ?? 0,
      description: "Awaiting review",
      icon: <Clock3 className="h-5 w-5" />,
    },
    {
      title: "Active Tutors",
      value: data?.stats?.activeTutors ?? 0,
      description: "Live on platform",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ], [data]);

  async function handleDecision(userId: string | number | undefined, action: "verify" | "reject") {
    if (!userId) {
      setActionError("No user ID was provided for this action.");
      return;
    }

    setPendingIds((current) => ({ ...current, [String(userId)]: true }));
    setActionError(null);

    try {
      await api.post(`/dashboard/admin/${action}/${userId}`);
      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          queue: (current.queue || []).filter((item) => String(item.id) !== String(userId)),
        };
      });
    } catch (err) {
      setActionError(apiErrorMessage(err));
    } finally {
      setPendingIds((current) => ({ ...current, [String(userId)]: false }));
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading admin dashboard…</div>;
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
      <div className="mb-6">
        <p className="text-sm text-slate-500">Admin Dashboard</p>
        <h1 className="text-2xl font-semibold text-slate-900">Platform Administration</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DashboardStateCard key={item.title} title={item.title} value={item.value} description={item.description} icon={item.icon} />
        ))}
      </div>

      {actionError ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle>Verification Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!data?.queue || data.queue.length === 0) ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500">No verification requests at the moment.</div>
          ) : (
            data.queue.map((item) => {
              const userId = item.id;
              const pending = Boolean(pendingIds[String(userId)]);
              return (
                <div key={userId ?? `${item.name}-${item.email}`} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{item.name || "User"}</p>
                      <p className="text-sm text-slate-500">{item.role || "Role not provided"} • {item.email || "—"}</p>
                      <p className="mt-1 text-sm text-slate-500">Submitted: {item.submittedAt || "—"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => handleDecision(userId, "reject")} disabled={pending} className="gap-2">
                        <XCircle className="h-4 w-4" />
                        {pending ? "Processing…" : "Reject"}
                      </Button>
                      <Button onClick={() => handleDecision(userId, "verify")} disabled={pending} className="gap-2 bg-green-700 hover:bg-green-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {pending ? "Processing…" : "Verify"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
