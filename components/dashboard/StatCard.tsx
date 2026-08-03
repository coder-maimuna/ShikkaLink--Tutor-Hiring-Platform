import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({ title, value, description, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#E8F5E9] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#1A1A1A]/60">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{value}</p>
          {description ? <p className="mt-1 text-xs text-[#1A1A1A]/50">{description}</p> : null}
        </div>
        {icon ? <div className="rounded-lg bg-[#E8F5E9] p-2 text-[#2D7A3A]">{icon}</div> : null}
      </div>
    </div>
  );
}
