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

  //Api call to login
  const handleSignIn = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    alert("Login successful");

    if (data.user.role === "student") {
      router.push("/student-dashboard");
    } else if (data.user.role === "tutor") {
      router.push("/teacher-dashboard");
    } else {
      router.push("/admin-dashboard");
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    alert(message);
  }
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
