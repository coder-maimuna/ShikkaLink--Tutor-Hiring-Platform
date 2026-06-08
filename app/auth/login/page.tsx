'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
  };

  return (
    <div style={{ display: 'flex' }} className="auth-container">
      {/* Left Card - Auth Form */}
      <div className="auth-card1">
        {/* Logo */}
        <div style={{ width: 100 }} className="auth-navbar">
          <img style={{ width: '100%' }} src="/images/logo.png" alt="ShikkaLink Logo" />
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Welcome to ShikkaLink</h1>
          <p>Start your experience with ShikkaLink by signing in or signing up</p>
        </div>

        {/* Tab Buttons */}
        <div className="auth-buttons">
          <button
            className={activeTab === 'signin' ? 'active' : ''}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={activeTab === 'signup' ? 'active' : ''}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <div className="auth-form">
            <form onSubmit={handleSignIn}>
              <label htmlFor="email">
                Email Address <span className="auth-required">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="pass">
                Password <span className="auth-required">*</span>
              </label>
              <input
                type="password"
                id="pass"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-lg h-10 mt-3">
                Sign In
              </Button>

              {/* Or divider */}
              <div className="auth-or-divider">
                <span>or</span>
              </div>

              {/* Google Login */}
              <button type="button" className="auth-google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        )}

        {/* Sign Up - Role Selection */}
        {activeTab === 'signup' && (
          <div className="auth-signup" style={{ display: 'flex' }}>
            <h3>Choose Your Role</h3>

            <button
              className="auth-role-btn"
              onClick={() => router.push('/auth/student-register')}
            >
              <GraduationCap size={22} color="var(--primary)" />
              Create Account as a Student
            </button>

            <button
              className="auth-role-btn"
              onClick={() => router.push('/auth/teacher-register')}
            >
              <User size={22} color="var(--primary)" />
              Create Account as a Teacher
            </button>
          </div>
        )}

      </div>

      {/* Right Card - Images */}
      <div className="auth-card2">
        <div className="auth-images">
          <img src="/images/bt.jpg" className="auth-i1" alt="Online learning" />
          <img src="/images/calender (1).jpg" className="auth-i2" alt="Schedule" />
          <img src="/images/review.jpg" className="auth-i3" alt="Reviews" />
        </div>
        <div className="circle"></div>
        <div className="auth-caption">
          <img src="/images/logo.png" alt="ShikkaLink Logo" />
          <h3>Providing learning excellence</h3>
          <p>
            A platform bridging parents, tutors, and students for success
          </p>
        </div>
      </div>
    </div>
  );
}
