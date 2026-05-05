"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Trash2, Calendar, Pencil, X, Check, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
}

const columns = [
  { id: "todo", label: "📋 Todo", color: "border-gray-600" },
  { id: "in-progress", label: "🔄 In Progress", color: "border-blue-500" },
  { id: "done", label: "✅ Done", color: "border-green-500" },
];

const priorityColors: Record<string, string> = {
  low: "bg-gray-700 text-gray-300",
  medium: "bg-yellow-900 text-yellow-400",
  high: "bg-red-900 text-red-400",
};

const getDueDateInfo = (dueDate: string | null) => {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: "Overdue!", color: "text-red-400" };
  if (diffDays === 0) return { label: "Due Today!", color: "text-yellow-400" };
  if (diffDays === 1) return { label: "Due Tomorrow", color: "text-orange-400" };
  return {
    label: new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    color: "text-gray-400",
  };
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", dueDate: "" });

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  // Edit state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", priority: "medium", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res: any = await api.get(`/projects/${id}/tasks`);
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchTasks();
  }, [id, authLoading]);

  const handleCreate = async () => {
    if (!form.title) return toast.error("Title is required");
    setCreating(true);
    try {
      await api.post(`/projects/${id}/tasks`, form);
      toast.success("Task created!");
      setForm({ title: "", description: "", priority: "medium", dueDate: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await api.patch(`/projects/${id}/tasks/${taskId}`, { status });
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      toast.success("Task deleted!");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    });
  };

  const handleEditSave = async () => {
    if (!editingTask) return;
    if (!editForm.title) return toast.error("Title is required");
    setSaving(true);
    try {
      await api.put(`/projects/${id}/tasks/${editingTask._id}`, editForm);
      toast.success("Task updated!");
      setEditingTask(null);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Filter tasks by search + priority
  const getFilteredTasks = (status: string) => {
    return tasks.filter((t) => {
      const matchesStatus = t.status === status;
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = filterPriority === "all" || t.priority === filterPriority;
      return matchesStatus && matchesSearch && matchesPriority;
    });
  };

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Project Board</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your tasks</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2.5 flex-1">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white outline-none w-full text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-gray-900 text-white rounded-lg px-4 py-2.5 outline-none text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>

          {(search || filterPriority !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilterPriority("all"); }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-4 py-2.5 rounded-lg text-sm transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Create Task Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">New Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <div className="flex gap-4">
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-3">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="bg-transparent text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Task"}
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

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Edit Task</h3>
                <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <div className="flex gap-4">
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-3">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="bg-transparent text-white outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleEditSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                  >
                    <Check size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        {loading ? (
          <div className="text-gray-400 text-center mt-20">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.id} className={`bg-gray-900 rounded-2xl p-5 border-t-4 ${col.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{col.label}</h3>
                  <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
                    {getFilteredTasks(col.id).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {getFilteredTasks(col.id).length === 0 ? (
                    <p className="text-gray-600 text-sm text-center py-6">
                      {search || filterPriority !== "all" ? "No matching tasks" : "No tasks here"}
                    </p>
                  ) : (
                    getFilteredTasks(col.id).map((task) => {
                      const dueDateInfo = getDueDateInfo(task.dueDate);
                      return (
                        <div key={task._id} className="bg-gray-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <p className="text-white text-sm font-medium">{task.title}</p>
                            <div className="flex items-center gap-2 ml-2">
                              <button
                                onClick={() => handleEditOpen(task)}
                                className="text-gray-500 hover:text-blue-400 transition"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="text-gray-500 hover:text-red-500 transition"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-gray-400 text-xs">{task.description}</p>
                          )}

                          {dueDateInfo && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className={dueDateInfo.color} />
                              <span className={`text-xs font-medium ${dueDateInfo.color}`}>
                                {dueDateInfo.label}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              className="bg-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1 outline-none"
                            >
                              <option value="todo">Todo</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
