import Link from 'next/link';

export default function StudentProgressPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">Progress</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Your learning progress</h1>
          </div>
          <Link
            href="/dashboard/student"
            className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1F2937]">Weekly completion</h2>
          <div className="mt-4 h-3 rounded-full bg-[#E8F5E9]">
            <div className="h-3 w-[78%] rounded-full bg-[#2D7A3A]" />
          </div>
          <p className="mt-3 text-sm text-[#4B5563]">78% of your planned study goals completed.</p>
        </div>
        <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1F2937]">Recent highlights</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#4B5563]">
            <li>• Completed 3 practice tests this month.</li>
            <li>• Improved algebra accuracy by 12%.</li>
            <li>• Maintained a steady weekly study streak.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
