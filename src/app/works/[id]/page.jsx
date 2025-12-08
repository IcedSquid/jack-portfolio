import { supabase } from "@/lib/supabaseClient";

export default async function ProjectPage({ params }) {
  const { id } = params;

  // 1. Fetch project data
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  // 2. Fetch images for this project, ordered
  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", id)
    .order("order_index", { ascending: true });

  if (!project) {
    return <div className="p-8 text-white">Project not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
      <p className="text-lg text-gray-300 mb-10">{project.description}</p>

      <div className="space-y-10">
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt=""
            className="w-full rounded"
          />
        ))}
      </div>
    </div>
  );
}
