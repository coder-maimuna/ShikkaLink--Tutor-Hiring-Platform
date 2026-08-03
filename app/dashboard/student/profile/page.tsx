"use client";

import axios from "axios";
import Link from "next/link";
import { Camera, CheckCircle2, PencilLine } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type StudentProfileForm = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  student_class: string;
  tutor_preference: string;
};

function getInitials(fullName?: string) {
  const safeName = (fullName ?? "").trim();
  if (!safeName) return "S";
  const parts = safeName.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "S";
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function StudentProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [form, setForm] = useState<StudentProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    student_class: "",
    tutor_preference: "",
  });
  const [originalForm, setOriginalForm] = useState<StudentProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    student_class: "",
    tutor_preference: "",
  });
  const [stats, setStats] = useState({
    session_hours: 0,
    active_subjects: 0,
    my_tutors: 0,
  });

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const storedUser = safeJsonParse<{ full_name?: string; email?: string; phone?: string; address?: string }>(
          localStorage.getItem("user"),
        );

        const res = await axios.get("http://localhost:5000/dashboard/student", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.user ?? storedUser ?? {};
        const profile = res.data?.profile ?? {};
        const nextForm = {
          full_name: user.full_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
          student_class: profile.student_class ?? "",
          tutor_preference: profile.tutor_preference ?? "",
        };

        if (!ignore) {
          setForm(nextForm);
          setOriginalForm(nextForm);
          setStats({
            session_hours: Number(res.data?.stats?.session_hours ?? 0),
            active_subjects: Number(res.data?.stats?.active_subjects ?? 0),
            my_tutors: Number(res.data?.stats?.my_tutors ?? 0),
          });
        }
      } catch (error) {
        if (ignore) return;

        const storedUser = safeJsonParse<{ full_name?: string; email?: string; phone?: string; address?: string }>(
          localStorage.getItem("user"),
        );

        const fallback = {
          full_name: storedUser?.full_name ?? "",
          email: storedUser?.email ?? "",
          phone: storedUser?.phone ?? "",
          address: storedUser?.address ?? "",
          student_class: "",
          tutor_preference: "",
        };

        setForm(fallback);
        setOriginalForm(fallback);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProfile();

    const savedPhoto = localStorage.getItem("studentProfilePhoto");
    if (savedPhoto) setPhoto(savedPhoto);

    return () => {
      ignore = true;
    };
  }, []);

  const completion = useMemo(() => {
    const checks = [form.full_name, form.email, form.student_class, form.tutor_preference, form.address];
    const filled = checks.filter((value) => (value ?? "").toString().trim() !== "").length;
    return Math.round((filled / checks.length) * 100);
  }, [form]);

  const handleFieldChange = (field: keyof StudentProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/dashboard/student/profile/personal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          address: form.address,
          student_class: form.student_class,
          tutor_preference: form.tutor_preference,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setOriginalForm(form);
        setIsEditing(false);
        setToast("Profile updated successfully!");
        window.setTimeout(() => setToast(null), 2200);
      } else {
        setToast(data.message || "Failed to save profile");
        window.setTimeout(() => setToast(null), 2200);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setToast("Failed to save profile");
      window.setTimeout(() => setToast(null), 2200);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      localStorage.setItem("studentProfilePhoto", result);
      setPhoto(result);
      setToast("Profile photo updated.");
      window.setTimeout(() => setToast(null), 2000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D7A3A]">Student profile</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">My profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/student"
              className="rounded-lg border border-[#2D7A3A] px-4 py-2 text-sm font-semibold text-[#2D7A3A] transition hover:bg-[#EFF8F0]"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCEFE2] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#2D7A3A]">Completed Profile: {completion}%</p>
          </div>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#E8F5E9]">
          <div className="h-full rounded-full bg-[#2D7A3A] transition-all" style={{ width: `${completion}%` }} />
        </div>
      </div>

      {toast ? (
        <div className="fixed right-5 top-5 z-50 rounded-xl border border-[#DCEFE2] bg-[#E8F5E9] px-4 py-3 text-sm font-medium text-[#1F2937] shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#2D7A3A]" />
            <span>{toast}</span>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-[#DCEFE2] bg-white p-10 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8F5E9] border-t-[#2D7A3A]" />
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#E8F5E9] bg-[#2D7A3A] text-xl font-bold text-white">
                  {photo ? (
                    <img src={photo} alt="Student profile" className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials(form.full_name)}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#1F2937]">{form.full_name || "Student"}</h2>
                    <span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-xs font-semibold text-[#2D7A3A]">Student</span>
                  </div>
                  <p className="mt-1 text-sm text-[#4B5563]">{form.email || "No email provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2D7A3A] px-3 py-2 text-sm font-semibold text-[#2D7A3A] hover:bg-[#EFF8F0]"
                >
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <button
                  type="button"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="rounded-lg bg-[#1F5E2A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174d22]"
                >
                  {isEditing ? "Save" : "Edit Changes"}
                </button>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-[#E11D48] px-4 py-2 text-sm font-semibold text-[#E11D48] hover:bg-[#FDE8EC]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1F2937]">Personal Information</h2>
                {!isEditing ? <PencilLine className="h-4 w-4 text-[#2D7A3A]" /> : null}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Full Name</label>
                  {isEditing ? (
                    <input
                      value={form.full_name}
                      onChange={(e) => handleFieldChange("full_name", e.target.value)}
                      className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2D7A3A]"
                    />
                  ) : (
                    <p className="rounded-lg bg-[#F7FBF8] px-3 py-2.5 text-sm text-[#1F2937]">{form.full_name || ""}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Email</label>
                  {isEditing ? (
                    <input
                      value={form.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2D7A3A]"
                    />
                  ) : (
                    <p className="rounded-lg bg-[#F7FBF8] px-3 py-2.5 text-sm text-[#1F2937]">{form.email || ""}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Phone</label>
                  {isEditing ? (
                    <input
                      value={form.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2D7A3A]"
                    />
                  ) : (
                    <p className="rounded-lg bg-[#F7FBF8] px-3 py-2.5 text-sm text-[#1F2937]">{form.phone || ""}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Address</label>
                  {isEditing ? (
                    <textarea
                      value={form.address}
                      rows={3}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2D7A3A]"
                    />
                  ) : (
                    <p className="rounded-lg bg-[#F7FBF8] px-3 py-2.5 text-sm text-[#1F2937]">{form.address || ""}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <h2 className="mb-4 text-lg font-semibold text-[#1F2937]">Academic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Class / Level</label>
                  <p className="rounded-lg bg-[#F7FBF8] px-3 py-2.5 text-sm text-[#1F2937]">{form.student_class || ""}</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Tutor Preference</label>
                  <p className="rounded-lg bg-[#F7FBF8] px-3 py-2.5 text-sm text-[#1F2937]">{form.tutor_preference || ""}</p>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-[#DCEFE2] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <h2 className="mb-4 text-lg font-semibold text-[#1F2937]">Learning Stats</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#F7FBF8] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Total Sessions</p>
                <p className="mt-2 text-2xl font-semibold text-[#1F2937]">{stats.session_hours}</p>
              </div>
              <div className="rounded-xl bg-[#F7FBF8] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B5563]">Active Subjects</p>
                <p className="mt-2 text-2xl font-semibold text-[#1F2937]">{stats.active_subjects}</p>
              </div>
              <div className="rounded-xl bg-[#F7FBF8] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B5563]">My Tutors</p>
                <p className="mt-2 text-2xl font-semibold text-[#1F2937]">{stats.my_tutors}</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
