"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authAPI } from "@/lib/api";
import {
  Mail, Lock, LockKeyhole, Eye, EyeOff,
  User, ArrowRight, Loader2, AlertCircle,
  ShieldCheck, SearchX, BadgeCheck,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    if (name === "password") checkStrength(value);
  };

  const checkStrength = (v: string) => {
    let score = 0;
    if (v.length >= 6) score++;
    if (v.length >= 10) score++;
    if (/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    setStrength(score);
  };

  const strengthMeta = [
    { label: "", color: "bg-gray-200" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-green-500" },
    { label: "Strong", color: "bg-teal-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.register(
        formData.name,
        formData.email,
        formData.password
      ) as { token: string; user: unknown };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .a1 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.08s both; }
        .a2 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.17s both; }
        .a3 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.26s both; }
        .a4 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.35s both; }
        .a5 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.44s both; }
        .a6 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.53s both; }
        .a7 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.62s both; }
        .shimmer-btn {
          background: linear-gradient(110deg, #111 40%, #d9342a 50%, #111 60%);
          background-size: 200% auto;
        }
        .shimmer-btn:hover:not(:disabled) { animation: shimmer 0.8s linear forwards; }
        .input-field { transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease; }
        .input-field:focus {
          background: white !important;
          border-color: #d9342a !important;
          box-shadow: 0 0 0 3px rgba(217,52,42,0.08);
          outline: none;
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #1a1a1a !important;
        }
      `}</style>

      <div className="min-h-screen flex bg-white overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex lg:w-[40%] relative flex-col bg-[#0f0f0f] overflow-hidden">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          {/* Glows */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #d9342a 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #d9342a 0%, transparent 70%)" }} />

          {/* Brand */}
          <div className="relative z-10 p-10 pb-0 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#d9342a] flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
            <span className="text-white text-base font-semibold tracking-tight">Yatrix</span>
          </div>

          {/* Copy */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
            <div className="w-8 h-0.5 bg-[#d9342a] mb-4 rounded-full" />
            <h2 className="text-white text-3xl font-light leading-snug tracking-tight mb-3">
              Your journey,<br />
              <span className="font-bold text-[#d9342a]">perfectly planned.</span>
            </h2>
            <p className="text-white/35 text-xs leading-relaxed">
              Curated destinations across India.<br />Plan smarter, travel better.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {[
                "AI-generated itineraries in seconds",
                "Handpicked stays & experiences",
                "Budget-smart trip planning",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#d9342a]/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d9342a]" />
                  </div>
                  <span className="text-white/50 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 border-t border-white/[0.08] px-10 py-5 flex gap-8">
            {[
              { value: "500+", label: "Spots" },
              { value: "10k+", label: "Travellers" },
              { value: "4.9★", label: "Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-base font-bold">{s.value}</p>
                <p className="text-white/30 text-[10px] tracking-widest uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-16 py-10 relative bg-[#fafafa]">

          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #d9342a 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          {/* Glow */}
          <div
            className="absolute top-0 right-0 w-80 h-80 opacity-[0.06] pointer-events-none rounded-full"
            style={{ background: "radial-gradient(circle, #d9342a 0%, transparent 70%)" }}
          />

          <div className="relative w-full max-w-[400px]">

            {/* Logo */}
            <div className="a1 flex justify-center mb-8">
              <Image
                src="/logo-yatrix.png"
                alt="Yatrix"
                width={340}
                height={100}
                priority
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Heading */}
            <div className="a2 mb-6 text-center">
              <h1 className="text-2xl font-bold text-[#111] tracking-tight">Create your account</h1>
              <p className="text-xs text-[#aaa] mt-1.5 font-medium">Join thousands planning smarter trips</p>
            </div>

            {/* Error */}
            {error && (
              <div className="a2 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs mb-5">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Card */}
            <div className="bg-white border border-[#ececec] rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.06)] px-8 pt-7 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name */}
                <div className="a3">
                  <label className="block text-[10px] font-bold text-[#777] tracking-[0.14em] uppercase mb-2">
                    Full name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d0d0d0] group-focus-within:text-[#d9342a] transition-colors duration-200" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="input-field w-full border border-[#e8e8e8] bg-[#f9f9f9] rounded-xl pl-10 pr-4 py-3 text-sm text-[#111] placeholder:text-[#d0d0d0] outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="a4">
                  <label className="block text-[10px] font-bold text-[#777] tracking-[0.14em] uppercase mb-2">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d0d0d0] group-focus-within:text-[#d9342a] transition-colors duration-200" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="input-field w-full border border-[#e8e8e8] bg-[#f9f9f9] rounded-xl pl-10 pr-4 py-3 text-sm text-[#111] placeholder:text-[#d0d0d0] outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="a5">
                  <label className="block text-[10px] font-bold text-[#777] tracking-[0.14em] uppercase mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d0d0d0] group-focus-within:text-[#d9342a] transition-colors duration-200" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      required
                      className="input-field w-full border border-[#e8e8e8] bg-[#f9f9f9] rounded-xl pl-10 pr-11 py-3 text-sm text-[#111] placeholder:text-[#d0d0d0] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#888] transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bars */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength ? strengthMeta[strength].color : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {strength > 0 && (
                        <p className="text-[10px] font-medium" style={{ color: ["","#e24b4a","#d97706","#16a34a","#0d9488"][strength] }}>
                          {strengthMeta[strength].label}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="a6">
                  <label className="block text-[10px] font-bold text-[#777] tracking-[0.14em] uppercase mb-2">
                    Confirm password
                  </label>
                  <div className="relative group">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d0d0d0] group-focus-within:text-[#d9342a] transition-colors duration-200" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      required
                      className="input-field w-full border border-[#e8e8e8] bg-[#f9f9f9] rounded-xl pl-10 pr-11 py-3 text-sm text-[#111] placeholder:text-[#d0d0d0] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#888] transition-colors"
                    >
                      {showConfirm
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="a7 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="shimmer-btn w-full text-white py-3.5 rounded-xl text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group shadow-[0_4px_16px_rgba(217,52,42,0.25)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#f0f0f0]" />
                <span className="text-[10px] text-[#d0d0d0] tracking-[0.15em] uppercase font-medium">or</span>
                <div className="flex-1 h-px bg-[#f0f0f0]" />
              </div>

              {/* Sign in link */}
              <p className="text-xs text-[#aaa] text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-[#d9342a] font-bold hover:underline underline-offset-2 transition-opacity hover:opacity-80">
                  Sign in →
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-5">
              {[
                { icon: ShieldCheck, label: "SSL Secured" },
                { icon: SearchX, label: "Private by default" },
                { icon: BadgeCheck, label: "No spam ever" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex items-center gap-4">
                  {i !== 0 && <span className="w-px h-3 bg-[#e8e8e8]" />}
                  <span className="flex items-center gap-1.5 text-[10px] text-[#c0c0c0] font-medium">
                    <Icon className="w-3 h-3 text-[#d9342a]" />
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}