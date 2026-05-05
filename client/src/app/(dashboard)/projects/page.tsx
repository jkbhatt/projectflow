"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  // ✅ ALL hooks at the top - no conditions before them
  const { loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const res: any = await api.get("/projects");
      setProjects(res.data);
    } catch {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchProjects();
  }, [authLoading]);

  const handleCreate = async () => {
    if (!form.name) return toast.error("Project name is required");
    setCreating(true);
    try {
      await api.post("/projects", form);
      toast.success("Project created!");
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted!");
      fetchProjects();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ✅ Conditions AFTER all hooks
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-950 items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-gray-400 text-sm mt-1">Manage all your projects</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Create New Project</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-center mt-20">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">No projects yet!</p>
            <p className="text-gray-600 text-sm mt-2">Click "New Project" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-900 rounded-2xl p-6 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <a
                    href={`/projects/${project._id}`}
                    className="text-white font-semibold text-lg hover:text-blue-400 transition"
                  >
                    {project.name}
                  </a>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-gray-600 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-gray-400 text-sm flex-1">
                  {project.description || "No description"}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      project.status === "active"
                        ? "bg-green-900 text-green-400"
                        : project.status === "completed"
                        ? "bg-blue-900 text-blue-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
