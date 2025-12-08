import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import "./works.css";

export default async function WorksPage() {

  // 1. Fetch ONLY long-form projects, newest first
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("project_type", "long")
    .order("created_at", { ascending: false });

  return (
    <div className="works-page">
      <main className="works-content">
        <h1>Works</h1>

        <div className="works-grid">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/works/${project.id}`}
              className="work-box"
              style={{
                backgroundImage: `url(${project.thumbnail_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: project.thumbnail_url ? "transparent" : "#555",
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

