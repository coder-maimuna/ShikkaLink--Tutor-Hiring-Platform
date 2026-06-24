"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  subject: string;
  progress: number;
}

export default function ProgressPage() {
  const [progressData, setProgressData] =
    useState<ProgressItem[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/student/progress"
        );

        const data = await res.json();
        setProgressData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold mb-6">
        Learning Progress
      </h1>

      {progressData.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <h3 className="font-medium">
            No progress available
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Complete sessions to see your progress.
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          {progressData.map((item) => (
            <div key={item.subject}>
              <div className="flex justify-between mb-2">
                <span>{item.subject}</span>
                <span>{item.progress}%</span>
              </div>

              <Progress value={item.progress} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}