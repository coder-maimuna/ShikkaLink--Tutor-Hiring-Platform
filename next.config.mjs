/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/student-dashboard', destination: '/dashboard/student', permanent: false },
      { source: '/teacher-dashboard', destination: '/dashboard/tutor', permanent: false },
      { source: '/admin-dashboard', destination: '/dashboard/admin', permanent: false },
      { source: '/login', destination: '/auth/login', permanent: false },
    ];
  },
}

export default nextConfig
