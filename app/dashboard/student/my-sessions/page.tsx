import Link from 'next/link';

const sessions = [
  { title: 'Algebra revision', date: 'May 18 • 5:00 PM', status: 'Confirmed' },
  { title: 'Physics problem solving', date: 'May 20 • 6:30 PM', status: 'Pending' },
];

export default function StudentMySessionsPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">My sessions</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Your upcoming sessions</h1>
          </div>
          <Link
            href="/dashboard/student"
            className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <div key={session.title} className="rounded-2xl border border-[#DCEFE2] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#1F2937]">{session.title}</h2>
                <p className="mt-1 text-sm text-[#4B5563]">{session.date}</p>
              </div>
              <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-sm font-semibold text-[#2D7A3A]">{session.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
