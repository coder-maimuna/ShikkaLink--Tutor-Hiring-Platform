"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    title: "Find Tutors",
    href: "/find_tutor",
  },
  {
    title: "Become Tutor",
    href: "/auth/tutor-register",
  },
  {
    title: "About",
    href: "#",
  },
  {
    title: "Contact",
    href: "#",
  },
];

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <img
          src="/images/logo.png"
          alt="logo"
          className="h-12 cursor-pointer"
          onClick={() => router.push("/")}
        />

        <div className="hidden items-center gap-8 md:flex">

          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.href)}
              className="font-medium text-gray-600 transition hover:text-green-700"
            >
              {item.title}
            </button>
          ))}

        </div>

        <div className="hidden gap-3 md:flex">

          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-lg border border-green-600 px-5 py-2 font-medium text-green-700 transition hover:bg-green-50"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/auth/student-register")}
            className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800"
          >
            Get Started
          </button>

        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

      </div>

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t bg-white md:hidden"
          >
            <div className="space-y-4 p-5">

              {menuItems.map((item) => (

                <button
                  key={item.title}
                  onClick={() => router.push(item.href)}
                  className="block w-full text-left"
                >
                  {item.title}
                </button>

              ))}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.nav>
  );
}