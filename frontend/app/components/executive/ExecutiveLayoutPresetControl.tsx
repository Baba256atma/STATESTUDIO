"use client";

import React, { useState } from "react";

import { useWorkspaceAppearance } from "../../lib/ui/useWorkspaceAppearance";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import {
  WORKSPACE_LAYOUT_PRESET_LABELS,
  type WorkspaceLayoutPreset,
} from "../../lib/ui/workspaceLayoutTypes";

export type ExecutiveLayoutPresetControlDensity = "desktop" | "tablet" | "mobile";

export type ExecutiveLayoutPresetControlProps = {
  density?: ExecutiveLayoutPresetControlDensity;
};

const PRESETS: WorkspaceLayoutPreset[] = ["executive", "analysis", "simulation"];

function segmentStyle(
  active: boolean,
  theme: ReturnType<typeof useWorkspaceAppearance>["hudTheme"]
): React.CSSProperties {
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
    letterSpacing: "0.03em",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
}

function presetLabel(preset: WorkspaceLayoutPreset, density: ExecutiveLayoutPresetControlDensity): string {
  const label = WORKSPACE_LAYOUT_PRESET_LABELS[preset];
  if (density === "mobile") {
    if (preset === "executive") return "Ex";
    if (preset === "analysis") return "An";
    return "Sim";
  }
  if (density === "tablet") return label;
  return label;
}

export function ExecutiveLayoutPresetControl(props: ExecutiveLayoutPresetControlProps): React.ReactElement {
  const density = props.density ?? "desktop";
  const { preset, setPreset } = useWorkspaceLayout();
  const { hudTheme } = useWorkspaceAppearance();

  return (
    <div
      role="group"
      aria-label="Workspace layout preset"
      data-nx="executive-layout-preset-control"
      data-nx-density={density}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
      }}
    >
      {PRESETS.map((option) => {
        const active = preset === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={active ? `${WORKSPACE_LAYOUT_PRESET_LABELS[option]} layout active` : `Switch to ${WORKSPACE_LAYOUT_PRESET_LABELS[option]} layout`}
            title={`${WORKSPACE_LAYOUT_PRESET_LABELS[option]} layout`}
            onClick={() => setPreset(option)}
            style={segmentStyle(active, hudTheme)}
          >
            {presetLabel(option, density)}
          </button>
        );
      })}
    </div>
  );
}

export function ExecutiveLayoutPresetControlResponsive(): React.ReactElement {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useViewportWidthListener(setViewportWidth, "ExecutiveLayoutPresetControl");

  const density: ExecutiveLayoutPresetControlDensity =
    viewportWidth < 768 ? "mobile" : viewportWidth < 1100 ? "tablet" : "desktop";

  return <ExecutiveLayoutPresetControl density={density} />;
}
