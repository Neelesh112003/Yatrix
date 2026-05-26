"use client";
// frontend/app/(dashboard)/layout.tsx
// Protects all dashboard pages — redirects to /login if no token

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
    // No need to set state; just redirect if not authenticated
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}