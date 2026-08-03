"use client";

/**
 * Sprint 1 — Official Executive Cockpit composition root.
 *
 * Consumes the completed EXS-1 → EXS-7 host without duplication.
 * /executive/exs1 remains the development sandbox using the same modules.
 */

import { Exs1Cockpit } from "../exs1/components/Exs1Cockpit";

/**
 * ExecutiveCockpit — permanent Nexora entry composition.
 */
export function ExecutiveCockpit() {
  return (
    <div
      data-testid="executive-cockpit"
      style={{
        height: "100vh",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Exs1Cockpit />
    </div>
  );
}
