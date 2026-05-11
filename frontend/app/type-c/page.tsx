"use client";

import Link from "next/link";

const typeCTags = ["TYPE_C", "EXECUTIVE", "DECISION_OS"];

export default function TypeCPage() {
  return (
    <main
      data-nx="type-c-manager-workspace-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(120% 120% at 80% 0%, rgba(14,165,233,0.18) 0%, rgba(15,23,42,0.96) 44%, #04070d 100%)",
        color: "#f8fafc",
      }}
    >
      <section
        style={{
          width: "min(760px, 100%)",
          borderRadius: 24,
          border: "1px solid rgba(148,163,184,0.16)",
          background: "rgba(15,23,42,0.74)",
          boxShadow: "0 22px 70px rgba(2,6,23,0.42)",
          padding: 28,
        }}
      >
        <div
          style={{
            color: "#7dd3fc",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          Nexora Type-C
        </div>
        <h1
          style={{
            margin: "10px 0 0",
            fontSize: "clamp(34px, 6vw, 56px)",
            lineHeight: 1,
            letterSpacing: 0,
          }}
        >
          Manager Workspace
        </h1>
        <p style={{ margin: "16px 0 0", color: "#cbd5e1", fontSize: 16, lineHeight: 1.7 }}>
          Executive decision workspace for system modeling, fragility analysis, scenarios, war room, and monitored execution.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
          {typeCTags.map((tag) => (
            <span
              key={tag}
              style={{
                height: 26,
                padding: "0 10px",
                borderRadius: 999,
                border: "1px solid rgba(125,211,252,0.18)",
                background: "rgba(8,47,73,0.32)",
                color: "#e0f2fe",
                display: "inline-flex",
                alignItems: "center",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            padding: 16,
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "rgba(2,6,23,0.32)",
            color: "#94a3b8",
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
          This route is the safe Type-C entry point. The full Manager Workspace can be connected here without changing the existing domain selection behavior.
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <Link
            href="/"
            style={{
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(125,211,252,0.22)",
              background: "rgba(14,165,233,0.14)",
              color: "#e0f2fe",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 14px",
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Back to Domains
          </Link>
        </div>
      </section>
    </main>
  );
}
