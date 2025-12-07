// src/app/admin/projects/new/page.jsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  function onFilesChange(e) {
    setFiles(Array.from(e.target.files));
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
      // 1) create project row
      const { data: pData, error: insertError } = await supabase.from("projects").insert([{ title, description }]).select().single();
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
            <div className="mt-2 text-sm text-gray-300">
              {files.length} files selected
            </div>
          )}
        </div>
  
        {/* CREATE BUTTON — custom offset style */}
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
                {uploading ? "Uploading..." : "Create Project"}
              </span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
