"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api, { apiErrorMessage } from "@/lib/api";

interface Session {
  id?: number | string;
  subject?: string;
  tutor?: string;
  time?: string;
  date?: string;
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSchedule() {
      try {
        const response = await api.get<Session[]>("/api/student/schedule");
        if (active) {
          setSessions(response.data || []);
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

    loadSchedule();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">Schedule</h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading schedule…</p>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          <Calendar className="mx-auto mb-4 text-gray-400" />
          <h3 className="font-medium text-slate-900">No upcoming sessions</h3>
          <p className="mt-2 text-sm text-slate-500">Your booked sessions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id ?? `${session.subject}-${session.time}`} className="shadow-none">
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900">{session.subject || "Session"}</h3>
                <p className="mt-1 text-sm text-slate-500">Tutor: {session.tutor || "—"}</p>
                <p className="mt-2 text-sm text-slate-700">{session.date || "Today"} • {session.time || "—"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}