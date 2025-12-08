import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function WorksPage() {
  // 1. Fetch ONLY long-form projects
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("project_type", "long")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-8 text-white">Error loading works.</div>;
  }

  return (
    <div className="text-white px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">Works</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects?.map((proj) => (
          <Link 
            key={proj.id} 
            href={`/works/${proj.id}`}
            className="block group"
          >
            <div className="w-full aspect-square bg-gray-600">
              {proj.thumbnail_url ? (
                <img
                  src={proj.thumbnail_url}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                />
              ) : (
                // Placeholder box
                <div className="w-full h-full bg-gray-700"></div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
