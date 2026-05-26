"use client";
// frontend/components/Navbar.tsx

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-[#d9342a]">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center shrink-0 -my-2">
          <Image
            src="/logo-yatrix.png"
            alt="Yatrix"
            width={340}
            height={100}
            priority
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl text-[#1a1a1a] hover:bg-black/5 transition-all duration-200 tracking-wide font-medium"
          >
            Home
          </Link>

          <Link
            href="/my-trips"
            className="px-4 py-2.5 rounded-xl text-[#1a1a1a] hover:bg-black/5 transition-all duration-200 tracking-wide font-medium"
          >
            My Trips
          </Link>

          <span className="w-px h-4 bg-black/10 mx-2" />

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#d9342a]/15 bg-white text-sm font-semibold text-[#d9342a] hover:bg-[#d9342a]/5 hover:border-[#d9342a]/30 transition-all duration-200 active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}