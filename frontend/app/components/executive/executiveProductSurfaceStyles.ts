import type React from "react";

export const executiveStageFrameStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  background: "transparent",
};

export const executiveSceneHostStyle: React.CSSProperties = {
  ...executiveStageFrameStyle,
  boxSizing: "border-box",
  isolation: "isolate",
};

export function executiveSceneCanvasShellStyle(bottomInset: number | string = 0): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    bottom: bottomInset,
    zIndex: 0,
    transition: "bottom 180ms ease",
    contain: "layout size style",
    overflow: "hidden",
    borderRadius: 14,
    boxShadow: "var(--nx-scene-canvas-shadow, inset 0 0 0 1px rgba(148, 163, 184, 0.08))",
    background: "var(--nx-scene-canvas-bg, rgba(2, 6, 23, 0.18))",
  };
}
