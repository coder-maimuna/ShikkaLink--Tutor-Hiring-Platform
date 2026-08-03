"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';

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
      className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
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

         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button
                             variant="ghost"
                             className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                             onClick={() => router.push('/auth/login')}
                           >
                             Sign In
                           </Button>
                         </motion.div>
                         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => router.push('/auth/login')}>
                             Get Started
                           </Button>
                         </motion.div>

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