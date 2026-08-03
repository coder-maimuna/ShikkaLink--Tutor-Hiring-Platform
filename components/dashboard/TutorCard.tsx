import { renderStars } from '@/lib/dashboard-utils';

interface TutorCardProps {
  name?: string;
  subject?: string;
  rating?: number | string;
  variant?: 'light' | 'dark';
}

function getInitial(name?: string): string {
  return (name?.trim()?.charAt(0) || '?').toUpperCase();
}

export default function TutorCard({ name, subject, rating, variant = 'dark' }: TutorCardProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={
        isDark
          ? 'flex items-center justify-between gap-3 rounded-xl bg-white/10 p-3'
          : 'flex items-center justify-between gap-3 rounded-xl border border-[#E8F5E9] bg-white p-3 shadow-sm'
      }
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={
            isDark
              ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white'
              : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-semibold text-[#2D7A3A]'
          }
        >
          {getInitial(name)}
        </div>
        <div className="min-w-0">
          <p className={isDark ? 'truncate font-medium text-white' : 'truncate font-medium text-[#1A1A1A]'}>
            {name || 'Tutor'}
          </p>
          {subject ? (
            <p className={isDark ? 'truncate text-xs text-white/75' : 'truncate text-xs text-[#1A1A1A]/60'}>
              {subject}
            </p>
          ) : null}
        </div>
      </div>
      {rating !== undefined && rating !== null ? (
        <span className={isDark ? 'shrink-0 text-xs text-yellow-300' : 'shrink-0 text-xs text-[#FF9800]'}>
          {renderStars(rating)}
        </span>
      ) : null}
    </div>
  );
}
