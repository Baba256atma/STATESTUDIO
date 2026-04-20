import React from "react";
import { createPortal } from "react-dom";
import type { LayoutMode } from "../../lib/contracts";
import type { HUDDockSide, HUDTheme } from "./hudTypes";

type HUDCollapsedRailProps = {
  accent: string;
  hudTheme: NonNullable<HUDTheme> | Record<string, never>;
  layoutMode: LayoutMode;
  onOpen: () => void;
  onOpenDocked: (side: HUDDockSide) => void;
  renderDockSide: HUDDockSide;
};

export function HUDCollapsedRail({
  accent,
  hudTheme,
  layoutMode,
  onOpen,
  onOpenDocked,
  renderDockSide,
}: HUDCollapsedRailProps): React.ReactElement {
  if (layoutMode === "floating") {
    if (typeof document === "undefined") {
      return <></>;
    }

    return createPortal(
      <div
        style={{
          position: "fixed",
          top: 80,
          zIndex: 1200,
          ...(renderDockSide === "left" ? { left: 8 } : { right: 8 }),
          pointerEvents: "auto",
        }}
      >
        <button
          type="button"
          onClick={onOpen}
          title="Open HUD"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            padding: "10px 8px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(10,12,18,0.85)",
            color: "rgba(255,255,255,0.85)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 12,
            pointerEvents: "auto",
          }}
        >
          Nexora HUD
        </button>
      </div>,
      document.body
    );
  }

  const railWidth = 56;
  const gridCols = renderDockSide === "left" ? `${railWidth}px 1fr` : `1fr ${railWidth}px`;
  const railColumn = renderDockSide === "left" ? 1 : 2;
  const spacerColumn = renderDockSide === "left" ? 2 : 1;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridCols,
        height: "100%",
        width: "100%",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          gridColumn: railColumn,
          width: railWidth,
          minWidth: railWidth,
          maxWidth: railWidth,
          height: "100%",
          position: "relative",
          pointerEvents: "auto",
          borderRight: renderDockSide === "left" ? "1px solid rgba(255,255,255,0.10)" : "none",
          borderLeft: renderDockSide === "right" ? "1px solid rgba(255,255,255,0.10)" : "none",
          background: hudTheme.panelBg ?? "rgba(10,12,18,0.82)",
          color: hudTheme.text ?? "#eaeaea",
        }}
      >
        <div style={{ position: "absolute", left: 8, top: 8, display: "grid", gap: 6 }}>
          <button
            type="button"
            onClick={() => onOpenDocked("left")}
            title="Open HUD (Left)"
            style={dockButtonStyle(hudTheme, accent)}
          >
            ⇤
          </button>
          <button
            type="button"
            onClick={() => onOpenDocked("right")}
            title="Open HUD (Right)"
            style={dockButtonStyle(hudTheme, accent)}
          >
            ⇥
          </button>
        </div>
      </div>
      <div style={{ gridColumn: spacerColumn, minWidth: 0, minHeight: 0, pointerEvents: "none" }} />
    </div>
  );
}

function dockButtonStyle(hudTheme: NonNullable<HUDTheme> | Record<string, never>, accent: string): React.CSSProperties {
  return {
    height: 40,
    borderRadius: 12,
    border: `1px solid ${hudTheme.border ?? "rgba(255,255,255,0.14)"}`,
    background: accent,
    color: hudTheme.text ?? "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
