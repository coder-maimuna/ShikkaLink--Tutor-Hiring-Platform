import Link from 'next/link';

const tutors = [
  { name: 'Noah Carter', subject: 'Mathematics', rating: '4.9', availability: 'Today • 6:00 PM' },
  { name: 'Mina Ali', subject: 'Physics', rating: '4.8', availability: 'Tomorrow • 4:30 PM' },
  { name: 'Rohan Singh', subject: 'Chemistry', rating: '4.7', availability: 'Friday • 7:00 PM' },
];

export default function StudentFindTutorPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2D7A3A]">Find a tutor</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">Recommended tutors for you</h1>
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
        {tutors.map((tutor) => (
          <div key={tutor.name} className="rounded-2xl border border-[#DCEFE2] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#1F2937]">{tutor.name}</h2>
                <p className="mt-1 text-sm text-[#4B5563]">{tutor.subject} • Rated {tutor.rating}/5</p>
              </div>
              <div className="text-sm text-[#4B5563]">{tutor.availability}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
