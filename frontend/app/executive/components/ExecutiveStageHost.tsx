/**
 * EX-BOOTSTRAP-1 — Executive Stage Host.
 *
 * Renders the completed Executive Stage surface from the Public Index.
 * No Objects, Journal, Timeline, or business logic.
 */

import { executiveStagePublicIndex } from "@/app/lib/ex/executiveStagePublicIndex";

/**
 * Stage host — title, Runtime status, Public Index version, release status.
 */
export function ExecutiveStageHost() {
  const index = executiveStagePublicIndex;

  return (
    <section
      data-testid="executive-stage-host"
      aria-label="Executive Stage"
      style={{
        flex: "1 1 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "32rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: "#e8eef2",
          }}
        >
          Executive Stage
        </h1>

        <p
          data-testid="stage-runtime-status"
          style={{
            margin: 0,
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8fa3ad",
          }}
        >
          Runtime status · {index.readiness}
        </p>

        <p
          data-testid="stage-public-index-version"
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "#a8b8c0",
          }}
        >
          Public Index · v{index.version}
        </p>

        <p
          data-testid="stage-release-status"
          style={{
            margin: 0,
            fontSize: "0.85rem",
            letterSpacing: "0.04em",
            color: "#6f8792",
          }}
        >
          {index.status}
        </p>
      </div>
    </section>
  );
}
