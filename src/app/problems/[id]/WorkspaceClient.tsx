"use client";

import { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

interface WorkspaceClientProps {
  problemId: string;
  description: string;
  starterCode: Record<string, string>;
  testCases: Array<{ stdin: string; expectedOutput: string }>;
}

interface TestResult {
  case: number;
  status: string;
  passed: boolean;
  stdout?: string;
  compileError?: string;
}

interface SubmissionHistoryItem {
  id: string;
  status: string;
  language: string;
  runtime: number;
  memory: number;
  createdAt: string;
  code: string;
}

export default function WorkspaceClient({
  problemId,
  description,
  starterCode,
  testCases,
}: WorkspaceClientProps) {
  const languages = Object.keys(starterCode);
  const initialLang = languages[0] || "javascript";
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [userCode, setUserCode] = useState(
    () => starterCode[initialLang] || "",
  );

  // Execution States
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<
    TestResult[] | null
  >(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Panel Tabs Navigation Layout State
  const [activeTab, setActiveTab] = useState<
    "testcases" | "custom" | "history"
  >("testcases");
  const [customInput, setCustomInput] = useState("");

  // Historical Submission Data Log Lists
  const [historyItems, setHistoryItems] = useState<SubmissionHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Core data fetch function
  const fetchSubmissionHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(
        `/api/submissions/history?problemId=${problemId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setHistoryItems(data);
      }
    } catch (err) {
      console.error("Error connecting to history telemetry endpoints:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (starterCode[selectedLang]) {
      const t = setTimeout(() => {
        setUserCode(starterCode[selectedLang]);
        setSubmissionResults(null);
        setSubmissionError(null);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [selectedLang, starterCode]);

  // Handler for explicit navigation actions to avoid cascading useEffect calls
  const handleTabChange = (tab: "testcases" | "custom" | "history") => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchSubmissionHistory();
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setSubmissionError(null);
    setSubmissionResults(null);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          language: selectedLang,
          code: userCode,
          isRunOnly: true,
          customInput:
            activeTab === "custom" ? customInput : testCases[0]?.stdin || "",
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Sandbox code runtime execution exception.",
        );
      setSubmissionResults(data.results);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setSubmissionError(
        error.message || "An unexpected compile error occurred.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionResults(null);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          language: selectedLang,
          code: userCode,
          isRunOnly: false,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Execution failed.");
      setSubmissionResults(data.results);

      // Update history in background if the history tab is currently open
      if (activeTab === "history") {
        fetchSubmissionHistory();
      }
      alert("Submission saved successfully to historical database rows!");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setSubmissionError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex-1 flex overflow-hidden bg-gray-950">
      {/* LEFT PANEL: Description & Inputs/History logs wrapper context container */}
      <div className="w-1/2 flex flex-col border-r border-gray-800 bg-gray-950 h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3 text-gray-100">
              Problem Description
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-900/40 p-4 rounded-xl border border-gray-800/60">
              {description}
            </p>
          </div>

          <div className="border-t border-gray-800 flex bg-gray-900 sticky top-0 z-10 overflow-x-auto">
            <button
              onClick={() => handleTabChange("testcases")}
              className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === "testcases" ? "border-blue-500 text-blue-400 bg-gray-800/30" : "border-transparent text-gray-400 hover:text-gray-200"}`}
            >
              Sample Test Cases
            </button>
            <button
              onClick={() => handleTabChange("custom")}
              className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === "custom" ? "border-blue-500 text-blue-400 bg-gray-800/30" : "border-transparent text-gray-400 hover:text-gray-200"}`}
            >
              Custom Input
            </button>
            <button
              onClick={() => handleTabChange("history")}
              className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === "history" ? "border-blue-500 text-blue-400 bg-gray-800/30" : "border-transparent text-gray-400 hover:text-gray-200"}`}
            >
              🔄 Submissions History
            </button>
          </div>

          <div className="p-6">
            {activeTab === "testcases" && (
              <div className="space-y-4">
                {testCases.map((tc, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 font-mono text-sm shadow-md"
                  >
                    <div className="text-gray-400 font-semibold mb-1">
                      Case {index + 1} Input:
                    </div>
                    <div className="text-green-400 bg-black/40 p-3 rounded-lg mb-3 whitespace-pre-wrap border border-gray-800/40">
                      {tc.stdin}
                    </div>
                    <div className="text-gray-400 font-semibold mb-1">
                      Expected Output:
                    </div>
                    <div className="text-blue-400 bg-black/40 p-3 rounded-lg border border-gray-800/40">
                      {tc.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "custom" && (
              <div className="flex flex-col">
                <label className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">
                  Provide custom execution input arguments
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter input parameters here..."
                  className="w-full h-48 bg-black/40 text-gray-200 font-mono text-sm p-4 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 resize-none shadow-inner"
                />
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3 font-sans">
                {isLoadingHistory && (
                  <div className="text-center py-6 text-sm text-gray-400 animate-pulse font-mono">
                    ⏳ Synchronizing latest records with database cluster
                    storage...
                  </div>
                )}

                {!isLoadingHistory && historyItems.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500 font-mono bg-gray-900/40 rounded-xl border border-dashed border-gray-800">
                    📭 No historical attempts logged for this challenge profile
                    yet.
                  </div>
                )}

                {!isLoadingHistory &&
                  historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-900 border border-gray-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-gray-700 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-green-400 bg-green-950/30 border border-green-900/40 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                            {item.status}
                          </span>
                          <span className="text-xs font-mono font-semibold bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700 uppercase">
                            {item.language}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-6 text-xs text-gray-400 font-mono bg-black/30 p-2 rounded-lg border border-gray-800/40">
                        <div>
                          ⏱️ Time:{" "}
                          <span className="text-gray-200 font-bold">
                            {item.runtime} ms
                          </span>
                        </div>
                        <div>
                          💾 Memory:{" "}
                          <span className="text-gray-200 font-bold">
                            {((item.memory || 0) / 1024).toFixed(1)} MB
                          </span>
                        </div>
                      </div>

                      <details className="group border border-gray-800/60 rounded-lg overflow-hidden bg-black/10">
                        <summary className="cursor-pointer text-xs font-semibold text-gray-500 hover:text-gray-300 p-2 bg-gray-900/40 select-none outline-none flex justify-between items-center">
                          <span>View Saved Code Block Template</span>
                          <span className="text-[10px] group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </summary>
                        <pre className="p-3 text-xs font-mono text-gray-300 bg-gray-950/60 border-t border-gray-800/60 overflow-x-auto whitespace-pre">
                          {item.code}
                        </pre>
                      </details>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Code Editor Interface */}
      <div className="w-1/2 flex flex-col bg-[#1e1e1e] h-full overflow-hidden border-l border-gray-800">
        <div className="bg-gray-900 border-b border-gray-800 p-3 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-gray-800 text-gray-200 text-sm px-3 py-1.5 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono font-semibold"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0">
            <Editor
              height="100%"
              language={
                selectedLang === "cpp"
                  ? "cpp"
                  : selectedLang === "javascript"
                    ? "javascript"
                    : "python"
              }
              theme="vs-dark"
              value={userCode}
              onChange={(value) => setUserCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono), monospace",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                scrollBeyondLastColumn: 5,
              }}
            />
          </div>
        </div>

        {/* Console Terminal Display */}
        {(submissionResults ||
          submissionError ||
          isRunning ||
          isSubmitting) && (
          <div className="h-44 bg-black border-t border-gray-800 p-4 font-mono text-sm overflow-y-auto shrink-0 z-10 shadow-2xl">
            <div className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
              Console Terminal Output
            </div>
            {isRunning && (
              <div className="text-yellow-400 animate-pulse font-medium">
                ⚡ Running your solution against sample inputs...
              </div>
            )}
            {isSubmitting && (
              <div className="text-blue-400 animate-pulse font-medium">
                ⚙️ Queueing full evaluation matrix... Running all test cases...
              </div>
            )}

            {submissionError && (
              <div className="text-red-400 bg-red-950/20 border border-red-900/60 p-3 rounded-lg text-xs">
                ❌ {submissionError}
              </div>
            )}

            {submissionResults && (
              <div className="space-y-3">
                {submissionResults.map((res, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${res.passed ? "bg-green-950/10 border-green-900/30" : "bg-red-950/10 border-red-900/30"}`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-gray-400">
                        Test Instance {res.case}:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[11px] ${res.passed ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}
                      >
                        {res.status}
                      </span>
                    </div>
                    {res.stdout && (
                      <div className="text-xs text-gray-300 mt-2 bg-gray-900/80 p-2 rounded border border-gray-800">
                        <span className="text-gray-500 font-bold">Output:</span>{" "}
                        {res.stdout.trim()}
                      </div>
                    )}
                    {res.compileError && (
                      <pre className="text-xs text-red-400 bg-red-950/40 p-3 rounded-lg whitespace-pre-wrap mt-2 border border-red-900/40 font-mono">
                        {res.compileError}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Panel Footer */}
        <div className="bg-[#1a1a1a] border-t border-gray-800 px-4 py-3 flex justify-end items-center space-x-4 shrink-0 z-20">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 bg-[#2a2a2a] hover:bg-[#333] border border-gray-700 text-gray-200 font-semibold px-4 py-1.5 text-sm rounded-lg transition disabled:opacity-50"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-gray-400"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Run Code</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 bg-[#2cbb5d] hover:bg-[#229e4c] text-white font-bold px-5 py-1.5 text-sm rounded-lg transition disabled:opacity-50 shadow-md"
          >
            <svg
              className="w-4 h-4 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              <path d="M12 12v6m0-6l-3 3m3-3l3 3" />
            </svg>
            <span>Submit Solution</span>
          </button>
        </div>
      </div>
    </div>
  );
}
