"use client";

import Image from "next/image";
import {
  CheckCircle,
  MapPin,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Star,
} from "lucide-react";

export default function TutorProfilePage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] text-gray-800">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">

        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="ShikkhaLink"
            width={105}
            height={145}
          />


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

              <Image
                src="/images/tutor1.png"
                alt="Tutor"
                fill
                className="object-cover"
              />

            </div>



            {/* Info */}
            <div className="flex-1">


              <div className="flex items-center gap-2">

                <h1 className="text-3xl font-bold">
                  Tanvir Ahmed
                </h1>

                <CheckCircle
                  size={22}
                  className="text-green-600"
                />

              </div>



              <p className="mt-2 text-gray-500">
                Computer Science & Engineering Student
              </p>



              <p className="flex gap-2 items-center mt-2 text-gray-500">

                <MapPin size={18} />
                Dhaka, Bangladesh

              </p>



              <div className="flex gap-2 mt-4 flex-wrap">

                {
                  ["Mathematics", "Physics", "SSC & HSC"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700"
                      >
                        {item}
                      </span>
                    )
                  )
                }

              </div>


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


            <p><b>Degree:</b> BSc in CSE</p>
            <p className="mt-2"><b>University:</b> Green University</p>
            <p className="mt-2"><b>CGPA:</b> 3.90</p>


          </div>




          {/* Preference */}

          <div className="bg-white rounded-xl p-6 shadow-sm">


            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">

              <BookOpen className="text-green-600" />
              Tuition Preference

            </h2>


            <p><b>Subject:</b> Mathematics, Physics</p>
            <p className="mt-2"><b>Class:</b> 9 - 12</p>
            <p className="mt-2"><b>Mode:</b> Online / Offline</p>


          </div>



        </div>





        {/* Experience */}

        <section className="mt-6 bg-white rounded-xl p-6 shadow-sm">


          <h2 className="text-xl font-semibold mb-4">
            Teaching Experience
          </h2>


          <div className="border-l-4 border-green-600 pl-5">

            <h3 className="font-semibold">
              Mathematics Instructor
            </h3>


            <p className="text-gray-500">
              ABC Coaching Center
            </p>


            <p className="mt-2">
              3 years experience in teaching SSC and HSC students.
            </p>


          </div>


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
                <b>Salary:</b> 7000 - 15000 BDT
              </p>

              <p className="mt-2">
                <b>Available:</b> Sat - Thu
              </p>

              <p className="mt-2">
                <b>Area:</b> Dhaka
              </p>


              <div className="flex mt-3 gap-1 text-yellow-500">

                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />

              </div>


            </div>




            <button
              className="bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold w-32 h-10"
            >
              Book Session
            </button>

          </div>


        </section>


      </main>


    </div>
  );
}