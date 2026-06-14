"use client";
import { useState } from "react";

export default function ProblemWorkspace() {
  const [sourceCode, setSourceCode] = useState("");
  const [languageId, setLanguageId] = useState(71);
  const [verdict, setVerdict] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const snippets: { [key: number]: string } = {
    71: `# Write your Python solution here\nimport sys\n\ndef main():\n    # Test inputs: nums = [2, 7, 11, 15], target = 9\n    print([0, 1])\n\nif __name__ == "__main__":\n    main()`,
    54: `// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Test inputs match expectation string\n    cout << "[0, 1]" << endl;\n    return 0;\n}`,
  };

  const handleLanguageChange = (id: number) => {
    setLanguageId(id);
    setSourceCode(snippets[id] || "");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setVerdict("RUNNING...");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: sourceCode,
          languageId: languageId,
        }),
      });

      const data = await response.json();
      setVerdict(data.verdict || "ERROR");
    } catch (error) {
      console.error("Submission failed:", error); // Fixed: 'error' is now used here!
      setVerdict("FAILED TO CONNECT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4 font-sans">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Two Sum</h1>

        <div className="flex items-center space-x-2">
          <label className="font-semibold text-gray-600 text-sm">
            Language:
          </label>
          <select
            value={languageId}
            onChange={(e) => handleLanguageChange(Number(e.target.value))}
            className="p-2 border rounded-md bg-white shadow-sm font-medium text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={71}>Python 3 (ID: 71)</option>
            <option value={54}>C++ (GCC 9.2.0 - ID: 54)</option>
          </select>
        </div>
      </div>

      <textarea
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        className="w-full h-72 p-4 border rounded-md font-mono bg-gray-50 text-black text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !sourceCode}
          className={`px-6 py-2.5 rounded-md font-bold text-white shadow-md transition-all ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
        >
          {isLoading ? "Running Sandbox..." : "Submit Code"}
        </button>
      </div>

      {/* Fixed: Removed the conflicting 'rounded-md' class from this line */}
      <div className="p-4 border bg-gray-900 text-white font-mono rounded-lg shadow-md">
        <p className="text-xs text-gray-400 tracking-wider uppercase">
          Sandbox Evaluation Output
        </p>
        <p
          className={`text-xl font-bold mt-2 ${
            verdict === "ACCEPTED"
              ? "text-green-400"
              : verdict === "RUNNING..."
                ? "text-yellow-400"
                : "text-red-400"
          }`}
        >
          Verdict: {verdict || "IDLE (Awaiting Submission)"}
        </p>
      </div>
    </div>
  );
}
