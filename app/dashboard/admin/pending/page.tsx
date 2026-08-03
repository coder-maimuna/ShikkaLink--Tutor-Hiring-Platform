"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function PendingTutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPendingTutors() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          'http://localhost:5000/dashboard/admin/pending-tutors',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success) {
          setTutors(data.pending_tutors || []);
        } else {
          setError("Failed to load pending tutors");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load pending tutors");
      } finally {
        setLoading(false);
      }
    }
    loadPendingTutors();
  }, []);

  const handleVerify = async (id: number) => {
    if (!confirm("Approve this tutor application?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/tutor/${id}/verify`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to approve tutor");

      setTutors(prev => prev.filter(t => t.user_id !== id));
      alert("Tutor approved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to approve tutor");
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Reject this tutor application?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/dashboard/admin/tutor/${id}/reject`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to reject tutor");

      setTutors(prev => prev.filter(t => t.user_id !== id));
      alert("Tutor rejected successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to reject tutor");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) return (
    <div className="p-6 text-red-600">{error}</div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Pending Tutor Requests</h1>
      <p className="text-gray-600 mb-6">Review and approve/reject tutor applications</p>

      {tutors.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-lg">
          No pending requests ✅
        </div>
      ) : (
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <div key={tutor.user_id} className="border rounded-lg p-6 shadow-sm">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-xl">
                      {String(tutor.full_name || "T").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tutor.full_name || "Tutor"}</h3>
                    <p className="text-gray-600">{tutor.email || "No email"}</p>
                    <p className="text-gray-600">{tutor.phone || "No phone"}</p>
                    {tutor.teaching_experience && (
                      <p className="text-gray-700 mt-1">
                        Teaching Experience: {tutor.teaching_experience}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(tutor.user_id!)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(tutor.user_id!)}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Education Section */}
              {tutor.education && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-gray-700">Education</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Institution</p>
                      <p className="font-medium">{tutor.education.current_institution || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Level</p>
                      <p className="font-medium">{tutor.education.current_level || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Subject</p>
                      <p className="font-medium">{tutor.education.current_subject || "N/A"}</p>
                    </div>
                    {tutor.education.current_gpa && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">GPA</p>
                        <p className="font-medium">{tutor.education.current_gpa}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preference Section */}
              {tutor.preference && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-gray-700">Tuition Preference</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Subjects</p>
                        <p className="font-medium">{tutor.preference.subjects || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Class Range</p>
                        <p className="font-medium">{tutor.preference.class_range || "Not provided"}</p>
                      </div>
                      {tutor.preference.salary_range_min && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Salary</p>
                          <p className="font-medium">
                            BDT {tutor.preference.salary_range_min}-{tutor.preference.salary_range_max || "N/A"} /hr
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {tutor.documents && tutor.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">Documents</h4>
                  <div className="space-y-2">
                    {tutor.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.document_type || "Document"}</p>
                            <p className="text-sm text-gray-600">{doc.file_name || "No filename"}</p>
                          </div>
                        </div>
                        {doc.file_url && (
                          <button
                            onClick={() => window.open(doc.file_url, '_blank')}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm font-semibold text-green-600 hover:bg-green-50"
                          >
                            View Document
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
