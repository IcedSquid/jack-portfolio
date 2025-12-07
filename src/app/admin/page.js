"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OffsetButton from "@/components/ui/offsetbutton";

// shadcn ui components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminPage() {
  console.log("SUPABASE URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("SUPABASE KEY =", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // ---- AUTH CHECK ----
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
        fetchProjects();
      }
    }
    checkUser();
  }, [router]);

  // ---- FETCH PROJECT LIST ----
  async function fetchProjects() {
    const { data, error } = await supabase.from("projects").select(`
      id, title, thumbnail, created_at
    `);

    if (!error) setProjects(data);
  }

  if (loading) return <div>Checking auth...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Projects</h2>

        <OffsetButton
          className="w-48" // adjust width if needed
          onClick={() => router.push("/admin/projects/new")}
        >
          + New Project
        </OffsetButton>
      </div>

      {/* PROJECT TABLE */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <p className="py-4 text-center text-gray-500">
                    No projects uploaded yet.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </TableCell>

                <TableCell>{p.title}</TableCell>
                <TableCell>
                  {new Date(p.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/admin/edit/${p.id}`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

  