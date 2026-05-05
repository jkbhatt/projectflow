import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">ProjectFlow</h1>
        <p className="text-gray-400 text-lg mb-8">
          Manage your projects and tasks efficiently
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}