import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Clickable Logo routing to Home */}
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-xl font-extrabold text-white tracking-tight">
          Code<span className="text-blue-500">Judge</span>
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        <Link
          href="/problems"
          className="text-sm font-medium text-gray-400 hover:text-white transition"
        >
          Problems
        </Link>

        {/* Profile Section Placeholder */}
        <Link
          href="/profile"
          className="flex items-center space-x-2 cursor-pointer bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <span className="text-sm font-medium text-gray-300">amit</span>
        </Link>
      </div>
    </nav>
  );
}
