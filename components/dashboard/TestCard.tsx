import { formatJoinDate } from '@/lib/dashboard-utils';

interface TestCardProps {
  title?: string;
  questionCount?: number;
  status?: string;
  assignedTo?: number | null;
  assignDate?: string | null;
}

function formatStatus(status?: string): string {
  if (!status) return 'Draft';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function TestCard({ title, questionCount, status, assignedTo, assignDate }: TestCardProps) {
  return (
    <div className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-[#1A1A1A]">{title || 'Untitled Test'}</p>
          <p className="mt-1 text-xs text-[#1A1A1A]/60">{questionCount ?? 0} questions</p>
        </div>
        <span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#2D7A3A]">
          {formatStatus(status)}
        </span>
      </div>
      {(assignedTo || assignDate) && (
        <p className="mt-2 text-xs text-[#1A1A1A]/50">
          {assignedTo ? `Assigned to #${assignedTo}` : 'Unassigned'}
          {assignDate ? ` · ${formatJoinDate(assignDate)}` : ''}
        </p>
      )}
    </div>
  );
}
