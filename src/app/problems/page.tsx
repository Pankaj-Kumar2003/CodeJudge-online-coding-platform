import prisma from "@/lib/prisma";
import Link from "next/link";

async function getProblems() {
  return await prisma.problem.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProblemsDashboardPage() {
  const problems = await getProblems();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <header className="bg-gray-900/60 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-green-400">
            CodeJudge
          </span>
          <span className="text-gray-700">/</span>
          <h1 className="text-sm font-semibold text-gray-400">
            Dashboard Workspace
          </h1>
        </div>
        <Link
          href="/"
          className="text-xs font-bold text-gray-400 hover:text-white transition px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-md"
        >
          ← Home Portal
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Challenge Repository
          </h2>
          <p className="text-sm text-gray-400">
            Select a target matrix below to initialize your container testing
            workspace sandbox.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/40 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Problem Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6 text-right">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-sm font-medium">
              {/* Type definition explicitly updated to string to satisfy TypeScript */}
              {problems.map(
                (problem: {
                  id: string;
                  title: string;
                  category: string;
                  difficulty: string;
                }) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-gray-800/20 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-700 group-hover:border-gray-500 transition-colors" />
                    </td>

                    <td className="py-4 px-6 text-gray-200 group-hover:text-white font-semibold transition-colors">
                      {problem.title}
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-mono bg-gray-800/60 text-gray-400 border border-gray-700/50 px-2 py-0.5 rounded">
                        {problem.category || "Arrays"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold ${
                          problem.difficulty === "Easy"
                            ? "text-green-400"
                            : problem.difficulty === "Medium"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/problems/${problem.id}`}
                        className="inline-flex items-center text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded transition shadow-md"
                      >
                        Solve ➔
                      </Link>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {problems.length === 0 && (
            <div className="p-12 text-center text-gray-500 text-sm font-mono">
              ⚠️ No code execution problems found in database cluster.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
