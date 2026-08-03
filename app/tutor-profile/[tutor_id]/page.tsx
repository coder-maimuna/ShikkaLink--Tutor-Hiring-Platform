"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  MapPin,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function TutorProfilePage() {
  const params = useParams();
  const tutorId = params.tutor_id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tutor, setTutor] = useState<any>(null);

  useEffect(() => {
    if (!tutorId) return;

    async function loadTutorProfile() {
      try {
        setLoading(true);
        console.log('Fetching tutor profile with ID:', tutorId);
        const response = await fetch(`http://localhost:5000/api/tutor/profile/${tutorId}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok && data) {
          setTutor(data);
        } else {
          setError(data.message || "Failed to load tutor profile");
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || "Failed to load tutor profile");
      } finally {
        setLoading(false);
      }
    }

    loadTutorProfile();
  }, [tutorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tutor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No tutor data available</p>
        </div>
      </div>
    );
  }

  // Extract tutor info from backend response - matching backend structure
  const tutorName = tutor.full_name || tutor.tutor_name || "Not available";
  const tutorAddress = tutor.address || "Not available";
  const tutorSubjects = tutor.subjects || "Not specified";
  const tutorRating = tutor.rating || 0;
  const tutorSalaryMin = tutor.salary_min || "Not available";
  const tutorSalaryMax = tutor.salary_max || "Not available";
  const tutorCurriculum = tutor.curriculum || "Not specified";
  const tutorExperience = tutor.experience || "Not specified";
  const tutorTuitionType = tutor.tuition_type || "Not specified";
  const tutorClassRange = tutor.class_range || "Not specified";

  // Parse rating stars (backend returns 0-5 rating)
  const stars = Array(5).fill(0).map((_, i) => (
    <Star
      key={i}
      size={16}
      className={i < Math.floor(tutorRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
    />
  ));

  // Handle experiences array from backend
  const experiences = tutor.experiences || [];



  return (
    <div className="min-h-screen bg-[#f7faf8] text-gray-800">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">

        <div className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="ShikkhaLink"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <span className="font-semibold text-lg text-gray-800">ShikkhaLink</span>
        </div>


        <div className="hidden md:flex gap-6 text-gray-600">
          <span>Home</span>
          <span>Tutors</span>
          <span>Dashboard</span>
          <span>Profile</span>
        </div>

      </nav>



      <main className="mx-auto max-w-5xl p-6">


        {/* Profile Header */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">


          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">


            {/* Image */}
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-green-100">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                {tutorName.charAt(0).toUpperCase()}
              </div>
            </div>


            {/* Info */}
            <div className="flex-1">

              <div className="flex items-center gap-2">

                <h1 className="text-3xl font-bold">
                  {tutorName}
                </h1>

                {tutorRating > 0 && (
                  <CheckCircle
                    size={22}
                    className="text-green-600"
                  />
                )}

              </div>


              <p className="mt-2 text-gray-500">
                {tutorSubjects}
              </p>


              <p className="flex gap-2 items-center mt-2 text-gray-500">

                <MapPin size={18} />
                {tutorAddress}

              </p>


            </div>


          </div>


        </section>





        {/* Information Grid */}

        <div className="grid md:grid-cols-2 gap-6 mt-6">


          {/* Education */}

          <div className="bg-white rounded-xl p-6 shadow-sm">

            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">

              <GraduationCap className="text-green-600" />
              Education

            </h2>

            <p className="text-gray-500 text-sm">Education information not available in backend response</p>


          </div>



          {/* Preference */}

          <div className="bg-white rounded-xl p-6 shadow-sm">

            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">

              <BookOpen className="text-green-600" />
              Tuition Preference

            </h2>


            <p><b>Subjects:</b> {tutorSubjects}</p>
            <p className="mt-2"><b>Class Range:</b> {tutorClassRange}</p>
            <p className="mt-2"><b>Curriculum:</b> {tutorCurriculum}</p>
            <p className="mt-2"><b>Tuition Type:</b> {tutorTuitionType}</p>


          </div>



        </div>





        {/* Experience */}

        <section className="mt-6 bg-white rounded-xl p-6 shadow-sm">

          <h2 className="text-xl font-semibold mb-4">
            Teaching Experience
          </h2>


          {experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx} className="border-l-4 border-green-600 pl-5">
                  <h3 className="font-semibold text-gray-800">{exp.institution || 'Institution not specified'}</h3>
                  <p className="text-gray-500">
                    {exp.subjects || 'Various subjects'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {exp.duration || 'Duration not specified'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{tutorExperience}</p>
          )}


        </section>





        {/* Tuition Info */}

        <section className="mt-6 bg-white rounded-xl p-6 shadow-sm">

          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">

            <CalendarDays className="text-green-600" />
            Tuition Information

          </h2>



          <div className="flex flex-col md:flex-row justify-between gap-5">

            <div>

              <p>
                <b>Minimum Salary:</b> {tutorSalaryMin} BDT
              </p>

              <p className="mt-2">
                <b>Maximum Salary:</b> {tutorSalaryMax} BDT
              </p>

              <div className="flex mt-3 gap-1 text-yellow-500">
                {stars}
              </div>
              {tutorRating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  ({tutorRating} / 5.0)
                </p>
              )}


            </div>



            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                  router.push("/auth/login");
                  return;
                }

                try {
                  const profileResponse = await fetch('/api/student/profile', {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });

                  if (!profileResponse.ok) {
                    throw new Error('Failed to fetch student profile');
                  }

                  const profileData = await profileResponse.json();
                  const studentProfile = profileData.studentProfile;

                  if (!studentProfile) {
                    throw new Error('Student profile not found');
                  }

                  // Parse tutor_preference to get subject and duration_minutes
                  let subject = 'General';
                  let duration_minutes = 60;

                  if (studentProfile.tutor_preference) {
                    try {
                      const preference = JSON.parse(studentProfile.tutor_preference);
                      subject = preference.subject || 'General';
                      duration_minutes = preference.duration_minutes || 60;
                    } catch (error) {
                      console.warn('Could not parse tutor_preference, using defaults');
                    }
                  }

                  const sessionResponse = await fetch('/api/sessions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      tutor_id: parseInt(tutorId),
                      subject,
                      duration_minutes
                    })
                  });

                  if (sessionResponse.ok) {
                    alert('Session booked successfully!');
                    router.push('/dashboard/student');
                  } else {
                    const errorData = await sessionResponse.json();
                    alert(`Failed to book session: ${errorData.message}`);
                  }
                } catch (error) {
                  console.error('Error booking session:', error);
                  alert('Failed to book session. Please try again.');
                }
              }}
              className="bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold px-6 py-2.5 transition-colors"
            >
              Book Session
            </button>

          </div>


        </section>


      </main>


    </div>
  );
}
