"use client";

import { useEffect, useState } from "react";
import { AlertCircle, XCircle, CheckCircle2 } from "lucide-react";

function getRoleColor(role: string) {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700';
    case 'tutor':
      return 'bg-green-100 text-green-700';
    case 'student':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'http://localhost:5000/dashboard/admin/users',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (active) setUsers(result.users || []);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load users");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => { active = false; };
  }, []);

  const handleSuspend = async (id: number) => {
    if (!confirm("Suspend this user?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/user/${id}/suspend`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to suspend user");

      setUsers(prev =>
        prev.map(u =>
          u.user_id === id ? { ...u, is_active: false } : u
        )
      );
      alert("User suspended successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to suspend user");
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("Activate this user?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/user/${id}/activate`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to activate user");

      setUsers(prev =>
        prev.map(u =>
          u.user_id === id ? { ...u, is_active: true } : u
        )
      );
      alert("User activated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to activate user");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.role?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter ? u.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  if (loading) return null;

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">
            All Users
          </h1>
          <p className="mt-1 text-sm text-[#1A1A1A]/60">
            Manage and monitor all registered users
          </p>
        </section>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="w-full rounded-lg border border-[#E8F5E9] bg-white px-4 py-2.5 text-sm focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-[#E8F5E9] bg-white px-4 py-2.5 text-sm focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="tutor">Tutor</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="space-y-3">
          {!filteredUsers.length ? (
            <div className="rounded-xl border border-dashed border-[#E8F5E9] p-8 text-center text-sm text-[#1A1A1A]/60">
              {searchTerm ? "No users match your search" : "No users found"}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="rounded-xl border border-[#E8F5E9] bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-lg font-semibold text-[#2D7A3A]">
                      {String(user.full_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1A1A1A]">
                        {user.full_name || "User"}
                      </p>
                      <p className="text-sm text-[#1A1A1A]/60">
                        {user.email || "No email"} · {user.phone || "No phone"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                        {user.is_verified && (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                            Verified ✓
                          </span>
                        )}
                        {!user.is_active && (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                            Suspended
                          </span>
                        )}
                        <span className="text-xs text-[#1A1A1A]/60">
                          Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.is_active ? (
                      <button
                        type="button"
                        onClick={() => handleSuspend(user.user_id!)}
                        disabled={false}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-orange-200 px-3 py-1.5 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleActivate(user.user_id!)}
                        disabled={false}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-green-200 px-3 py-1.5 text-sm font-semibold text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
