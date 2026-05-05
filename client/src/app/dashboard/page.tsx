"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";
import { FolderKanban, CheckSquare, Clock, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    tasksDone: 0,
    tasksInProgress: 0,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await api.get("/projects");
        const projectList = res.data;
        setProjects(projectList);

        // Count tasks across all projects
        let done = 0;
        let inProgress = 0;

        for (const project of projectList) {
          const taskRes: any = await api.get(`/projects/${project._id}/tasks`);
          const tasks = taskRes.data;
          done += tasks.filter((t: any) => t.status === "done").length;
          inProgress += tasks.filter((t: any) => t.status === "in-progress").length;
        }

        setStats({
          totalProjects: projectList.length,
          tasksDone: done,
          tasksInProgress: inProgress,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "bg-blue-600",
    },
    {
      label: "Tasks Done",
      value: stats.tasksDone,
      icon: CheckSquare,
      color: "bg-green-600",
    },
    {
      label: "In Progress",
      value: stats.tasksInProgress,
      icon: Clock,
      color: "bg-yellow-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Toaster position="top-right" />
      <Sidebar />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400 mb-8">Welcome back! Here's your overview.</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-gray-900 rounded-2xl p-6 flex items-center gap-4"
              >
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-white text-2xl font-bold">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">Recent Projects</h3>
            <Link
              href="/projects"
              className="text-blue-400 text-sm hover:underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No projects yet!</p>
              <Link
                href="/projects"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition w-fit mx-auto"
              >
                <Plus size={16} />
                Create First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 w-2 h-2 rounded-full" />
                    <span className="text-white font-medium">{project.name}</span>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      project.status === "active"
                        ? "bg-green-900 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}