"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api, { apiErrorMessage } from "@/lib/api";

interface ProgressItem {
  subject?: string;
  progress?: number;
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const response = await api.get<ProgressItem[]>("/api/student/progress");
        if (active) {
          setProgressData(response.data || []);
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

    loadProgress();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">Learning Progress</h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading progress…</p>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : progressData.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center">
          <h3 className="font-medium text-slate-900">No progress available</h3>
          <p className="mt-2 text-sm text-slate-500">Complete sessions to see your progress.</p>
        </div>
      ) : (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {progressData.map((item, index) => (
              <div key={`${item.subject}-${index}`}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.subject || "Subject"}</span>
                  <span className="text-slate-500">{item.progress ?? 0}%</span>
                </div>
                <Progress value={item.progress ?? 0} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}