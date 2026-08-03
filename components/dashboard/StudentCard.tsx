function getInitial(name?: string): string {
  return (name?.trim()?.charAt(0) || '?').toUpperCase();
}

interface StudentCardProps {
  name?: string;
  subject?: string;
  sessionCount?: number;
}

export default function StudentCard({ name, subject, sessionCount }: StudentCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8F5E9] bg-white p-3 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-semibold text-[#2D7A3A]">
          {getInitial(name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-[#1A1A1A]">{name || 'Student'}</p>
          {subject ? <p className="truncate text-xs text-[#1A1A1A]/60">{subject}</p> : null}
        </div>
      </div>
      {sessionCount !== undefined ? (
        <span className="shrink-0 text-xs font-medium text-[#1A1A1A]/60">{sessionCount} sessions</span>
      ) : null}
    </div>
  );
}
