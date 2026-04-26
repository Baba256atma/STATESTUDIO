"use client";

import React from "react";

/** Lightweight command layer (wraps `CommandHeader`). */
export function NexoraTopControlBar({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div id="nexora-top-control-bar" style={{ flexShrink: 0, minHeight: 0 }}>
      {children}
    </div>
  );
}

/** Left nav + center scene + right intelligence rail. */
export function NexoraMainWorkspaceShell({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div
      id="nexora-layout"
      style={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        overflow: "hidden",
        minWidth: 0,
        width: "100%",
        maxWidth: "none",
      }}
    >
      {children}
    </div>
  );
}

/** Bottom status / replay strip (timeline dock). */
export function NexoraBottomTimelineDock({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div id="nexora-bottom-timeline-dock" style={{ flexShrink: 0, minHeight: 0 }}>
      {children}
    </div>
  );
}
