/**
 * Sprint 1 — Nexora Executive Cockpit entry.
 *
 * Permanent production route: /executive
 * Composes EXS-1 → EXS-7 through ExecutiveCockpit (no duplication).
 * Development sandbox remains at /executive/exs1.
 */

import type { Metadata } from "next";
import { ExecutiveShell } from "./components/ExecutiveShell";

export const metadata: Metadata = {
  title: "Nexora · Executive Cockpit",
  description:
    "Nexora Executive Cockpit — Decision → Execution → Monitoring in one unified experience.",
};

/**
 * Executive Experience page — official entry at /executive.
 */
export default function ExecutivePage() {
  return (
    <main
      data-testid="executive-page"
      style={{
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0a0e14",
        color: "#e8eef6",
        fontFamily:
          '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <ExecutiveShell />
    </main>
  );
}
