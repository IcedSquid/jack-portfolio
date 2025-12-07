"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin"); // redirect to admin page
    }
  }

  return (
    <div className="flex flex-col items-center mt-32 text-white">
      <h1 className="text-3xl mb-6">Admin Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-transparent border border-[#00CCFF]/70 text-[#00CCFF] placeholder-gray-300"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-transparent border border-[#00CCFF]/70 text-[#00CCFF] placeholder-gray-300"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="relative group w-full h-14 font-medium"
        >
          {/* BACK LAYER (shadow square) */}
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#0051E7]"></div>

          {/* FRONT BUTTON */}
          <div className="relative z-10 w-full h-full bg-[#00CCFF] border-2 border-[#00CCFF] flex items-center justify-center">
            <span className="text-black text-lg transition-transform">
      Log In
    </span>
  </div>
</button>

      </form>
    </div>
  );
}
