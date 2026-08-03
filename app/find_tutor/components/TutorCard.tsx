"use client";

import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  BookOpen,
  GraduationCap,
  Wallet,
  Briefcase,
  Monitor,
} from "lucide-react";

import { Tutor } from "../types/tutor";

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({
  tutor,
}: TutorCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/tutor-profile/${tutor.tutor_id}`);
  };

  const handleBookSession = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/auth/login");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tutor_id: tutor.tutor_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to book session");
      return;
    }

    alert("Session booked successfully!");
    router.push("/dashboard/student");

  } catch (err) {
    console.error(err);
    alert("Failed to book session.");
  }
};

  return (
    <article
      className="
      rounded-2xl
      bg-white
      shadow-md
      border
      border-green-100
      p-6
      transition-all
      duration-300
      hover:shadow-xl
      hover:-translate-y-1
      "
    >
      <div className="flex flex-col gap-6 md:flex-row">

        {/* Avatar */}

        <div className="flex justify-center">

          <div
            className="
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-full
            bg-green-100
            text-4xl
            font-bold
            text-green-700
            "
          >
            {tutor.full_name.charAt(0)}
          </div>

        </div>

        {/* Information */}

        <div className="flex flex-1 flex-col">

          {/* Header */}

          <div className="flex flex-col justify-between gap-3 md:flex-row">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                {tutor.full_name}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-gray-500">

                <MapPin size={16} />

                <span>{tutor.address}</span>

              </div>

            </div>

            <div
              className="
              flex
              items-center
              gap-2
              rounded-full
              bg-yellow-50
              px-3
              py-2
              "
            >
              <Star
                size={18}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="font-semibold">
                {tutor.rating.toFixed(1)}
              </span>
            </div>

          </div>

          {/* Details */}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="flex items-center gap-3">

              <BookOpen
                className="text-green-700"
                size={18}
              />

              <span>{tutor.subjects}</span>

            </div>

            <div className="flex items-center gap-3">

              <GraduationCap
                className="text-green-700"
                size={18}
              />

              <span>{tutor.class_range}</span>

            </div>

            <div className="flex items-center gap-3">

              <Monitor
                className="text-green-700"
                size={18}
              />

              <span>{tutor.tuition_type}</span>

            </div>

            <div className="flex items-center gap-3">

              <Briefcase
                className="text-green-700"
                size={18}
              />

              <span>{tutor.experience}</span>

            </div>

            <div className="flex items-center gap-3">

              <Wallet
                className="text-green-700"
                size={18}
              />

              <span>
                BDT {tutor.salary_min.toLocaleString()} -{" "}
                {tutor.salary_max.toLocaleString()}
              </span>

            </div>

            <div
              className="
              rounded-full
              bg-green-100
              px-3
              py-2
              text-center
              text-sm
              font-medium
              text-green-700
              "
            >
              {tutor.curriculum}
            </div>

          </div>

          {/* Buttons */}

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={handleViewProfile}
              className="
              rounded-xl
              border-2
              border-green-700
              px-6
              py-3
              font-medium
              text-green-700
              transition
              hover:bg-green-50
              "
            >
              View Profile
            </button>

            <button
              onClick={handleBookSession}
              className="
              rounded-xl
              bg-green-700
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-green-800
              "
            >
              Book Session
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}