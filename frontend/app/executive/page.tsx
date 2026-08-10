/**
 * NEX-MVP:2 — Nexora Executive Decision Environment entry.
 *
 * Permanent production route: /executive
 * Composes NEX-MVP:2 Executive Shell on NEX-MVP:1 foundation.
 * Development sandbox remains at /executive/exs1.
 */

import type { Metadata } from "next";
import { ExecutiveShell } from "./components/ExecutiveShell";

export const metadata: Metadata = {
  title: "Nexora · Executive Environment",
  description:
    "Nexora Executive Decision Environment — Stage-centered executive experience.",
};

/**
 * Executive Experience page — canonical MVP entry at /executive.
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
