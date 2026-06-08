'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ArrowLeft, CheckCircle, User, GraduationCap, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../auth.css';

export default function TeacherRegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [subject, setSubject] = useState('');
  const [passingyear, setPassingyear] = useState('');
  const [result, setResult] = useState('');
  const [totalexp, setTotalexp] = useState('');
  const [preferredClasses, setPreferredClasses] = useState<string[]>([]);
  const [teachingMedium, setTeachingMedium] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
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

  const toggleClass = (value: string) => {
    setPreferredClasses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleMedium = (value: string) => {
    setTeachingMedium((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
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
      <div className="reg-card teacher">
        {/* Logo */}
        <div className="reg-logo">
          <img src="/images/logo.png" alt="ShikkaLink" />
        </div>

        <button className="reg-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={16} />
        </button>

        <h2>Create a teacher account</h2>
        <p className="reg-subtitle">Fill in your details to get started</p>

        {/* Photo Upload */}
        <div className="reg-photo-wrap">
          <div
            className="reg-avatar"
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload photo"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="Teacher photo" className="show" />
            ) : (
              <div className="reg-avatar-placeholder">
                <Camera size={24} color="var(--primary)" />
                <span>Add photo</span>
              </div>
            )}
          </div>
          <p className="reg-photo-hint">Click to upload your photo</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="reg-sec-label">
            <User size={12} color="var(--primary)" /> Personal info
          </div>

          <div className="reg-field">
            <label htmlFor="fullname">
              Full name <span className="reg-req">*</span>
            </label>
            <input
              type="text"
              id="fullname"
              placeholder="Karim Hossain"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div className="reg-grid2">
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
            <div className="reg-field">
              <label htmlFor="email">
                Email <span className="reg-req">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="karim@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="reg-field">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              placeholder="Dhaka, Bangladesh"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Education Background */}
          <div className="reg-sec-label">
            <GraduationCap size={12} color="var(--primary)" /> Education background
          </div>

          <div className="reg-field">
            <label htmlFor="degree">
              Highest degree <span className="reg-req">*</span>
            </label>
            <select
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
            >
              <option value="" disabled>
                Select degree
              </option>
              <option>SSC</option>
              <option>HSC</option>
              <option>Bachelor's</option>
              <option>Master's</option>
              <option>PhD</option>
            </select>
          </div>

          <div className="reg-grid2">
            <div className="reg-field">
              <label htmlFor="institution">
                Institution <span className="reg-req">*</span>
              </label>
              <input
                type="text"
                id="institution"
                placeholder="Dhaka University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
            </div>
            <div className="reg-field">
              <label htmlFor="subject">
                Major subject <span className="reg-req">*</span>
              </label>
              <input
                type="text"
                id="subject"
                placeholder="Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="reg-grid2">
            <div className="reg-field">
              <label htmlFor="passingyear">
                Passing year <span className="reg-req">*</span>
              </label>
              <input
                type="number"
                id="passingyear"
                placeholder="2018"
                min="1980"
                max="2025"
                value={passingyear}
                onChange={(e) => setPassingyear(e.target.value)}
                required
              />
            </div>
            <div className="reg-field">
              <label htmlFor="result">Result / CGPA</label>
              <input
                type="text"
                id="result"
                placeholder="3.85 / 4.00"
                value={result}
                onChange={(e) => setResult(e.target.value)}
              />
            </div>
          </div>

          <div className="reg-field" style={{ marginTop: 10 }}>
            <label htmlFor="totalexp">
              Total years of experience <span className="reg-req">*</span>
            </label>
            <select
              id="totalexp"
              value={totalexp}
              onChange={(e) => setTotalexp(e.target.value)}
              required
            >
              <option value="" disabled>
                Select
              </option>
              <option>Less than 1 year</option>
              <option>1 - 2 years</option>
              <option>3 - 5 years</option>
              <option>5 - 10 years</option>
              <option>10+ years</option>
            </select>
          </div>

          {/* Student Preference */}
          <div className="reg-sec-label">
            <Users size={12} color="var(--primary)" /> Student preference
          </div>

          <div className="reg-field">
            <label>Preferred class <span className="reg-req">*</span></label>
            <div className="reg-check-group">
              {['6', '7', '8', '9', '10', '11', '12'].map((cls) => (
                <label
                  key={cls}
                  className={`reg-check-item ${preferredClasses.includes(cls) ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    value={cls}
                    checked={preferredClasses.includes(cls)}
                    onChange={() => toggleClass(cls)}
                  />
                  Class {cls}
                </label>
              ))}
            </div>
          </div>

          <div className="reg-field" style={{ marginTop: 10 }}>
            <label>Teaching medium <span className="reg-req">*</span></label>
            <div className="reg-check-group">
              {['Bangla', 'English', 'Madrasa'].map((medium) => (
                <label
                  key={medium}
                  className={`reg-check-item ${teachingMedium.includes(medium) ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    value={medium}
                    checked={teachingMedium.includes(medium)}
                    onChange={() => toggleMedium(medium)}
                  />
                  {medium} medium
                </label>
              ))}
            </div>
          </div>

          <div className="reg-grid2" style={{ marginTop: 10 }}>
            <div className="reg-field">
              <label htmlFor="location">Preferred location</label>
              <input
                type="text"
                id="location"
                placeholder="Mirpur, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="reg-field">
            <label htmlFor="about">About yourself</label>
            <textarea
              id="about"
              placeholder="Write a short bio about your teaching style, strengths..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          {/* Account */}
          <div className="reg-sec-label">
            <Lock size={12} color="var(--primary)" /> Account
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
              <CheckCircle size={28} color="var(--primary)" />
              Teacher account created successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
