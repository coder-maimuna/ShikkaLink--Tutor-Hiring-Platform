"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slot = {
  slot_id?: number;
  day_of_week?: string;
  time_slot?: string;
  subject?: string;
};

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/dashboard/tutor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSlots(response.data?.slots ?? []);
      } catch (error) {
        console.error("Failed to load tutor availability", error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">Availability</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Set your tutoring availability</h1>
          </div>
          <Link
            href="/dashboard/tutor"
            className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#DCEFE2] bg-white p-10 text-center text-sm text-[#4B5563]">
          Loading availability...
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCEFE2] bg-white p-8 text-center text-sm text-[#4B5563]">
          No availability slots have been set yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot.slot_id ?? `${slot.day_of_week}-${slot.time_slot}-${slot.subject}`} className="rounded-2xl border border-[#DCEFE2] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D7A3A]">{slot.day_of_week || "Day"}</p>
              <h2 className="mt-3 text-lg font-semibold text-[#1F2937]">{slot.subject || "General tutoring"}</h2>
              <p className="mt-2 text-sm text-[#4B5563]">{slot.time_slot || "Time slot not assigned"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
