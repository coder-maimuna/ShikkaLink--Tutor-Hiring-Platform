import Link from 'next/link';

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">Settings</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Account settings</h1>
          </div>
          <Link
            href="/dashboard/student"
            className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">Preferences</h2>
        <p className="mt-2 text-sm text-[#4B5563]">Notification, reminder, and privacy controls will appear here.</p>
      </div>
    </div>
  );
}
