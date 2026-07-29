/**
 * EX-BOOTSTRAP-1 — Executive Experience Route.
 *
 * Root Next.js App Router entry for /executive.
 * Consumes only the Executive Stage Public Index.
 * Journal, Timeline, Assistant, and business logic are out of scope.
 */

import { executiveStagePublicIndex } from "@/app/lib/ex/executiveStagePublicIndex";
import { ExecutiveShell } from "./components/ExecutiveShell";

/**
 * Executive Experience page — available at /executive.
 */
export default function ExecutivePage() {
  const index = executiveStagePublicIndex;

  return (
    <main
      data-testid="executive-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(ellipse at 50% 0%, #1a242a 0%, #0d1215 55%, #090c0e 100%)",
        color: "#e8eef2",
        fontFamily:
          '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <header
        data-testid="runtime-status"
        style={{
          padding: "1.25rem 1.5rem 0.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6f8792",
          }}
        >
          Executive Runtime
        </p>
        <p
          data-testid="runtime-readiness"
          style={{
            margin: "0.35rem 0 0",
            fontSize: "1rem",
            letterSpacing: "0.06em",
            color: "#c5d4db",
          }}
        >
          {index.readiness}
        </p>
      </header>

      <ExecutiveShell />

      <footer
        data-testid="development-banner"
        style={{
          padding: "1rem 1.5rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(143, 163, 173, 0.18)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8fa3ad",
          }}
        >
          Executive Experience
        </p>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            color: "#6f8792",
          }}
        >
          Phase · EX-1 · Released · Certified · Frozen · Stable
        </p>
      </footer>
    </main>
  );
}
