"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const router = useRouter();

  useEffect(() => {
    // Booking is now handled directly in the Book Session buttons
    // This page is kept for backward compatibility but doesn't do anything
    alert('Booking is now handled directly. Please try again.');
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f7faf8] text-gray-800 flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
