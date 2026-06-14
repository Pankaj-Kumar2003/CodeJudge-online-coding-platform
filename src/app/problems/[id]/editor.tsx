"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface EditorClientProps {
  problemId: string;
  initialCode: string;
}

interface TestCaseResult {
  status: string;
  passed: boolean;
  stdout?: string;
  stderr?: string;
  expected?: string;
}

export default function EditorClient({
  problemId,
  initialCode,
}: EditorClientProps) {
  // Leverage the authentic LeetCode template format as our default base text
  const defaultCppTemplate = `class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        \n    }\n};`;

  const [code, setCode] = useState(initialCode || defaultCppTemplate);
  const [languageId, setLanguageId] = useState(54); // Default to C++
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);

  const [activeTab, setActiveTab] = useState<"cases" | "results">("cases");
  // Track which unique test case row profile the user is actively inspecting in the results view
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);

  const [customStdin, setCustomStdin] = useState("[2,0,2,1,1,0]");
  const [customExpected, setCustomExpected] = useState("[0,0,1,1,2,2]");

  const getMonacoLanguageString = (id: number) => {
    if (id === 71) return "python";
    if (id === 54) return "cpp";
    return "javascript";
  };

  // 🚀 UPDATED: Clean LeetCode-style boilerplate structures across all runtimes
  const handleLanguageChange = (id: number) => {
    setLanguageId(id);
    if (id === 71) {
      setCode(
        `class Solution:\n    def sortColors(self, nums: List[int]) -> None:\n        """\n        Do not return anything, modify nums in-place instead.\n        """\n        pass`,
      );
    } else if (id === 54) {
      setCode(defaultCppTemplate);
    } else {
      setCode(
        `/**\n * @param {number[]} nums\n * @return {void} Do not return anything, modify nums in-place instead.\n */\nvar sortColors = function(nums) {\n    \n};`,
      );
    }
  };

  const executeSandbox = async (submitMode: boolean) => {
    setLoading(true);
    setGlobalError(null);
    setTestResults([]);
    setSelectedCaseIdx(0); // Reset focal case row pointer
    setActiveTab("results");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          code,
          languageId,
          customStdin: customStdin.trim() !== "" ? customStdin : undefined,
          customExpectedOutput: !submitMode ? customExpected.trim() : undefined,
          isSubmit: submitMode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResults(data.results || []);
      } else {
        setGlobalError(data.error || "Execution error failed.");
      }
    } catch {
      setGlobalError("System connection error reaching sandbox cluster.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        background: "#1e1e1e",
      }}
    >
      {/* HEADER DROPDOWN */}
      <div
        style={{
          padding: "10px 20px",
          background: "#2d2d2d",
          borderBottom: "1px solid #3c3c3c",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", color: "#aaa", fontWeight: "bold" }}>
          PRO PRODUCTION COMPILER
        </span>
        <select
          value={languageId}
          onChange={(e) => handleLanguageChange(Number(e.target.value))}
          style={{
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #555",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value={54}>C++ (GCC 9.2.0)</option>
          <option value={63}>JavaScript (Node.js)</option>
          <option value={71}>Python (3.8.1)</option>
        </select>
      </div>

      {/* VS-CODE POWERED MONACO ENGINE CONTAINER */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          background: "#1e1e1e",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid #3c3c3c",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <Editor
            height="100%"
            theme="vs-dark"
            language={getMonacoLanguageString(languageId)}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              fontFamily: "monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              cursorBlinking: "smooth",
              formatOnPaste: true,
            }}
          />
        </div>
      </div>

      {/* ACTION TAB SWITCHER SECTION */}
      <div
        style={{
          display: "flex",
          background: "#2d2d2d",
          borderTop: "1px solid #3c3c3c",
          padding: "0 10px",
        }}
      >
        <button
          onClick={() => setActiveTab("cases")}
          style={{
            background: activeTab === "cases" ? "#1e1e1e" : "transparent",
            color: activeTab === "cases" ? "#fff" : "#858585",
            border: "none",
            padding: "10px 15px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Test Cases (Edit Input)
        </button>
        <button
          onClick={() => setActiveTab("results")}
          style={{
            background: activeTab === "results" ? "#1e1e1e" : "transparent",
            color: activeTab === "results" ? "#fff" : "#858585",
            border: "none",
            padding: "10px 15px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Execution Output Logs ({testResults.length}){" "}
          {testResults.length > 0 && "📊"}
        </button>
      </div>

      {/* INTERACTIVE EXTENDED DISPLAY DRAWER */}
      <div
        style={{
          height: "240px",
          overflowY: "auto",
          padding: "15px 20px",
          background: "#111",
          fontFamily: "monospace",
        }}
      >
        {activeTab === "cases" ? (
          <div style={{ display: "flex", gap: "15px", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "#858585",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                CUSTOM PLAYGROUND INPUT (STDIN)
              </label>
              <textarea
                value={customStdin}
                onChange={(e) => setCustomStdin(e.target.value)}
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  padding: "8px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "#858585",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                EXPECTED OUTPUT TARGET (STDOUT)
              </label>
              <textarea
                value={customExpected}
                onChange={(e) => setCustomExpected(e.target.value)}
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  padding: "8px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            {globalError && (
              <div style={{ color: "#f44336", fontSize: "14px" }}>
                ❌ {globalError}
              </div>
            )}
            {testResults.length === 0 && !globalError && (
              <div style={{ color: "#555", fontSize: "13px" }}>
                No executions found. Click Run Code or Submit below.
              </div>
            )}

            {testResults.length > 0 && (
              <div>
                {/* 📊 LEETCODE-STYLE HORIZONTAL TEST CASE NAVIGATION SELECTION LIST */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "15px",
                    borderBottom: "1px solid #2d2d2d",
                    paddingBottom: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {testResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCaseIdx(idx)}
                      style={{
                        background:
                          selectedCaseIdx === idx ? "#2d2d2d" : "#1a1a1a",
                        color: res.passed ? "#4caf50" : "#ff5555",
                        border:
                          selectedCaseIdx === idx
                            ? "1px solid #555"
                            : "1px solid #333",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{res.passed ? "●" : "▲"}</span>
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* 🎯 INSPECTION DETAIL BOX FOR THE SELECTED CASE ROW CARD */}
                {testResults[selectedCaseIdx] && (
                  <div style={{ fontSize: "13px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          background: testResults[selectedCaseIdx].passed
                            ? "#1e4620"
                            : "#5a1a1a",
                          color: testResults[selectedCaseIdx].passed
                            ? "#4caf50"
                            : "#ff5555",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: "11px",
                        }}
                      >
                        {testResults[selectedCaseIdx].passed
                          ? "✓ PASSED"
                          : `✗ ${testResults[selectedCaseIdx].status.toUpperCase()}`}
                      </span>
                      <span style={{ color: "#858585" }}>
                        Detailed runtime profile for Test Case Validation
                        Pipeline #{selectedCaseIdx + 1}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "15px" }}>
                      <div
                        style={{
                          flex: 1,
                          background: "#1a1a1a",
                          padding: "10px 14px",
                          borderRadius: "4px",
                          border: "1px solid #2d2d2d",
                        }}
                      >
                        <span
                          style={{
                            color: "#777",
                            fontSize: "11px",
                            display: "block",
                            marginBottom: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          Your Program Received Output:
                        </span>
                        <span
                          style={{
                            color: testResults[selectedCaseIdx].passed
                              ? "#9cdcfe"
                              : "#ff8888",
                          }}
                        >
                          {testResults[selectedCaseIdx].stdout ||
                            "(( Empty String / No Output ))"}
                        </span>
                      </div>

                      {/* Render expected answer profile parameters dynamically if passed by endpoint array metadata */}
                      {testResults[selectedCaseIdx].expected ? (
                        <div
                          style={{
                            flex: 1,
                            background: "#1a1a1a",
                            padding: "10px 14px",
                            borderRadius: "4px",
                            border: "1px solid #2d2d2d",
                          }}
                        >
                          <span
                            style={{
                              color: "#777",
                              fontSize: "11px",
                              display: "block",
                              marginBottom: "4px",
                              fontWeight: "bold",
                            }}
                          >
                            Target Expected Base Answer:
                          </span>
                          <span style={{ color: "#4caf50" }}>
                            {testResults[selectedCaseIdx].expected}
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            flex: 1,
                            background: "#1a1a1a",
                            padding: "10px 14px",
                            borderRadius: "4px",
                            border: "1px solid #2d2d2d",
                          }}
                        >
                          <span
                            style={{
                              color: "#777",
                              fontSize: "11px",
                              display: "block",
                              marginBottom: "4px",
                              fontWeight: "bold",
                            }}
                          >
                            Target Expected Base Answer:
                          </span>
                          <span
                            style={{ color: "#858585", fontStyle: "italic" }}
                          >
                            Hidden Sandbox Variable Profile
                          </span>
                        </div>
                      )}
                    </div>

                    {testResults[selectedCaseIdx].stderr && (
                      <div
                        style={{
                          background: "#2a1515",
                          padding: "12px",
                          borderRadius: "4px",
                          marginTop: "12px",
                          color: "#ff8888",
                          border: "1px solid #5a1a1a",
                        }}
                      >
                        <span
                          style={{
                            color: "#ff5555",
                            fontSize: "11px",
                            display: "block",
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                        >
                          Compilation Sandbox Terminal Trace:
                        </span>
                        {testResults[selectedCaseIdx].stderr}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER ACTION BUTTONS */}
      <div
        style={{
          padding: "15px 20px",
          background: "#2d2d2d",
          borderTop: "1px solid #3c3c3c",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <button
          onClick={() => executeSandbox(false)}
          disabled={loading}
          style={{
            background: "transparent",
            color: "#aaa",
            border: "1px solid #555",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Run Code
        </button>
        <button
          onClick={() => executeSandbox(true)}
          disabled={loading}
          style={{
            background: loading ? "#555" : "#137333",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Submit Solution ➔"}
        </button>
      </div>
    </div>
  );
}
