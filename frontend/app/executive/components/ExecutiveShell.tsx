"use client";

/**
 * Sprint 1 — Executive Shell.
 *
 * Hosts the unified Executive Cockpit. No placeholders remain.
 * Composes existing EXS modules via ExecutiveCockpit → Exs1Cockpit.
 */

import { ExecutiveCockpit } from "./ExecutiveCockpit";

/**
 * Executive Shell — full-viewport cockpit container.
 */
export function ExecutiveShell() {
  return (
    <div
      data-testid="executive-shell"
      style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ExecutiveCockpit />
    </div>
  );
}
