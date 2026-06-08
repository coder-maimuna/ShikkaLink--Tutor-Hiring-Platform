'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../auth.css';

export default function StudentRegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [fullname, setFullname] = useState('');
  const [school, setSchool] = useState('');
  const [cls, setCls] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCpass] = useState('');
  const [passErr, setPassErr] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarSrc(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr('');

    if (pass !== cpass) {
      setPassErr('Passwords do not match');
      return;
    }

    // TODO: Implement actual registration API call
    setSubmitted(true);
  };

  return (
    <div className="reg-body">
      <div className="reg-card">
        {/* Logo */}
        <div className="reg-logo">
          <img src="/images/logo.png" alt="ShikkaLink" />
        </div>

        <button className="reg-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </button>

        <h2>Create a student account</h2>
        <p className="reg-subtitle">Fill in your details to get started</p>

        {/* Photo Upload */}
        <div className="reg-photo-wrap">
          <div
            className="reg-avatar"
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload photo"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="Student photo" className="show" />
            ) : (
              <div className="reg-avatar-placeholder">
                <Camera size={24} color="var(--primary)" />
                <span>Add photo</span>
              </div>
            )}
          </div>
          <p className="reg-photo-hint">Click to upload student photo</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* Personal Info */}
        <div className="reg-sec-label">Personal info</div>

        <form onSubmit={handleSubmit}>
          <div className="reg-field">
            <label htmlFor="fullname">
              Full name <span className="reg-req">*</span>
            </label>
            <input
              type="text"
              id="fullname"
              placeholder="Rahim Uddin"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div className="reg-field">
            <label htmlFor="school">
              School / Institution <span className="reg-req">*</span>
            </label>
            <input
              type="text"
              id="school"
              placeholder="International Islamic University Ctg"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </div>

          <div className="reg-grid2">
            <div className="reg-field">
              <label htmlFor="cls">
                Class <span className="reg-req">*</span>
              </label>
              <select
                id="cls"
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div className="reg-field">
              <label htmlFor="phone">
                Phone <span className="reg-req">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="01813123123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="reg-field">
            <label htmlFor="email">
              Email <span className="reg-req">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="sayma@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="reg-grid2">
            <div className="reg-field">
              <label htmlFor="pass">
                Password <span className="reg-req">*</span>
              </label>
              <input
                type="password"
                id="pass"
                placeholder="••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="reg-field">
              <label htmlFor="cpass">
                Confirm password <span className="reg-req">*</span>
              </label>
              <input
                type="password"
                id="cpass"
                placeholder="••••••"
                value={cpass}
                onChange={(e) => setCpass(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>
          <p className="reg-err-msg">{passErr}</p>

          {!submitted && (
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 mt-4 rounded-lg">
              Create account
            </Button>
          )}

          {submitted && (
            <div className="reg-success-msg show">
              <CheckCircle size={22} color="var(--primary)" />
              Account created successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
