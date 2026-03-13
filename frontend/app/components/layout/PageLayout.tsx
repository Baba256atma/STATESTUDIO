"use client";

import React from "react";
import type { LayoutMode } from "../../lib/contracts";

export function PageLayout({
  layoutMode,
  scene,
  hud,
}: {
  layoutMode: LayoutMode;
  scene: React.ReactNode;
  hud: React.ReactNode;
}) {
  if (layoutMode === "split") {
    return (
      <div style={styles.splitRoot}>
        <aside style={styles.leftHud}>{hud}</aside>
        <main style={styles.rightScene}>{scene}</main>
      </div>
    );
  }

  // floating (current)
  return <div style={styles.floatingRoot}>{scene}{hud}</div>;
}

const styles: Record<string, React.CSSProperties> = {
  splitRoot: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
    background: "transparent",
  },
  leftHud: {
    width: "45vw",
    height: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
    borderRight: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(10px)",
    flexShrink: 0,
  },
  rightScene: {
    flex: 1,
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  floatingRoot: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "transparent",
  },
};
