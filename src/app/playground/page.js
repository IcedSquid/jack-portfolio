import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import "../works/works.css"; // reuse the same styles

export default async function PlaygroundPage() {

  // 1. Fetch ONLY short-form projects, newest first
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("project_type", "short")
    .order("created_at", { ascending: false });

  return (
    <div className="works-page">
      <main className="works-content">
        <h1>Playground</h1>

        <div className="works-grid">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/playground/${project.id}`} // 👈 opens lightbox
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

