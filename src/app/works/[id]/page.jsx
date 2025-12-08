import { createClient } from "@supabase/supabase-js";

// SERVER CLIENT – works inside Next.js server components
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProjectPage({ params }) {
    const id = (await params).id;  

  // 1. Fetch project row
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectErr || !project) {
    console.log(projectErr);
    return <div className="p-8 text-white">Project not found.</div>;
  }

  // 2. Fetch ordered list of images for this project
  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  return (
    <div className="text-white w-full">

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full bg-gray-700">
        {project.hero_url ? (
          <img
            src={project.hero_url}
            className="w-full object-cover"
            alt=""
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-600"></div>
        )}

        {/* Description in top-right */}
        <div className="absolute top-6 right-6 w-[260px] text-right text-white drop-shadow-lg">
          <p className="leading-tight">{project.description}</p>
        </div>

        {/* Title overlapping the hero */}
        <h1 className="absolute -bottom-10 left-6 text-5xl font-bold drop-shadow-lg">
          {project.title}
        </h1>
      </div>

      {/* Spacer so title doesn't cover images */}
      <div className="h-20"></div>

      {/* ---------------- IMAGE LIST SECTION ---------------- */}
      <div className="flex flex-col gap-12 w-full max-w-[1200px] mx-auto px-6 py-12">
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt=""
            className="w-full rounded-sm"
          />
        ))}
      </div>

    </div>
  );
}
