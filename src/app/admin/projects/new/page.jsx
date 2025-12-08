// src/app/admin/projects/new/page.jsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [projectType, setProjectType] = useState("long");
  const [thumbnail, setThumbnail] = useState(null);

  function onFilesChange(e) {
    setFiles(Array.from(e.target.files));
  }

  function onDragEnd(result) {
    if (!result.destination) return;

    const newFiles = Array.from(files);
    const [moved] = newFiles.splice(result.source.index, 1);
    newFiles.splice(result.destination.index, 0, moved);

    setFiles(newFiles);
  }

  function onThumbnailChange(e) {
    setThumbnail(e.target.files[0]);
  }
  
  async function uploadFile(file) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from("portfolio-images").upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(data.path);
    return urlData.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      console.log("AUTH USER:", authData);

      const thumbnailUrl = await uploadFile(thumbnail);

      // Upload Hero Image
      let heroUrl = null;
      if (heroImage) {
        heroUrl = await uploadFile(heroImage);
      }
      // 1) create project row
      const { data: pData, error: insertError } = await supabase
        .from("projects")
        .insert([{ title, description,
          project_type: projectType,
          thumbnail_url: thumbnailUrl,
          hero_image_url: heroUrl,
         }])
        .select()
        .single();
      if (insertError) throw insertError;
      const projectId = pData.id;

      // 2) upload images and insert rows
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        uploadedUrls.push({ project_id: projectId, image_url: url, order_index: i });
      }

      if (uploadedUrls.length) {
        const { error: imagesErr } = await supabase.from("project_images").insert(uploadedUrls);
        if (imagesErr) throw imagesErr;
      }

      alert("Project created");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full bg-[#1d1d1d] p-6"
         style={{ backgroundColor: "transparent", color: "white" }}>
      <h1 className="text-3xl font-bold mb-6">New Project</h1>
  
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TITLE */}
        <div>
          <label className="block text-sm mb-1 text-white">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-none bg-transparent border border-[#888888] text-white placeholder-gray-400"
            required
          />
        </div>
  
        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm mb-1 text-white">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-none bg-transparent border border-[#888888] text-white placeholder-gray-400"
            rows={5}
          />
        </div>
  
        {/* PROJECT TYPE SELECTOR */}
        <div>
          <label className="block text-sm mb-2 text-white">Project Type</label>

        <div className="flex gap-4 text-white">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="long"
              checked={projectType === "long"}
              onChange={() => setProjectType("long")}
            />
            <span>Long Form (goes in /works)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="short"
              checked={projectType === "short"}
              onChange={() => setProjectType("short")}
            />
            <span>Short Form (goes in /playground)</span>
          </label>
        </div>
      </div>


        {/* THUMBNAIL UPLOAD */}
        <div>
          <label className="block text-sm mb-1 text-white">Thumbnail (required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={onThumbnailChange}
            className="text-white"
            required
          />

          {thumbnail && (
            <div className="mt-2 text-sm text-gray-300">
              {thumbnail.name}
            </div>
           )}
          </div>

        {/* HERO IMAGE UPLOAD */}
          <div>
            <label className="block text-sm mb-1 text-white">Hero Image (Full Width)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImage(e.target.files[0])}
                className="text-white"
              />

              {heroImage && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(heroImage)}
                    className="w-full h-40 object-cover rounded"
                  />
              </div>
            )}
          </div>

        {/* FILE UPLOAD */}
        <div>
          <label className="block text-sm mb-1 text-white">Images (multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFilesChange}
            className="text-white"
          />
         {files.length > 0 && (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="images">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {files.map((file, i) => (
            <Draggable key={file.name} draggableId={file.name} index={i}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="relative bg-[#2a2a2a] p-2 rounded"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-xs text-gray-400 mt-1">{file.name}</p>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
)}


        </div>
  
        {/* PUBLISH BUTTON — custom offset style */}
        <div>
          <button
            type="submit"
            disabled={uploading}
            className="relative group h-12 w-48 font-medium"
          >
            {/* BACK LAYER */}
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#6ECFF6]"></div>
  
            {/* FRONT BUTTON */}
            <div className="relative z-10 w-full h-full bg-[#1D1D1D] border-2 border-[#6ECFF6] flex items-center justify-center">
              <span className="text-[#6ECFF6] text-base">
                {uploading ? "Uploading..." : "Publish"}
              </span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
