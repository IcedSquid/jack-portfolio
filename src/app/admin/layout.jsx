"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({ children }) {

  return (
    <div className="min-h-screen flex">

      {/* ⭐ SIDEBAR */}
      <aside
        className="w-60 border-r p-4"
        style={{
          backgroundColor: "#1d1d1d",
          color: "white",
          borderColor: "#333",
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
              window.location.href = "/login"; // uses browser redirect instead of router
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


