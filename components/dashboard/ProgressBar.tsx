import { PROGRESS_COLORS } from '@/lib/dashboard-utils';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  subject?: string;
  sessionCount?: number;
  progressPercentage?: number;
  colorIndex?: number;
}

export default function ProgressBar({
  subject,
  sessionCount,
  progressPercentage,
  colorIndex = 0,
}: ProgressBarProps) {
  const barColor = PROGRESS_COLORS[colorIndex % PROGRESS_COLORS.length];
  const width = Math.min(100, Math.max(0, progressPercentage ?? 0));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-[#1A1A1A]">{subject || 'Subject'}</span>
        <span className="text-[#1A1A1A]/60">{sessionCount ?? 0} sessions</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E8F5E9]">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
