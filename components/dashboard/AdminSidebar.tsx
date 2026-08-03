'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  User,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNav: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/tutors', label: 'All Tutors', icon: Users },
  { href: '/dashboard/admin/students', label: 'All Students', icon: User },
  { href: '/dashboard/admin/pending', label: 'Pending Requests', icon: ShieldCheck },
  { href: '/dashboard/admin/users', label: 'All Users', icon: Users },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onLogout: () => void;
}

export default function AdminSidebar({ collapsed = false, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full shrink-0 flex-col bg-[#2D7A3A] text-white">
      <div className="border-b border-white/15 px-4 py-4">
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">
            S
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">ShikkaLink</p>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                isActive ? 'bg-[#E8F5E9] text-[#2D7A3A]' : 'text-white/85 hover:bg-white/10',
                collapsed && 'justify-center px-2',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/15 p-3">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10',
            collapsed && 'justify-center px-2',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
