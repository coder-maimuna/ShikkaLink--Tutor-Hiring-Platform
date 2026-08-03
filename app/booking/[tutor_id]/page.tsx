"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, BookOpen, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.tutor_id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    duration_minutes: 60,
  });

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is required");
      setLoading(false);
      return;
    }
    fetchAvailability();
  }, [tutorId]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      console.log('Fetching availability for tutor:', tutorId);
      const response = await api.get(`/api/tutor/${tutorId}/availability`);
      console.log('Availability response:', response.data);
      if (response.data.success && response.data.availability) {
        setAvailability(response.data.availability);
      }
    } catch (err: any) {
      console.error('Availability fetch error:', err);
      setError(err.response?.data?.message || "Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(`${slot.day_of_week} - ${slot.time_slot} (${slot.subject})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !selectedSlot) {
      setError("Please select a subject and availability slot");
      return;
    }

    try {
      setSubmitting(true);

      const sessionData = {
        tutor_id: parseInt(tutorId),
        subject: formData.subject,
        scheduled_time: selectedSlot.split(" - ")[0], // Just the date/time part
        duration_minutes: formData.duration_minutes,
      };

      const response = await api.post("/api/sessions", sessionData);

      if (response.data.success) {
        // Redirect to student dashboard on success
        router.push("/dashboard/student");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to book session");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (availability.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No availability slots available for this tutor.</p>
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Book a Session
          </h1>
          <p className="text-gray-600 mt-2">
            Select an available slot to book your tutoring session
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <BookOpen className="inline w-5 h-5 mr-2 text-green-600" />
              Subject
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availability.map((slot) => (
                <label
                  key={`${slot.day_of_week}-${slot.time_slot}`}
                  className={`
                    relative flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${
                      formData.subject === slot.subject
                        ? 'border-green-600 bg-green-50 ring-2 ring-green-600'
                        : 'border-gray-200 hover:border-green-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="subject"
                    value={slot.subject}
                    checked={formData.subject === slot.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-medium">{slot.subject}</span>
                  {formData.subject === slot.subject && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Available Slots */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <Calendar className="inline w-5 h-5 mr-2 text-green-600" />
              Available Slots
            </h2>

            <div className="space-y-3">
              {availability.map((slot) => (
                <label
                  key={`${slot.slot_id}`}
                  className={`
                    block p-4 rounded-lg border cursor-pointer transition-all
                    ${
                      selectedSlot.includes(`${slot.day_of_week} - ${slot.time_slot}`)
                        ? 'border-green-600 bg-green-50 ring-2 ring-green-600'
                        : 'border-gray-200 hover:border-green-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={`${slot.day_of_week} - ${slot.time_slot}`}
                    checked={selectedSlot.includes(`${slot.day_of_week} - ${slot.time_slot}`)}
                    onChange={(e) => handleSlotSelect(slot)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {slot.day_of_week}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {slot.time_slot} ({slot.subject})
                        </span>
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <Clock className="inline w-5 h-5 mr-2 text-green-600" />
              Session Duration
            </h2>

            <div className="flex flex-wrap gap-3">
              {[
                { value: 30, label: '30 minutes' },
                { value: 60, label: '60 minutes' },
                { value: 90, label: '90 minutes' },
                { value: 120, label: '2 hours' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    relative flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${
                      formData.duration_minutes === option.value
                        ? 'border-green-600 bg-green-50 ring-2 ring-green-600'
                        : 'border-gray-200 hover:border-green-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={formData.duration_minutes === option.value}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    className="sr-only"
                  />
                  <span className="font-medium">{option.label}</span>
                  {formData.duration_minutes === option.value && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !formData.subject || !selectedSlot}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="inline w-5 h-5 animate-spin mr-2" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
