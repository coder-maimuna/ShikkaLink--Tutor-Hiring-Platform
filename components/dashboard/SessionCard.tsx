import Link from 'next/link';
import { formatSessionTime, getHoursUntilLabel, isSessionJoinable } from '@/lib/dashboard-utils';

interface SessionCardProps {
  subject?: string;
  participantName?: string;
  scheduledTime?: string;
  status?: string;
  meetingLink?: string | null;
  variant?: 'student' | 'tutor';
  isFirst?: boolean;
}

export default function SessionCard({
  subject,
  participantName,
  scheduledTime,
  status,
  meetingLink,
  variant = 'student',
  isFirst = false,
}: SessionCardProps) {
  const joinable = scheduledTime ? isSessionJoinable(scheduledTime, status) : false;
  const hoursLabel = scheduledTime ? getHoursUntilLabel(scheduledTime) : null;
  const actionLabel = variant === 'tutor' ? '• Start' : '• Join';

  const showAction = joinable && meetingLink && (variant === 'student' || isFirst);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm">
      <div className="min-w-0">
        {scheduledTime ? (
          <p className="text-xs font-medium text-[#1A1A1A]/50">{formatSessionTime(scheduledTime)}</p>
        ) : null}
        <p className="font-semibold text-[#2D7A3A]">{subject || 'Session'}</p>
        {participantName ? <p className="text-sm text-[#1A1A1A]/70">{participantName}</p> : null}
      </div>

      <div className="shrink-0">
        {showAction ? (
          <Link
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-[#4CAF50] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#43a047]"
          >
            {actionLabel}
          </Link>
        ) : hoursLabel ? (
          <span className="inline-flex rounded-full bg-[#FF9800]/15 px-3 py-1 text-xs font-semibold text-[#FF9800]">
            {hoursLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
