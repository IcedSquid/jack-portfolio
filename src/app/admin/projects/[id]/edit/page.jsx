"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("long");

  // Thumbnail / Hero
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  const [heroImage, setHeroImage] = useState(null);
  const [existingHero, setExistingHero] = useState(null);

  // Gallery Images
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // 1️⃣ LOAD PROJECT DATA
  // ---------------------------------------------------
  useEffect(() => {
    async function loadProject() {
      const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (project) {
        setTitle(project.title);
        setDescription(project.description);
        setProjectType(project.project_type);
        setExistingThumbnail(project.thumbnail_url);
        setExistingHero(project.hero_image_url);
      }

      const { data: imgs } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index");

      setExistingImages(imgs || []);
      setLoading(false);
    }

    loadProject();
  }, [projectId]);

  // ---------------------------------------------------
  // Handlers
  // ---------------------------------------------------
  function onFilesChange(e) {
    setFiles(Array.from(e.target.files));
  }

  function onThumbnailChange(e) {
    setThumbnail(e.target.files[0]);
  }

  function onHeroChange(e) {
    setHeroImage(e.target.files[0]);
  }

  function onDragEnd(result) {
    if (!result.destination) return;

    const arr = Array.from(existingImages);
    const [moved] = arr.splice(result.source.index, 1);
    arr.splice(result.destination.index, 0, moved);

    setExistingImages(arr);
  }

  async function uploadFile(file) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
  
    const { data, error } = await supabase.storage
      .from("portfolio-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) throw error;
  
    const { data: urlData } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(data.path);
  
    return urlData.publicUrl;
  }
    

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      console.log("Updating project:", projectId);
      
      // 1) Upload thumbnail if replaced
      let thumbnailUrl = existingThumbnail;
      if (thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail);
      }
  
      // 2) Upload hero image if replaced
      let heroUrl = existingHero;
      if (heroImage) {
        heroUrl = await uploadFile(heroImage);
      }
  
      // 3) Update the project row
      const { error: updateErr } = await supabase
        .from("projects")
        .update({
          title,
          description,
          project_type: projectType,
          thumbnail_url: thumbnailUrl,
          hero_image_url: heroUrl,
        })
        .eq("id", projectId);
  
      if (updateErr) throw updateErr;
  
      // 4) Re-save order_index of existing images
      const reordered = existingImages.map((img, index) => ({
        id: img.id,
        order_index: index,
      }));
  
      for (const item of reordered) {
        await supabase
          .from("project_images")
          .update({ order_index: item.order_index })
          .eq("id", item.id);
      }
  
      // 5) Upload NEW images (if any)
      if (files.length > 0) {
        const newUploads = [];
  
        for (let i = 0; i < files.length; i++) {
          const url = await uploadFile(files[i]);
          newUploads.push({
            project_id: projectId,
            image_url: url,
            order_index: existingImages.length + i,
          });
        }
  
        const { error: insertErr } = await supabase
          .from("project_images")
          .insert(newUploads);
  
        if (insertErr) throw insertErr;
      }
  
      alert("Project updated!");
      router.push("/admin");
  
    } catch (err) {
      console.error(err);
      alert("Error updating project: " + err.message);
    }
  }

  // ---------------------------------------------------
  // 2️⃣ DELETE FUNCTION (ADDED)
  // ---------------------------------------------------
  async function handleDelete() {
    const yes = window.confirm("Delete this project? This cannot be undone.");
    if (!yes) return;

    try {
      // Delete images first
      await supabase.from("project_images").delete().eq("project_id", projectId);

      // Delete the project row
      await supabase.from("projects").delete().eq("id", projectId);

      alert("Project deleted.");
      router.push("/admin");

    } catch (err) {
      console.error(err);
      alert("Error deleting: " + err.message);
    }
  }

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  // ---------------------------------------------------
  // 🧱 UI (MATCHES NEW PROJECT PAGE)
  // ---------------------------------------------------
  return (
    <div className="w-full bg-[#1d1d1d] p-6"
      style={{ backgroundColor: "transparent", color: "white" }}
    >
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="block text-sm mb-1 text-white">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-none bg-transparent border border-[#888888] text-white"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm mb-1 text-white">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-none bg-transparent border border-[#888888] text-white"
            rows={5}
          />
        </div>

        {/* PROJECT TYPE */}
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
              <span>Long Form (in /works)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="short"
                checked={projectType === "short"}
                onChange={() => setProjectType("short")}
              />
              <span>Short Form (in /playground)</span>
            </label>
          </div>
        </div>

        {/* THUMBNAIL */}
        <div>
          <label className="block text-sm mb-1 text-white">Thumbnail</label>
          <input type="file" accept="image/*" onChange={onThumbnailChange} className="text-white" />

          {existingThumbnail && !thumbnail && (
            <img src={existingThumbnail} className="w-32 mt-2 rounded" />
          )}
          {thumbnail && <div className="mt-2">{thumbnail.name}</div>}
        </div>

        {/* HERO */}
        <div>
          <label className="block text-sm mb-1 text-white">Hero Image</label>
          <input type="file" accept="image/*" onChange={onHeroChange} className="text-white" />

          {existingHero && !heroImage && (
            <img src={existingHero} className="w-full h-40 object-cover rounded mt-2" />
          )}
          {heroImage && (
            <img src={URL.createObjectURL(heroImage)} className="w-full h-40 object-cover rounded mt-2" />
          )}
        </div>

        {/* EXISTING + NEW IMAGES */}
        <div>
          <label className="block text-sm mb-1 text-white">Images</label>

          {/* Upload more */}
          <input type="file" multiple accept="image/*" onChange={onFilesChange} className="text-white" />

          {/* Existing images with drag-drop */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="existing-images">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {existingImages.map((img, i) => (
                    <Draggable draggableId={img.id.toString()} index={i} key={img.id}>
                      {(p) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className="relative bg-[#2a2a2a] p-2 rounded"
                        >
                          <img src={img.image_url} className="w-full h-32 object-cover rounded" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* NEWLY ADDED IMAGES PREVIEW */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file, i) => (
                <div key={i} className="bg-[#2a2a2a] p-2 rounded">
                  <img src={URL.createObjectURL(file)} className="w-full h-32 object-cover rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

          {/* SAVE + DELETE BUTTONS SIDE BY SIDE */}
            <div className="flex gap-6 mt-6">

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="relative group h-12 w-48 font-medium"
            >
              <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#6ECFF6]"></div>

              <div className="relative z-10 w-full h-full bg-[#1D1D1D] border-2 border-[#6ECFF6] flex items-center justify-center hover:bg-[#11326E]">
                <span className="text-[#6ECFF6] text-base">
                  Save Changes
                </span>
              </div>
            </button>

            {/* DELETE BUTTON */}
            <button
              type="button"
              onClick={handleDelete}
              className="relative group h-12 w-48 font-medium"
            >
              <div className="relative z-10 w-full h-full bg-[#1D1D1D] border-2 border-[#1D1D1D] flex items-center justify-center hover:border-[#FF4242]">
                <span className="text-red-400 text-base">
                  Delete Project
                </span>
              </div>
            </button>
          </div>
      </form>
    </div>
  );
}

