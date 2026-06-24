"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

interface Session {
  id: number;
  subject: string;
  tutor: string;
  time: string;
  date: string;
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/student/schedule"
        );

        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold mb-6">
        Schedule
      </h1>

      {sessions.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center">
          <Calendar className="mx-auto mb-4 text-gray-400" />

          <h3 className="font-medium">
            No upcoming sessions
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Your booked sessions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border rounded-2xl p-5"
            >
              <h3 className="font-semibold">
                {session.subject}
              </h3>

              <p className="text-sm text-gray-500">
                Tutor: {session.tutor}
              </p>

              <p className="mt-2">
                {session.date} • {session.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}