'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, ChevronLeft, Star, Users, BookOpen, TrendingUp, Menu, X, ArrowRight, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform,Variants } from 'framer-motion';
import CountUp from 'react-countup';


// Enhanced animation variants for SaaS premium feel
const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.23, 1, 0.82, 1] },
  },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.7]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  const topMentors = [
    {
      id: 1,
      name: 'Ayesha Khan',
      specialty: 'Computer Science',
      rating: 4.9,
      reviews: 20,
      initials: 'AK',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'Ali Raza',
      specialty: 'Mathematics',
      rating: 4.8,
      reviews: 15,
      initials: 'AR',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 3,
      name: 'Sara Ahmad',
      specialty: 'Biology',
      rating: 4.9,
      reviews: 80,
      initials: 'SA',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const stats = [
    { label: 'Expert Mentors', value: 500, suffix: '+', icon: Users },
    { label: 'Learning Categories', value: 50, suffix: '+', icon: BookOpen },
    { label: 'Active Learners', value: 2000, suffix: '+', icon: TrendingUp },
    { label: 'Average Rating', value: 4.8, suffix: '/5', icon: Star },
  ];

  const categories = [
    'Web Development',
    'Computer Science',
    'UI/UX Design',
    'Business Strategy',
    'Programming',
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Experts',
      description: 'All mentors verified through rigorous testing and community reviews',
    },
    {
      icon: Zap,
      title: 'Real-time Learning',
      description: 'Live sessions and instant feedback to accelerate your growth',
    },
    {
      icon: TrendingUp,
      title: 'Measurable Progress',
      description: 'Track your learning journey with detailed analytics and insights',
    },
  ];

  const testimonials = [
    {
      name: 'Nusrat Nasr',
      role: 'HSC Student',
      quote: 'ShikkhaLink helped me improve from C to A in just 3 months. The mentors are incredibly patient and knowledgeable.',
      rating: 5,
      initials: 'NJ',
      color: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Afra',
      role: 'University Applicant',
      quote: 'I got accepted into my dream university thanks to the guidance I received. The structured sessions made all the difference.',
      rating: 5,
      initials: 'RA',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      name: 'Safiyat Sayma',
      role: 'Class 12 Science',
      quote: 'One-on-one sessions made complex Physics and Chemistry topics so much easier. My confidence skyrocketed before exams.',
      rating: 5,
      initials: 'AK',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Maimuna Tabassum',
      role: 'Class 10 Student',
      quote: 'I was struggling with Math for years. My ShikkhaLink mentor broke it down step by step and I finally scored above 90%.',
      rating: 5,
      initials: 'TR',
      color: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Nafia Nowshin',
      role: 'HSC Candidate',
      quote: 'The flexible scheduling meant I could learn after college hours. Best investment I made for my board exams.',
      rating: 4.5,
      initials: 'FA',
      color: 'from-violet-500 to-purple-500',
    },
    {
      name: 'Imran Hossain',
      role: 'Admission Test Prep',
      quote: 'Cracked the admission test on my first attempt. The practice strategies and mentor support were exactly what I needed.',
      rating: 5,
      initials: 'IH',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  // Carousel state
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardsPerView =
    windowWidth === null ? 1 : windowWidth >= 1024 ? 3 : windowWidth >= 768 ? 2 : 1;
  const maxIndex = Math.max(0, testimonials.length - cardsPerView);
  const slidePercent = 100 / cardsPerView;

  // Clamp index when viewport changes
  useEffect(() => {
    if (testimonialIndex > maxIndex) setTestimonialIndex(maxIndex);
  }, [maxIndex, testimonialIndex]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const prevTestimonial = () => setTestimonialIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const nextTestimonial = () => setTestimonialIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const dotCount = maxIndex + 1;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs with subtle animation */}
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Relative positioned content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/images/logo.png"
                  alt="ShikkaLink logo"
                  className="h-12 w-auto object-contain"
                />
              </motion.div>

              {/* Desktop Menuuuu */}
              <div className="hidden md:flex items-center gap-8">
                {['Find Mentors', 'Features', 'About', 'Pricing'].map((item) => (
                  <motion.a
                    key={item}
                    href={item === 'Find Mentors' ? '/find_tutor' : '#'}
                    className="text-sm text-muted-foreground hover:text-foreground transition relative block"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/50"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center gap-3">
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

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden pb-6 border-t border-border"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="space-y-3 pt-4">
                  {['Find Mentors', 'Features', 'About', 'Pricing'].map((item) => (
                    <motion.a
                      key={item}
                      href={item === 'Find Mentors' ? '/find_tutor' : '#'}
                      className="block text-muted-foreground hover:text-foreground py-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item}
                    </motion.a>
                  ))}
                  <div className="flex gap-2 pt-4">
                    <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-secondary" onClick={() => router.push('/auth/login')}>
                      Sign In
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-white" onClick={() => router.push('/auth/login')}>
                      Get Started
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <motion.div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            {/* Hero Badge */}
            <motion.div
              className="inline-block mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/40 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-primary font-medium">The future of online learning</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Learn from the{' '}
              <span className="bg-gradient-to-r from-primary via-primary to-cyan-400 bg-clip-text text-transparent">
                world's best mentors
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              Connect with verified experts and accelerate your growth. Real mentorship, real results, real community.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8 py-6 text-base rounded-lg group" onClick={() => router.push('/auth/login')}>
                  Start Learning
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base rounded-lg"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-cyan-400/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card border border-border rounded-xl p-4 backdrop-blur-sm group-hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Search className="text-muted-foreground" size={20} />
                    <input
                      type="text"
                      placeholder="Find a mentor in any field..."
                      className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20"
                    >
                      Search
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          className="py-16 md:py-20 border-t border-b border-border bg-gradient-to-b from-secondary to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    className="text-center group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="flex justify-center mb-4 p-3 rounded-lg bg-secondary w-fit mx-auto group-hover:bg-primary/15 transition-colors"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <Icon className="text-primary" size={24} />
                    </motion.div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {stat.value < 100 ? (
                        <>
                          <CountUp end={stat.value * 10} duration={2} />
                          {stat.suffix}
                        </>
                      ) : (
                        <>
                          <CountUp end={stat.value} duration={2} />
                          {stat.suffix}
                        </>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Why ShikkaLink
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to connect with mentors and achieve your goals
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    className="group p-8 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors hover:shadow-lg shadow-lg shadow-primary/5 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/15 to-cyan-400/10 flex items-center justify-center mb-6 group-hover:from-primary/25 group-hover:to-cyan-400/15 transition-colors"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                    >
                      <Icon className="text-primary" size={28} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Mentors Section */}
        <section className="py-16 md:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div className="inline-block mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/40">
                  <Star size={16} className="text-primary" />
                  <span className="text-sm text-primary font-medium">Top Mentors This Week</span>
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Learn from experts
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with top-rated mentors in your field of interest
              </p>
            </motion.div>

            {/* Mentors Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {topMentors.map((mentor, idx) => (
                <motion.div
                  key={mentor.id}
                  className="group bg-card border border-border rounded-xl p-8 hover:border-primary/40 hover:shadow-lg shadow-lg shadow-primary/5 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Avatar */}
                  <motion.div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${mentor.color} flex items-center justify-center text-white font-bold text-lg mb-6 group-hover:scale-110 transition-transform`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    {mentor.initials}
                  </motion.div>

                  {/* Info */}
                  <h3 className="text-xl font-semibold text-foreground mb-1">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{mentor.specialty}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.15 + i * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <Star
                          size={16}
                          className={i < Math.floor(mentor.rating) ? 'fill-primary text-primary' : 'text-border'}
                        />
                      </motion.div>
                    ))}
                    <span className="text-sm text-muted-foreground ml-3">
                      {mentor.rating} • {mentor.reviews} reviews
                    </span>
                  </div>

                  {/* CTA Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white group/btn shadow-lg shadow-primary/20">
                      Book a Session
                      <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Footer CTA */}
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="border-border text-foreground hover:bg-secondary px-6 rounded-lg group">
                  View Mentors
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 border-t border-border bg-gradient-to-b from-secondary/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div className="inline-block mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/40">
                  <Star size={16} className="text-primary fill-primary" />
                  <span className="text-sm text-primary font-medium">Success Stories</span>
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                What Students Say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real results from learners using ShikkhaLink to improve their academic performance.
              </p>
            </motion.div>

            {/* Carousel */}
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Track viewport */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.82,1)]"
                  style={{ transform: `translateX(-${testimonialIndex * slidePercent}%)` }}
                >
                  {testimonials.map((t, idx) => (
                    <div
                      key={idx}
                      className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                    >
                      <motion.div
                        className="group bg-card border border-border rounded-xl p-8 hover:border-primary/40 shadow-lg shadow-primary/5 hover:shadow-lg transition-all h-full flex flex-col"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ y: -6 }}
                      >
                        {/* Star rating */}
                        <div className="flex items-center gap-1 mb-5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.floor(t.rating) ? 'fill-primary text-primary' : i < t.rating ? 'fill-primary/50 text-primary' : 'text-border'}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2 font-medium">{t.rating}</span>
                        </div>

                        {/* Quote */}
                        <p className="text-foreground leading-relaxed mb-6 flex-1">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-5 border-t border-border">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}>
                            {t.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
              {dotCount > 1 && (
                <>
                  <motion.button
                    onClick={prevTestimonial}
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 shadow-md transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    onClick={nextTestimonial}
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 shadow-md transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </>
              )}
            </div>

            {/* Dot indicators */}
            {dotCount > 1 && (
              <motion.div
                className="flex justify-center gap-2 mt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {[...Array(dotCount)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === testimonialIndex
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-border hover:bg-muted-foreground/40'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden border-t border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-400/5 pointer-events-none" />
          <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to level up your skills?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners transforming their careers with ShikkaLink mentorship.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8 py-6 text-base rounded-lg group">
                  Explore Courses
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base rounded-lg"
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.footer
          className="border-t border-border py-16 md:py-20 bg-secondary/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="/images/logo.png"
                    alt="ShikkaLink logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <p className="text-muted-foreground text-sm">Connecting learners with expert mentors worldwide.</p>
              </motion.div>

              {/* Links */}
              {[
                {
                  title: 'Product',
                  links: ['Features', 'Pricing', 'Security', 'Roadmap'],
                },
                {
                  title: 'Company',
                  links: ['About', 'Blog', 'Careers', 'Contact'],
                },
                {
                  title: 'Resources',
                  links: ['Help Center', 'Community', 'API Docs', 'Status'],
                },
              ].map((column) => (
                <motion.div
                  key={column.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-foreground mb-4">{column.title}</h4>
                  <ul className="space-y-2">
                    {column.links.map((link) => (
                      <li key={link}>
                        <motion.a
                          href="#"
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          {link}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Footer Bottom */}
            <motion.div
              className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p>© 2024 ShikkaLink. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((social) => (
                  <motion.a key={social} href="#" className="hover:text-foreground transition-colors" whileHover={{ scale: 1.15 }}>
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
