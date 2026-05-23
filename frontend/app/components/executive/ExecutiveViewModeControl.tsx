"use client";

import React, { useState } from "react";

import { useWorkspaceAppearance } from "../../lib/ui/useWorkspaceAppearance";
import type { WorkspaceAppearanceMode } from "../../lib/ui/workspaceAppearanceTypes";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";

export type ExecutiveViewModeControlDensity = "desktop" | "tablet" | "mobile";

export type ExecutiveViewModeControlProps = {
  density?: ExecutiveViewModeControlDensity;
};

function segmentStyle(active: boolean, theme: ReturnType<typeof useWorkspaceAppearance>["hudTheme"]): React.CSSProperties {
  return {
    height: 28,
    padding: "0 8px",
    borderRadius: 7,
    border: `1px solid ${active ? theme.accent : theme.panelBorder}`,
    background: active
      ? `color-mix(in srgb, ${theme.accent} 18%, ${theme.controlBackground})`
      : theme.controlBackground,
    color: active ? theme.textPrimary : theme.textSecondary,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.04em",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    lineHeight: 1,
  };
}

function modeLabel(mode: WorkspaceAppearanceMode, density: ExecutiveViewModeControlDensity): string {
  if (density === "mobile") return mode === "day" ? "☀" : "🌙";
  if (density === "tablet") return mode === "day" ? "Day" : "Night";
  return mode === "day" ? "☀ Day" : "🌙 Night";
}

function modeAriaLabel(mode: WorkspaceAppearanceMode): string {
  return mode === "day" ? "Switch to day mode" : "Switch to night mode";
}

export function ExecutiveViewModeControl(props: ExecutiveViewModeControlProps): React.ReactElement {
  const density = props.density ?? "desktop";
  const { mode, setMode, hudTheme } = useWorkspaceAppearance();

  return (
    <div
      role="group"
      aria-label="Workspace appearance"
      data-nx="executive-view-mode-control"
      data-nx-density={density}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
      }}
    >
      {(["day", "night"] as const).map((option) => {
        const active = mode === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={active ? `${option} mode active` : modeAriaLabel(option)}
            title={option === "day" ? "Day mode" : "Night mode"}
            onClick={() => setMode(option)}
            style={segmentStyle(active, hudTheme)}
          >
            {modeLabel(option, density)}
          </button>
        );
      })}
    </div>
  );
}

/** Self-sizing control that follows command-bar breakpoints. */
export function ExecutiveViewModeControlResponsive(): React.ReactElement {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useViewportWidthListener(setViewportWidth, "ExecutiveViewModeControl");

  const density: ExecutiveViewModeControlDensity =
    viewportWidth < 768 ? "mobile" : viewportWidth < 1100 ? "tablet" : "desktop";

  return <ExecutiveViewModeControl density={density} />;
}
