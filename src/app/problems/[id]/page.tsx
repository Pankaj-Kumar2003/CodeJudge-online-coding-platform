import prisma from "@/lib/prisma";
import Link from "next/link";

// 1. Fetch data safely without calling non-existent columns like templates
async function getProblems() {
  return await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      description: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProblemsDashboardPage() {
  const problems = await getProblems();

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Coding Challenges
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Select a problem configuration from the repository matrix to begin
              compiling.
            </p>
          </div>
        </div>

        {problems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
            <p className="text-gray-500 font-mono text-sm">
              📭 No problem sets logged in database. Run &quot;npx prisma db
              seed&quot; to populate.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* 💡 FIX: Maps using String tracking IDs matching CUID configurations */}
            {problems.map(
              (prob: {
                id: string;
                title: string;
                difficulty: string;
                description: string;
              }) => (
                <div
                  key={prob.id}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all rounded-xl p-5 flex justify-between items-center group shadow-md"
                >
                  <div className="space-y-1 max-w-[70%]">
                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                      {prob.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-1 font-sans">
                      {prob.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        prob.difficulty === "Easy"
                          ? "bg-green-950/40 text-green-400 border border-green-900/50"
                          : prob.difficulty === "Medium"
                            ? "bg-yellow-950/40 text-yellow-400 border border-yellow-900/50"
                            : "bg-red-950/40 text-red-400 border border-red-900/50"
                      }`}
                    >
                      {prob.difficulty}
                    </span>

                    <Link
                      href={`/problems/${prob.id}`}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md"
                    >
                      Solve Problem
                    </Link>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
