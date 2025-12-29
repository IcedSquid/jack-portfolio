import { createClient } from "@supabase/supabase-js";
import FloatingNavControls from "@/app/components/FloatingNavControls";

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
      <div className="relative w-full h-[450px] bg-gray-700 overflow-hidden">

            {/* HERO IMAGE */}
                {project.hero_image_url && (
                <img
                    src={project.hero_image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                )}

                {/* DESCRIPTION (upper right) */}
                <div className="absolute top-18 right-17 text-lg max-w-sm text-white drop-shadow-lg">
                {project.description}
                </div>

                {/* TITLE (lower left) */}
                <h1 className="absolute bottom-10 left-20 text-7xl font-bold leading-none drop-shadow-lg">
                {project.title}
                </h1>
                </div>



            {/* Spacer so title doesn't cover images */}
            <div className="h-10"></div>

            {/* ---------------- IMAGE LIST SECTION ---------------- */}
            <div className="flex flex-col gap-5 w-full max-w-[1300px] mx-auto px-6 py-12">
                {images?.map((img) => (
                <img
                    key={img.id}
                    src={img.image_url}
                    alt=""
                    className="w-full"
                />
                ))}
            </div>
            <FloatingNavControls showBack={true} showTop={true} />

    </div>
  );
}
