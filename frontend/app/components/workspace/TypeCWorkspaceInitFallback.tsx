"use client";

import type React from "react";
import Link from "next/link";

export type TypeCWorkspaceInitFallbackProps = {
  title?: string;
  detail?: string;
  diagnostic?: string;
};

/**
 * Production-safe fallback when Type-C workspace bootstrap fails (no blank screen).
 */
export function TypeCWorkspaceInitFallback(
  props: TypeCWorkspaceInitFallbackProps
): React.ReactElement {
  const title = props.title ?? "Workspace unavailable.";
  const detail = props.detail ?? "Initialization failed.";
  const diagnostic = props.diagnostic ?? "See console diagnostics.";

  return (
    <main
      data-nx="type-c-workspace-init-fallback"
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--nx-bg-app, #04070d)",
        color: "var(--nx-text, #f8fafc)",
      }}
    >
      <section
        style={{
          width: "min(520px, 100%)",
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.2)",
          background: "rgba(15,23,42,0.82)",
          padding: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{title}</h1>
        <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "#cbd5e1" }}>{detail}</p>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8" }}>{diagnostic}</p>
        <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.25)",
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Back to Domains
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(125,211,252,0.3)",
              background: "rgba(14,165,233,0.12)",
              color: "#e0f2fe",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </section>
    </main>
  );
}
