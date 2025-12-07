// src/app/admin/projects/[id]/edit/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // [{id, image_url, order_index}]
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    setLoading(true);
    // fetch project and its images
    const { data: project } = await supabase.from("projects").select("id,title,description,created_at, project_images(id,image_url,order_index)").eq("id", projectId).single();
    setTitle(project.title || "");
    setDescription(project.description || "");
    setImages((project.project_images || []).sort((a,b)=>a.order_index - b.order_index));
    setLoading(false);
  }

  async function handleUploadNewFiles() {
    const uploaded = [];
    for (let i=0;i<newFiles.length;i++){
      const file = newFiles[i];
      const ext = file.name.split(".").pop();
      const fname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from("portfolio-images").upload(fname, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(data.path);
      uploaded.push({ project_id: projectId, image_url: urlData.publicUrl, order_index: images.length + i });
    }
    if (uploaded.length) {
      const { error } = await supabase.from("project_images").insert(uploaded);
      if (error) throw error;
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await supabase.from("projects").update({ title, description }).eq("id", projectId);
      if (newFiles.length) {
        await handleUploadNewFiles();
        setNewFiles([]);
      }
      // refresh
      await fetchProject();
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteImage(imgId) {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("project_images").delete().eq("id", imgId);
    if (error) alert("Delete error: " + error.message);
    else fetchProject();
  }

  async function moveImage(imgId, direction) {
    // direction: -1 (up) or +1 (down)
    const idx = images.findIndex(i=>i.id === imgId);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    // swap order_index in DB
    const A = images[idx];
    const B = images[targetIdx];

    await supabase.from("project_images").update({ order_index: B.order_index }).eq("id", A.id);
    await supabase.from("project_images").update({ order_index: A.order_index }).eq("id", B.id);

    await fetchProject();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Project</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 block w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-1 block w-full border p-2 rounded" rows={4} />
        </div>

        <div>
          <label className="block text-sm">Existing Images</label>
          <div className="space-y-2 mt-2">
            {images.map((img, i) => (
              <div key={img.id} className="flex items-center gap-3">
                <img src={img.image_url} alt="" className="w-28 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-sm text-gray-700">Index: {img.order_index}</div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={()=>moveImage(img.id, -1)} className="px-2 py-1 bg-gray-100 rounded">Up</button>
                    <button type="button" onClick={()=>moveImage(img.id, 1)} className="px-2 py-1 bg-gray-100 rounded">Down</button>
                    <button type="button" onClick={()=>handleDeleteImage(img.id)} className="px-2 py-1 bg-red-100 text-red-600 rounded">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm">Add More Images</label>
          <input type="file" multiple accept="image/*" onChange={(e)=>setNewFiles(Array.from(e.target.files))} className="mt-1" />
          {newFiles.length > 0 && <div className="text-sm text-gray-600 mt-1">{newFiles.length} files ready to upload</div>}
        </div>

        <div>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
