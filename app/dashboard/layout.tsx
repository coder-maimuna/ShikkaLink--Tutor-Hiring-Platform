"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Menu, PanelLeftClose, PanelLeftOpen, LayoutDashboard, CalendarDays, GraduationCap, Users, FileText, ShieldCheck, BarChart3, LogOut, Search, CircleDollarSign } from "lucide-react";
import { getDashboardRouteForRole, getStoredTokenValue, getUserRoleFromToken } from "@/lib/api";

const studentNavigation = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/find-tutor", label: "Find Tutors", icon: Search },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart3 },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays },
];

const tutorNavigation = [
  { href: "/dashboard/tutor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tutor", label: "Availability", icon: CalendarDays },
  { href: "/dashboard/tutor", label: "Tuition Board", icon: CircleDollarSign },
];

const adminNavigation = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin", label: "Verification Queue", icon: ShieldCheck },
];

function matchesRoleRoute(pathname: string, role: string | null) {
  if (!role) {
    return false;
  }

  const studentRoutes = ["/dashboard", "/dashboard/student", "/dashboard/find-tutor", "/dashboard/progress", "/dashboard/schedule"];
  const tutorRoutes = ["/dashboard", "/dashboard/tutor"];
  const adminRoutes = ["/dashboard", "/dashboard/admin"];

  if (role === "student") {
    return studentRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  }

  if (role === "tutor") {
    return tutorRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  }

  if (role === "admin") {
    return adminRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  }

  return false;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredTokenValue();
    const resolvedRole = getUserRoleFromToken(token);
    setRole(resolvedRole);

    if (!resolvedRole) {
      router.replace("/auth/login");
      setLoading(false);
      return;
    }

    if (!matchesRoleRoute(pathname, resolvedRole)) {
      router.replace(getDashboardRouteForRole(resolvedRole));
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  const navigation = useMemo(() => {
    if (role === "student") {
      return studentNavigation;
    }

    if (role === "tutor") {
      return tutorNavigation;
    }

    if (role === "admin") {
      return adminNavigation;
    }

    return [];
  }, [role]);

  const activeLabel = useMemo(() => {
    const current = navigation.find((item) => pathname?.startsWith(item.href));
    return current?.label ?? "Dashboard";
  }, [navigation, pathname]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading dashboard…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className={`border-r bg-white/90 backdrop-blur ${collapsed ? "lg:w-20" : "lg:w-72"} w-full lg:sticky lg:top-0 lg:h-screen`}>
          <div className="flex items-center justify-between border-b px-4 py-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              {!collapsed && <div>
                <p className="text-sm font-semibold">ShikkaLink</p>
                <p className="text-xs text-slate-500">{role ? `${role} dashboard` : "Dashboard"}</p>
              </div>}
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1 p-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-green-700 text-white" : "text-slate-700 hover:bg-slate-100"} ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-3">
            <div className={`rounded-xl border bg-slate-50 p-3 text-sm ${collapsed ? "hidden" : "block"}`}>
              <p className="font-medium">{activeLabel}</p>
              <p className="mt-1 text-slate-500">Role-based dashboard access</p>
            </div>
            <button className={`mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-100 ${collapsed ? "justify-center" : ""}`}>
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
