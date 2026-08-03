// app/about/page.tsx

import Image from "next/image";
import {
    ArrowRight,
    CheckCircle2,
    Users,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const team = [
    {
        name: "MAIMUNA TABASSUM",
        role: "Team Leader",
        image: "/images/team1.png"
    },
    {
        name: "Safiyat Sayma",
        role: "Fronted Developer",
        image: "/images/team2.png"
    },
    {
        name: "Tahsina Tasnim Afra",
        role: "Backend Developer",
        image: "/images/team3.png"
    }
];

export default function AboutPage() {
    return (
        <main className="bg-[#F8F6FF]">

            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    {/* Logo */}
                    <div className="text-2xl font-bold text-[#6C3BFF]">
                        <img src="/images/logo.png" alt="" width={100} height={30} />
                    </div>

                    {/* Menu */}
                    <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
                        <li><a href="/" className="hover:text-[#2a9e6e]">Home</a></li>
                        <li><a href="/about" className="text-[#2a9e6e] font-semibold">About</a></li>
                        <li><a href="/tutors" className="hover:text-[#2a9e6e]">Tutors</a></li>
                        <li><a href="/contact" className="hover:text-[#2a9e6e]">Contact</a></li>
                    </ul>

                    {/* Button */}
                    <button className="rounded-full bg-[#0f572b] px-6 py-3 text-white transition hover:bg-[#2a9e6e]">
                        Get Started
                    </button>

                </div>
            </nav>

            {/* Hero */}

            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div>

                        <span className="inline-flex items-center rounded-full bg-[#EEE7FF] px-4 py-1 text-sm font-medium text-[#3e8b60]">
                            About Us
                        </span>

                        <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
                            Building better digital
                            <span className="text-[#3e8b60]"> experiences.</span>
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-[#050505]">
                            ShikkhaLink connects students with qualified tutors through a simple,
                            secure, and user-friendly platform. Our goal is to make quality education
                            accessible anytime and anywhere.
                        </p>

                        <div className="mt-10 flex gap-4">

                            <button className="rounded-xl text-[#3e8b60] px-6 py-3 font-medium text-white hover:bg-green-600 transition">
                                Get Started
                            </button>

                            <button className="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100">
                                Learn More
                                <ArrowRight size={18} />
                            </button>

                        </div>

                    </div>

                    <div className="relative">

                        <div className="overflow-hidden rounded-3xl">

                            <Image
                                src="/images/about.png"
                                alt="About"
                                width={700}
                                height={700}
                                className="h-full w-full object-cover"
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= TEAM ================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="text-center max-w-2xl mx-auto">

                        <span className="text-[#2a9e6e] font-semibold">
                            OUR TEAM
                        </span>

                        <h2 className="mt-3 text-4xl font-bold text-slate-900">
                            Meet Our Experts
                        </h2>

                        <p className="mt-4 text-slate-600">
                            Our dedicated team works together to create a trusted platform where
                            students can easily find experienced tutors and achieve their academic goals.
                        </p>

                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {team.map((member) => (

                            <div
                                key={member.name}
                                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                            >

                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={500}
                                    height={400}
                                    className="h-80 w-full object-cover"
                                />

                                <div className="p-6">

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {member.name}
                                    </h3>

                                    <p className="mt-2 text-[#2a9e6e]">
                                        {member.role}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* ================= WHY US ================= */}

            <section className="py-24">

    <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-16 lg:grid-cols-2 items-center">

            <div>

                <Image
                    src="/images/about2.png"
                    alt="ShikkhaLink"
                    width={700}
                    height={700}
                    className="rounded-3xl object-cover"
                />

            </div>


            <div>

                <span className="font-semibold text-[#2a9e6e]">
                    WHY CHOOSE US
                </span>


                <h2 className="mt-4 text-4xl font-bold text-slate-900">
                    Connecting Students With The Right Tutors.
                </h2>


                <p className="mt-6 leading-8 text-slate-600">
                    ShikkhaLink provides a trusted platform where students can
                    easily find qualified tutors and get personalized learning
                    support according to their academic needs.
                </p>


                <div className="mt-10 space-y-6">

                    {[
                        {
                            icon: <Users className="text-[#2a9e6e]" size={24} />,
                            title: "Qualified Tutors",
                            text: "Connect with experienced and verified tutors from different subjects.",
                        },
                        {
                            icon: <ShieldCheck className="text-[#2a9e6e]" size={24} />,
                            title: "Safe & Trusted Platform",
                            text: "We ensure a secure environment for both students and tutors.",
                        },
                        {
                            icon: <Sparkles className="text-[#2a9e6e]" size={24} />,
                            title: "Personalized Learning",
                            text: "Get learning support designed according to individual student requirements.",
                        },
                    ].map((item) => (

                        <div
                            key={item.title}
                            className="flex gap-4 rounded-2xl border p-5"
                        >

                            <div>
                                {item.icon}
                            </div>


                            <div>

                                <h3 className="font-semibold text-lg">
                                    {item.title}
                                </h3>


                                <p className="mt-1 text-slate-600">
                                    {item.text}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    </div>

</section>

            {/* ================= STATS ================= */}

            <section className="bg-[#2c5242] py-17 text-white">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

                        {[
                            {
                                number: "7+",
                                title: "Years Experience",
                            },
                            {
                                number: "500+",
                                title: "Sessions Completed",
                            },
                            {
                                number: "1200+",
                                title: "Happy Students",
                            },
                            {
                                number: "250+",
                                title: "Tutors",
                            },
                        ].map((item) => (

                            <div
                                key={item.title}
                                className="rounded-3xl bg-white/5 p-10 text-center backdrop-blur"
                            >

                                <h2 className="text-5xl font-bold text-[#f5f6f6]">
                                    {item.number}
                                </h2>

                                <p className="mt-4 text-slate-300">
                                    {item.title}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* ================= FEATURES ================= */}

            <section className="py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="text-center">

                        <span className="font-semibold text-[#2a9e6e]">
                            OUR VALUES
                        </span>

                        <h2 className="mt-3 text-4xl font-bold">
                            What Makes Us Different
                        </h2>

                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {[
                            {
                                title: "Verified Tutors",
                                text: "We connect students with qualified and trusted tutors who are verified for a safe learning experience.",
                            },
                            {
                                title: "Personalized Learning",
                                text: "Students can find tutors based on their subjects, requirements, and preferred learning style.",
                            },
                            {
                                title: "Easy Communication",
                                text: "Our platform makes communication between students and tutors simple, fast, and convenient.",
                            },
                            {
                                title: "Modern Technology",
                                text: "We use modern technology to provide a smooth and efficient tutoring platform.",
                            },
                            {
                                title: "Student Support",
                                text: "We ensure continuous support to help students achieve their academic goals.",
                            },
                            {
                                title: "Affordable Education",
                                text: "We aim to make quality education accessible with flexible and affordable tutoring options.",
                            },
                        ].map((item) => (

                            <div
                                key={item.title}
                                className="rounded-3xl border bg-white p-8 transition hover:-translate-y-2 hover:shadow-lg"
                            >

                                <CheckCircle2
                                    size={34}
                                    className="text-[#2a9e6e]"
                                />

                                <h3 className="mt-6 text-xl font-semibold">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-slate-600 leading-7">
                                    {item.text}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* ================= CTA ================= */}

            <section className="pb-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="rounded-[32px] bg-[#2a9e6e] px-10 py-20 text-center text-white">

                        <h2 className="text-4xl font-bold">
                            Ready to Start Your Learning Journey?
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-green-100">
                            Find the right tutor, improve your skills, and achieve your
                            academic goals with ShikkhaLink.
                        </p>

                        <button className="mt-10 rounded-xl bg-white px-8 py-4 font-semibold text-[#2a9e6e] transition hover:bg-slate-100">
                            Find a Tutor
                        </button>

                    </div>

                </div>

            </section>

            {/* ===================== ABOUT SECTION 4 ===================== */}

            <section className="bg-[#f8f6ff] py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">

                    <div>

                        <span className="inline-block bg-[#eee7ff] text-[#2a9e6e] px-4 py-2 rounded-full text-sm font-medium mb-4">
                            About ShikkhaLink
                        </span>

                        <h2 className="text-5xl font-bold leading-tight text-gray-900 mb-6">
                            Connecting Students
                            <br />
                            With Trusted Tutors
                        </h2>

                        <p className="text-gray-500 leading-8 mb-8">
                            ShikkhaLink is a modern tutor hiring platform that helps students
                            find qualified tutors easily. We aim to make learning more
                            accessible, flexible, and effective for everyone.
                        </p>


                        <div className="grid sm:grid-cols-2 gap-6 mb-8">

                            <div className="bg-white rounded-2xl p-6 shadow">

                                <div className="w-12 h-12 mx-auto rounded-xl bg-[#eee7ff] flex items-center justify-center text-[#2a9e6e] text-xl mb-4">
                                    💡
                                </div>

                                <h4 className="font-semibold text-lg mb-2">
                                    Smart Tutor Matching
                                </h4>

                                <p className="text-gray-500 text-sm">
                                    Find the right tutor based on subject, experience,
                                    availability, and learning needs.
                                </p>

                            </div>


                            <div className="bg-white rounded-2xl p-6 shadow">

                                <div className="w-12 h-12 mx-auto rounded-xl bg-[#eee7ff] flex items-center justify-center text-[#2a9e6e] text-xl mb-4">
                                    🚀
                                </div>

                                <h4 className="font-semibold text-lg mb-2">
                                    Better Learning Growth
                                </h4>

                                <p className="text-gray-500 text-sm">
                                    Helping students improve their skills with personalized
                                    guidance from experienced tutors.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>
            </section>
        </main>
    );
}

