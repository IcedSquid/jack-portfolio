"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function ShortProjectLightbox() {
  const router = useRouter();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      const { data: imgs } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", id)
        .order("order_index");

      setProject(proj);
      setImages(imgs);
    }

    load();
  }, [id]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* CLICK OUTSIDE TO CLOSE */}
      <div
        className="absolute inset-0"
        onClick={() => router.back()}
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl w-full p-6 space-y-6">

        {/* CLOSE BUTTON */}
        <button
          className="absolute top-4 right-4 text-white text-3xl"
          onClick={() => router.back()}
        >
          ✕
        </button>

        {/* OPTIONAL TITLE */}
        <h1 className="text-2xl font-bold">{project.title}</h1>

        {/* GALLERY */}
        <div className="space-y-4">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              className="w-full rounded-lg"
            />
          ))}
        </div>

        {/* OPTIONAL DESCRIPTION */}
        <p className="text-gray-300 text-sm">
          {project.description}
        </p>
      </div>
    </div>
  );
}
