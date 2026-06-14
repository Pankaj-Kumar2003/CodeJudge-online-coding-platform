"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProblemPage() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State Layout variables
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");

  // Default clean syntax configurations for the code blocks
  const [cppCode, setCppCode] = useState(
    "class Solution {\npublic:\n    // write code here\n};",
  );
  const [pythonCode, setPythonCode] = useState(
    "class Solution:\n    def solve(self):\n        pass",
  );
  const [jsCode, setJsCode] = useState("var solve = function() {\n    \n};");

  // Sample default test case template matrix row
  const [testCases, setTestCases] = useState([
    { stdin: "[1,2,3]\n4", expectedOutput: "[0,0]" },
  ]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { stdin: "", expectedOutput: "" }]);
  };

  const handleTestCaseChange = (
    index: number,
    key: "stdin" | "expectedOutput",
    value: string,
  ) => {
    const updated = [...testCases];
    updated[index][key] = value;
    setTestCases(updated);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length === 1) return;
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmitProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setErrorMsg(null);

    const fullPayload = {
      title,
      difficulty,
      description,
      starterCode: {
        cpp: cppCode,
        python: pythonCode,
        javascript: jsCode,
      },
      testCases,
    };

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || "Failed to persist code problem metadata.",
        );

      // Success! Head right back out to the updated code core challenges dashboard
      router.push("/problems");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected operational tracking error occurred.";
      setErrorMsg(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <header className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create Challenge Profile
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Deploy an algorithmic challenge problem directly onto your
              platform.
            </p>
          </div>
          <Link
            href="/problems"
            className="text-xs text-gray-500 hover:text-white transition"
          >
            ← Abort & Return
          </Link>
        </header>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900 rounded-lg text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitProblem} className="space-y-6">
          {/* Metadata Rows */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2">
                Challenge Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Reverse Integer"
                className="bg-black/40 border border-gray-800 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2">
                Difficulty Scale
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-black/40 border border-gray-800 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-medium h-\[46px\]"
              >
                <option value="Easy">EASY</option>
                <option value="Medium">MEDIUM</option>
                <option value="Hard">HARD</option>
              </select>
            </div>
          </div>

          {/* Description Block */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2">
              Problem Rule Specifications & Constraints
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the algorithm challenge requirements cleanly here..."
              className="bg-black/40 border border-gray-800 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono resize-none"
            />
          </div>

          {/* Boilerplate Code Block Submenus */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
              Multi-Language Execution Starter Boilerplates
            </h2>
            <div className="space-y-4 bg-black/20 p-4 border border-gray-800 rounded-xl">
              <div className="flex flex-col">
                <label className="text-xs font-mono text-blue-400 mb-1">
                  C++ (Clang Core Compiler Structure)
                </label>
                <textarea
                  required
                  value={cppCode}
                  onChange={(e) => setCppCode(e.target.value)}
                  rows={3}
                  className="bg-black/60 border border-gray-800 p-3 rounded-lg text-xs font-mono text-gray-300 focus:outline-none resize-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-mono text-yellow-500 mb-1">
                  Python (3.x Virtualized Container Block)
                </label>
                <textarea
                  required
                  value={pythonCode}
                  onChange={(e) => setPythonCode(e.target.value)}
                  rows={3}
                  className="bg-black/60 border border-gray-800 p-3 rounded-lg text-xs font-mono text-gray-300 focus:outline-none resize-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-mono text-green-400 mb-1">
                  JavaScript (V8 Run Engine Standard)
                </label>
                <textarea
                  required
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  rows={3}
                  className="bg-black/60 border border-gray-800 p-3 rounded-lg text-xs font-mono text-gray-300 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Test Case Grid Generator */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Evaluation Test Cases
              </h2>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold font-mono"
              >
                + Add Custom IO Case
              </button>
            </div>
            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-center bg-black/40 p-3 border border-gray-800 rounded-xl relative group"
                >
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 mb-1">
                      Stdin (Input arguments)
                    </span>
                    <input
                      type="text"
                      required
                      value={tc.stdin}
                      onChange={(e) =>
                        handleTestCaseChange(idx, "stdin", e.target.value)
                      }
                      placeholder="e.g., [2,7]\n9"
                      className="bg-black border border-gray-800 p-2 rounded text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 mb-1">
                      Expected Output
                    </span>
                    <input
                      type="text"
                      required
                      value={tc.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(
                          idx,
                          "expectedOutput",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., [0,1]"
                      className="bg-black border border-gray-800 p-2 rounded text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(idx)}
                      className="text-red-500 hover:text-red-400 text-xs font-bold font-mono pt-4 px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Deploy Bar */}
          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={isPublishing}
              className="bg-green-700 hover:bg-green-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition disabled:bg-green-900 shadow-md"
            >
              {isPublishing
                ? "Syncing Clusters..."
                : "🚀 Publish Challenge to Core Engine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
