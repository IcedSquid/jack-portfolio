"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  // ----------------------------------
  // LOAD PROJECTS ON PAGE LOAD
  // ----------------------------------
  useEffect(() => {
    async function loadProjects() {
      let query = supabase.from("projects").select("*");

      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      }

      if (sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading projects:", error);
      }

      setProjects(data || []);
    }

    loadProjects();
  }, [sortBy]);

  return (
    <div className="text-white p-10">
        <h1 className="text-4xl font-bold">All Projects</h1>

      <div className="flex justify-between items-center mb-10">
        {/* Left: Sort*/}
        <div className=" flex items-center gap-4">
        <span className="text-gray-300 text-sm">
          Sort
        </span>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-500 text-white focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

        {/* Right: New Project*/}
        <Link href="/admin/projects/new">
          <button className="relative group h-12 w-48 font-medium">
            {/* BACK LAYER */}
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#00D8FF]"></div>

            {/* FRONT BUTTON */}
            <div className="relative z-10 w-full h-full bg-black border-2 border-[#00D8FF] flex items-center justify-center hover:bg-[#11326E]">
              <span className="text-[#00D8FF] text-base">+ New Project</span>
            </div>
          </button>
        </Link>
      </div>

      <table className="w-full overflow-hidden">
        <thead className="bg-black text-gray-300">
          <tr>
            <th className="p-4 text-left">Thumbnail</th>
            <th className="p-4  pr-50 text-left">Title</th>
            <th className="p-1 text-left">Modify</th> {/* ✅ Only these three columns */}
          </tr>
        </thead>

        <tbody>
          {/* Empty State */}
          {projects.length === 0 && (
            <tr>
              <td colSpan="3" className="p-6 text-center text-gray-500">
                No projects uploaded yet.
              </td>
            </tr>
          )}

          {/* DISPLAY EACH PROJECT */}
          {projects.map((p) => (
            <tr
              key={p.id}
              className="border-t border-gray-800"
            >
              {/* THUMBNAIL */}
              <td className="p-4">
                {p.thumbnail_url ? (
                  <img
                    src={p.thumbnail_url}
                    className="w-26 h-26 object-cover"
                  />
                ) : (
                  <div className="w-24 h-20 bg-gray-700 rounded" />
                )}
              </td>

              {/* TITLE */}
              <td className="p-4">{p.title}</td>

              {/* EDIT BUTTON */}
              <td className="p-4">
                <Link href={`/admin/projects/${p.id}/edit`}>
                  <button className="px-4 py-1 border border-[#575757] text-white hover:bg-[#303030]">
                  • • •
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

