import { cn } from '@/lib/utils';

interface ProfilePanelProps {
  name?: string;
  email?: string;
  role?: string;
  collapsed?: boolean;
}

function getInitial(name?: string): string {
  return (name?.trim()?.charAt(0) || '?').toUpperCase();
}

export default function ProfilePanel({ name, email, role, collapsed }: ProfilePanelProps) {
  if (collapsed) {
    return (
      <div className="flex justify-center px-3 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
          {getInitial(name)}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-white/15 px-4 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-semibold text-white">
          {getInitial(name)}
        </div>
        <div className="min-w-0">
          {name ? <p className="truncate text-sm font-semibold text-white">{name}</p> : null}
          {email ? <p className="truncate text-xs text-white/75">{email}</p> : null}
          {role ? (
            <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
              {role}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
