"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus, Upload, FileText, X, Save } from "lucide-react";

export default function TutorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [personal, setPersonal] = useState({
    full_name: "", email: "", phone: "", address: "",
    teaching_experience: "", student_preference: ""
  });

  const [education, setEducation] = useState({
    current_institution: "", current_level: "",
    current_subject: "", current_grad_year: "",
    current_gpa: "", prev_institution: "",
    prev_level: "", prev_subject: "",
    prev_grad_year: "", prev_gpa: ""
  });

  const [preference, setPreference] = useState({
    subjects: "", class_range: "", preferred_gender: "",
    tuition_type: "", salary_range_min: "",
    salary_range_max: "", preferred_curriculum: ""
  });

  const [experiences, setExperiences] = useState([
    { institution: "", class_range: "", subjects: "", duration: "" }
  ]);

  const [documents, setDocuments] = useState([
    { document_type: "", file_name: "", file_url: "" }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const token = () => localStorage.getItem("token");

  useEffect(() => {
    const submitted = localStorage.getItem("verificationSubmitted");
    setVerificationSubmitted(submitted === "true");

    const loadData = async () => {
      try {
        const stored = localStorage.getItem("user");
        const localUser = stored ? JSON.parse(stored) : {};

        const [dashRes, detailRes] = await Promise.all([
          fetch("http://localhost:5000/dashboard/tutor", {
            headers: { Authorization: `Bearer ${token()}` }
          }),
          fetch("http://localhost:5000/dashboard/tutor/profile/details", {
            headers: { Authorization: `Bearer ${token()}` }
          })
        ]);

        if (dashRes.ok) {
          const dash = await dashRes.json();
          const u = dash.user || {};
          const tp = dash.tutorProfile || {};
          setIsVerified(u.is_verified || false);
          setPersonal(prev => ({
            ...prev,
            full_name: u.full_name || localUser.full_name || "",
            email: u.email || localUser.email || "",
            phone: u.phone || "",
            address: u.address || "",
            teaching_experience: tp.teaching_experience || "",
            student_preference: tp.student_preference || ""
          }));
        }

        if (detailRes.ok) {
          const details = await detailRes.json();
          if (details.education) setEducation(details.education);
          if (details.preference) setPreference({
            ...details.preference,
            salary_range_min: details.preference.salary_range_min?.toString() || "",
            salary_range_max: details.preference.salary_range_max?.toString() || ""
          });
          if (details.experiences?.length > 0) setExperiences(details.experiences);
          if (details.documents?.length > 0) setDocuments(details.documents);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const savePersonal = async () => {
    console.log('Saving personal:', personal);
    const res = await fetch("http://localhost:5000/dashboard/tutor/profile/personal", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({
        full_name: personal.full_name,
        phone: personal.phone,
        address: personal.address,
        teaching_experience: personal.teaching_experience,
        student_preference: personal.student_preference
      })
    });
    const data = await res.json();
    console.log('Save response:', data);
    if (res.ok) showToast("Personal info saved!");
    else showToast("Failed: " + data.error);
  };

  const saveEducation = async () => {
    const res = await fetch("http://localhost:5000/dashboard/tutor/profile/education", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(education)
    });
    if (res.ok) showToast("Education saved!");
    else showToast("Failed to save.");
  };

  const savePreference = async () => {
    const res = await fetch("http://localhost:5000/dashboard/tutor/profile/preference", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({
        ...preference,
        salary_range_min: preference.salary_range_min ? Number(preference.salary_range_min) : null,
        salary_range_max: preference.salary_range_max ? Number(preference.salary_range_max) : null
      })
    });
    if (res.ok) showToast("Preference saved!");
    else showToast("Failed to save.");
  };

  const saveExperience = async () => {
    const res = await fetch("http://localhost:5000/dashboard/tutor/profile/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ experiences })
    });
    if (res.ok) showToast("Experience saved!");
    else showToast("Failed to save.");
  };

  const saveDocuments = async () => {
    const filled = documents.filter(d => d.document_type || d.file_url);
    for (const doc of filled) {
      await fetch("http://localhost:5000/dashboard/tutor/profile/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(doc)
      });
    }
    showToast("Documents saved!");
  };

  const submitVerification = async () => {
    if (!personal.teaching_experience.trim()) {
      showToast("Please enter teaching experience first.");
      return;
    }
    const res = await fetch("http://localhost:5000/dashboard/tutor/request-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }
    });
    if (res.ok) {
      localStorage.setItem("verificationSubmitted", "true");
      setVerificationSubmitted(true);
      showToast("Submitted! Admin will review soon.");
    } else {
      showToast("Failed to submit.");
    }
  };

  const handleDocumentFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setDocuments(prev => prev.map((d, i) =>
        i === index ? { ...d, file_name: file.name, file_url: base64 } : d
      ));
      showToast("File ready. Click Save docs to upload.");
    };
    reader.readAsDataURL(file);
  };

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2D7A3A]";
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500";
  const cardClass = "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm";
  const saveBtn = "rounded-lg border border-[#2D7A3A] px-3 py-1.5 text-xs font-semibold text-[#2D7A3A] hover:bg-green-50";

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-[#2D7A3A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-[#2D7A3A] px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className={cardClass}>
        <h1 className="text-2xl font-semibold text-gray-800">Your Tutor Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          {personal.full_name} • {personal.email}
        </p>
        <div className="mt-2">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              <CheckCircle2 className="h-3 w-3" /> Verified Tutor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
              <Circle className="h-3 w-3" /> Pending Verification
            </span>
          )}
        </div>
      </div>

      {isVerified ? (
        <div className="rounded-xl border border-green-300 bg-green-50 px-5 py-3 text-green-800 text-sm font-medium">
          You are a Verified Tutor! Your profile is visible to students.
        </div>
      ) : verificationSubmitted ? (
        <div className="rounded-xl border border-orange-300 bg-orange-50 px-5 py-3 text-orange-800 text-sm font-medium">
          Verification Pending - Admin is reviewing your profile.
        </div>
      ) : (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-3 text-yellow-800 text-sm font-medium">
          Complete your profile and upload documents to submit for verification.
        </div>
      )}

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <button onClick={savePersonal} className={saveBtn}>Save</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} value={personal.full_name}
              onChange={e => setPersonal(p => ({ ...p, full_name: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Email (read only)</label>
            <input className={inputClass + " bg-gray-50 cursor-not-allowed"}
              value={personal.email} readOnly />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={personal.phone}
              onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea className={inputClass} rows={2} value={personal.address}
              onChange={e => setPersonal(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Teaching Experience *</label>
            <textarea className={inputClass} rows={3} value={personal.teaching_experience}
              onChange={e => setPersonal(p => ({ ...p, teaching_experience: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Student Preference</label>
            <textarea className={inputClass} rows={2} value={personal.student_preference}
              onChange={e => setPersonal(p => ({ ...p, student_preference: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Educational Qualifications</h2>
          <button onClick={saveEducation} className={saveBtn}>Save</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Current Institution", "current_institution"],
            ["Current Level", "current_level"],
            ["Current Subject", "current_subject"],
            ["Graduation Year", "current_grad_year"],
            ["GPA/CGPA", "current_gpa"],
            ["Previous Institution", "prev_institution"],
            ["Previous Level", "prev_level"],
            ["Previous Subject", "prev_subject"],
            ["Previous Grad Year", "prev_grad_year"],
            ["Previous GPA", "prev_gpa"],
          ].map(([label, field]) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input className={inputClass}
                value={(education as any)[field]}
                onChange={e => setEducation(p => ({ ...p, [field]: e.target.value }))} />
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tuition Preference</h2>
          <button onClick={savePreference} className={saveBtn}>Save</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Subjects", "subjects"],
            ["Class Range", "class_range"],
            ["Tuition Type", "tuition_type"],
            ["Curriculum", "preferred_curriculum"],
            ["Min Salary (BDT)", "salary_range_min"],
            ["Max Salary (BDT)", "salary_range_max"],
          ].map(([label, field]) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input className={inputClass}
                value={(preference as any)[field]}
                onChange={e => setPreference(p => ({ ...p, [field]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className={labelClass}>Preferred Gender</label>
            <select className={inputClass} value={preference.preferred_gender}
              onChange={e => setPreference(p => ({ ...p, preferred_gender: e.target.value }))}>
              <option value="">Select</option>
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Teaching Experience</h2>
          <div className="flex gap-2">
            <button onClick={() => setExperiences(p => [...p, { institution: "", class_range: "", subjects: "", duration: "" }])}
              className={saveBtn}>
              <Plus className="inline h-3 w-3" /> Add
            </button>
            <button onClick={saveExperience} className={saveBtn}>Save</button>
          </div>
        </div>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                {(["institution", "class_range", "subjects", "duration"] as const).map(field => (
                  <div key={field}>
                    <label className={labelClass}>{field.replace("_", " ")}</label>
                    <input className={inputClass} value={exp[field]}
                      onChange={e => setExperiences(prev => prev.map((x, idx) =>
                        idx === i ? { ...x, [field]: e.target.value } : x
                      ))} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Verification Documents</h2>
          <div className="flex gap-2">
            <button onClick={() => setDocuments(p => [...p, { document_type: "", file_name: "", file_url: "" }])}
              className={saveBtn}>
              <Plus className="inline h-3 w-3" /> Add
            </button>
            <button onClick={saveDocuments} className={saveBtn}>Save docs</button>
          </div>
        </div>
        <div className="space-y-4">
          {documents.map((doc, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Document Type</label>
                  <input className={inputClass} value={doc.document_type}
                    placeholder="e.g. HSC Certificate, NID"
                    onChange={e => setDocuments(prev => prev.map((d, idx) =>
                      idx === i ? { ...d, document_type: e.target.value } : d
                    ))} />
                </div>
                <div>
                  <label className={labelClass}>Upload File</label>
                  {doc.file_url ? (
                    <div className="flex items-center gap-2 rounded-lg border border-[#2D7A3A] bg-white px-3 py-2">
                      <FileText className="h-4 w-4 text-[#2D7A3A]" />
                      <span className="flex-1 truncate text-sm">{doc.file_name}</span>
                      <button onClick={() => setDocuments(prev => prev.map((d, idx) =>
                        idx === i ? { ...d, file_name: "", file_url: "" } : d
                      ))}>
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-[#2D7A3A] px-3 py-2 hover:bg-green-50">
                      <Upload className="h-4 w-4 text-[#2D7A3A]" />
                      <span className="text-sm text-[#2D7A3A]">Choose file</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                        onChange={e => handleDocumentFile(i, e)} />
                    </label>
                  )}
                </div>
              </div>
              {doc.file_url && doc.file_url.startsWith("data:image") && (
                <img src={doc.file_url} alt={doc.file_name}
                  className="mt-3 h-40 w-full rounded-lg object-contain border border-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>

      {!isVerified && (
        <div className={cardClass}>
          <h2 className="mb-2 text-lg font-semibold">Ready to Start Teaching?</h2>
          <p className="mb-4 text-sm text-gray-500">
            Complete your profile and upload documents then submit for verification.
          </p>
          {verificationSubmitted ? (
            <button disabled className="rounded-lg bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed">
              Verification Pending
            </button>
          ) : (
            <button onClick={submitVerification}
              className="rounded-lg bg-[#2D7A3A] px-6 py-3 text-sm font-semibold text-white hover:bg-green-800">
              Submit for Verification
            </button>
          )}
        </div>
      )}

    </div>
  );
}