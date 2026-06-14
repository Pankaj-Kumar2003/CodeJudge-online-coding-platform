import Link from "next/link";

export default function PlatformHomePage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 55px)",
        background: "radial-gradient(circle at top, #1a1a1a 0%, #0d0d0d 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
        textAlign: "center",
      }}
    >
      {/* GLOWING HERO BADGE */}
      <div
        style={{
          background: "rgba(76, 175, 80, 0.1)",
          border: "1px solid #4caf50",
          color: "#4caf50",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "24px",
          boxShadow: "0 0 20px rgba(76,175,80,0.15)",
        }}
      >
        🚀 Engine Status: v2.0 Production Stack Online
      </div>

      {/* CORE HEADLINE */}
      <h1
        style={{
          fontSize: "52px",
          fontWeight: "800",
          margin: "0 0 16px 0",
          letterSpacing: "-1.5px",
          background: "linear-gradient(to right, #ffffff, #888888)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Next-Generation Code Evaluation Cloud
      </h1>

      {/* SUB-TEXT */}
      <p
        style={{
          fontSize: "18px",
          color: "#aaa",
          maxWidth: "640px",
          lineHeight: "1.6",
          margin: "0 0 40px 0",
        }}
      >
        Compile, audit, and benchmark complex data structures inside
        ultra-isolated container runtimes. Fully integrated with Next.js, Prisma
        PostgreSQL, and Judge0.
      </p>

      {/* CTA INTERACTION PORTALS */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Link
          href="/problems"
          style={{
            background: "#137333",
            color: "#fff",
            textDecoration: "none",
            padding: "14px 28px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "bold",
            transition: "all 0.2s",
            boxShadow: "0 4px 14px rgba(19,115,51,0.4)",
          }}
        >
          Enter Workspace Dashboard ➔
        </Link>

        <Link
          href="/problems/create"
          style={{
            background: "#252526",
            color: "#ccc",
            border: "1px solid #3c3c3c",
            textDecoration: "none",
            padding: "14px 28px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "bold",
            transition: "all 0.2s",
          }}
        >
          Open Admin Creator Panel
        </Link>
      </div>

      {/* TECH COMPONENT BADGES BOTTOM GRID */}
      <div
        style={{
          marginTop: "80px",
          display: "flex",
          gap: "40px",
          borderTop: "1px solid #222",
          paddingTop: "30px",
          color: "#555",
          fontSize: "12px",
          fontWeight: "bold",
          letterSpacing: "0.5px",
        }}
      >
        <div>⚡ NEXT.JS APP ROUTER</div>
        <div>🐘 POSTGRES DB CLUSTER</div>
        <div>🐳 DOCKER SANDBOX ISOLATION</div>
      </div>
    </div>
  );
}
