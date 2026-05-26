"use client";
// frontend/app/(auth)/login/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authAPI.login(
  formData.email,
  formData.password
) as any;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
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
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(0.5deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.95); opacity: 0.6; }
          70%  { transform: scale(1.05); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .a1 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.08s both; }
        .a2 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.17s both; }
        .a3 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.26s both; }
        .a4 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.35s both; }
        .a5 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.44s both; }
        .a6 { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) 0.53s both; }
        .float-1 { animation: floatY 5s ease-in-out infinite; }
        .float-2 { animation: floatY 7s ease-in-out 1.2s infinite; }
        .float-3 { animation: floatY 6s ease-in-out 2.5s infinite; }
        .shimmer-btn {
          background: linear-gradient(110deg, #111 40%, #d9342a 50%, #111 60%);
          background-size: 200% auto;
        }
        .shimmer-btn:hover:not(:disabled) {
          animation: shimmer 0.8s linear forwards;
        }
        .input-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .input-field:focus {
          background: white;
          border-color: #d9342a;
          box-shadow: 0 0 0 3px rgba(217,52,42,0.08);
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #1a1a1a !important;
        }
      `}</style>

      <div className="min-h-screen flex bg-white overflow-hidden">

        {/* ── LEFT PANEL — 40% (unchanged) ── */}
        <div className="hidden lg:flex lg:w-[40%] relative flex-col bg-[#0f0f0f] overflow-hidden">
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {/* Red glow accents */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #d9342a 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #d9342a 0%, transparent 70%)" }} />

          {/* Brand mark */}
          <div className="relative z-10 p-10 pb-0 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#d9342a] flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
            <span className="text-white text-base font-semibold tracking-tight">Yatrix</span>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10">
            <div className="w-8 h-0.5 bg-[#d9342a] mb-4 rounded-full" />
            <h2 className="text-white text-3xl font-light leading-snug tracking-tight mb-3">
              Your journey,<br />
              <span className="font-bold text-[#d9342a]">perfectly planned.</span>
            </h2>
            <p className="text-white/35 text-xs leading-relaxed">
              Curated destinations across India.<br />Plan smarter, travel better.
            </p>
          </div>

          {/* Stat strip */}
          <div className="relative z-10 border-t border-white/8 px-10 py-5 flex gap-8">
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

        {/* ── RIGHT PANEL — 60% ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-16 py-10 relative bg-[#fafafa]">

          {/* Very subtle red dot grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #d9342a 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          {/* Soft top-right glow */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.06] pointer-events-none rounded-full"
            style={{ background: "radial-gradient(circle, #d9342a 0%, transparent 70%)" }} />

          <div className="relative w-full max-w-[380px]">

            {/* Logo */}
            <div className="a1 flex justify-center mb-9">
              <Image
                src="/logo-yatrix.png"
                alt="Yatrix"
                width={340}
                height={100}
                priority
                className="h-20 w-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Heading */}
            <div className="a2 mb-6 text-center">
              <h1 className="text-2xl font-bold text-[#111] tracking-tight">
                Welcome back 👋
              </h1>
              <p className="text-xs text-[#aaa] mt-1.5 font-medium">
                Sign in to continue your journey
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="a2 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs mb-5 shadow-sm">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Card */}
            <div className="bg-white border border-[#ececec] rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.06)] px-8 pt-7 pb-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="a3">
                  <label className="block text-[10px] font-bold text-[#777] tracking-[0.14em] uppercase mb-2">
                    Email address
                  </label>
                  <div className="relative group">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d0d0d0] group-focus-within:text-[#d9342a] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
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
                <div className="a4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-bold text-[#777] tracking-[0.14em] uppercase">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-[10px] text-[#d9342a] hover:underline font-bold tracking-wide transition-opacity hover:opacity-80">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d0d0d0] group-focus-within:text-[#d9342a] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="input-field w-full border border-[#e8e8e8] bg-[#f9f9f9] rounded-xl pl-10 pr-11 py-3 text-sm text-[#111] placeholder:text-[#d0d0d0] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ccc] hover:text-[#888] transition-colors duration-150"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                          <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="a5 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="shimmer-btn w-full text-white py-3.5 rounded-xl text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group shadow-[0_4px_16px_rgba(217,52,42,0.25)]"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
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

              {/* Register */}
              <p className="a6 text-xs text-[#aaa] text-center">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#d9342a] font-bold hover:underline underline-offset-2 transition-opacity hover:opacity-80">
                  Create one free →
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className="a6 flex items-center justify-center gap-4 mt-5">
              <span className="flex items-center gap-1.5 text-[10px] text-[#c0c0c0] font-medium">
                <svg className="w-3 h-3 text-[#d9342a]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                SSL Secured
              </span>
              <span className="w-px h-3 bg-[#e8e8e8]" />
              <span className="flex items-center gap-1.5 text-[10px] text-[#c0c0c0] font-medium">
                <svg className="w-3 h-3 text-[#d9342a]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                Private by default
              </span>
              <span className="w-px h-3 bg-[#e8e8e8]" />
              <span className="flex items-center gap-1.5 text-[10px] text-[#c0c0c0] font-medium">
                <svg className="w-3 h-3 text-[#d9342a]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                No spam ever
              </span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}