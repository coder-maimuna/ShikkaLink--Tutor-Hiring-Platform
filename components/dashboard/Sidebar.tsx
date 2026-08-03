'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Search,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Users,
  Clock3,
  ClipboardList,
  CircleDollarSign,
  ShieldCheck,
  FileText,
  LineChart,
} from 'lucide-react';
import ProfilePanel from '@/components/dashboard/ProfilePanel';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const studentNav: NavItem[] = [
  { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/student/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/student/find-tutor', label: 'Find Tutor', icon: Search },
  { href: '/dashboard/student/my-sessions', label: 'My Sessions', icon: CalendarDays },
  { href: '/dashboard/student/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/dashboard/student/progress', label: 'Progress', icon: BarChart3 },
  { href: '/dashboard/student/settings', label: 'Settings', icon: Settings },
];

const tutorNav: NavItem[] = [
  { href: '/dashboard/tutor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tutor/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/tutor/my-students', label: 'My Students', icon: Users },
  { href: '/dashboard/tutor/availability', label: 'Availability', icon: Clock3 },
  { href: '/dashboard/tutor/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/dashboard/tutor/practice-tests', label: 'Practice Tests', icon: ClipboardList },
  { href: '/dashboard/tutor/tuition-board', label: 'Tuition Board', icon: CircleDollarSign },
  { href: '/dashboard/tutor/settings', label: 'Settings', icon: Settings },
];

const adminNav: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/tutors', label: 'All Tutors', icon: Users },
  { href: '/dashboard/admin/students', label: 'All Students', icon: User },
  { href: '/dashboard/admin/pending', label: 'Pending Requests', icon: ShieldCheck },
  { href: '/dashboard/admin/users', label: 'All Users', icon: Users },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
];

function getNavigation(role: string | null): NavItem[] {
  if (role === 'student') return studentNav;
  if (role === 'tutor') return tutorNav;
  if (role === 'admin') return adminNav;
  return [];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ full_name?: string; email?: string; role?: string }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(parsedUser || {});
    } catch {
      setUser({});
    }
  }, []);

  const role = user.role || null;
  const navigation = useMemo(() => getNavigation(role), [role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-[#2D7A3A] text-white">
      <div className="border-b border-white/15 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-semibold">ShikkaLink</p>
            <p className="text-xs capitalize text-white/70">{role || 'dashboard'}</p>
          </div>
        </div>
      </div>

      <ProfilePanel
        name={user.full_name}
        email={user.email}
        role={user.role || role || undefined}
      />

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isDashboardHome =
            (role === 'student' && item.href === '/dashboard/student' && item.label === 'Dashboard') ||
            (role === 'tutor' && item.href === '/dashboard/tutor' && item.label === 'Dashboard') ||
            (role === 'admin' && item.href === '/dashboard/admin' && item.label === 'Dashboard');

          const isActive = isDashboardHome
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                isActive ? 'bg-[#E8F5E9] text-[#2D7A3A]' : 'text-white/85 hover:bg-white/10',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/15 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
