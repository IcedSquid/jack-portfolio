"use client";

import "@/styles/globals.css"; // ensure tailwind import
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }
    check();
  }, [router]);

  if (loading) return <div className="p-8 text-white">Checking auth...</div>;

  return (
    <div className="min-h-screen flex">

      {/* ⭐ SIDEBAR (dark background, white text) */}
      <aside
        className="w-60 border-r p-4"
        style={{
          backgroundColor: "#1d1d1d",
          color: "white",
          borderColor: "#333", // optional subtle border
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-white">Howdy</h2>

        <nav className="flex flex-col gap-2">
          <Link
            className="px-3 py-2 text-white hover:bg-[#00CCFF] hover:text-black transition-colors"
            href="/admin"
          >
            Dashboard
          </Link>

          <Link
            className="px-3 py-2 text-white hover:bg-[#00CCFF] hover:text-black transition-colors"
            href="/admin/projects/new"
          >
            New Project
          </Link>
        </nav>

        <div className="mt-6">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="w-full text-left px-3 py-2 rounded bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ⭐ MAIN DASHBOARD AREA */}
      <main
        className="flex-1 p-6"
        style={{
          backgroundColor: "#1d1d1d",
          color: "white",
        }}
      >
        {children}
      </main>
    </div>
  );
}

