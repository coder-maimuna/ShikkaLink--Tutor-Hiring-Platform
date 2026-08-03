import Link from 'next/link';

const schedule = [
  { day: 'Monday', time: '5:30 PM', focus: 'Revision' },
  { day: 'Wednesday', time: '7:00 PM', focus: 'Practice test' },
  { day: 'Friday', time: '4:00 PM', focus: 'Homework review' },
];

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">Schedule</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Your study calendar</h1>
          </div>
          <Link
            href="/dashboard/student"
            className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {schedule.map((item) => (
          <div key={item.day} className="rounded-2xl border border-[#DCEFE2] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2D7A3A]">{item.day}</p>
            <p className="mt-3 text-xl font-semibold text-[#1F2937]">{item.time}</p>
            <p className="mt-1 text-sm text-[#4B5563]">{item.focus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
