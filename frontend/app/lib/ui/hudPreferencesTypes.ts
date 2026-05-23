import type { PanelSizeMode, WorkspacePanelId } from "./workspaceLayoutTypes";

/** E2:19 — Canonical HUD panel identifier (extends workspace panel IDs). */
export type HudPanelId = WorkspacePanelId;

export type HudVisibilityState = "visible" | "hidden";

/** Alias aligned with workspace layout sizing; kept for HUD preference contract clarity. */
export type HudSizeMode = PanelSizeMode;

export type HudDockPosition = "left" | "right" | "top" | "bottom";

export type HudPreferences = {
  visibility: Partial<Record<HudPanelId, HudVisibilityState>>;
  size: Partial<Record<HudPanelId, HudSizeMode>>;
  dock: Partial<Record<HudPanelId, HudDockPosition>>;
};

export type HudPanelCategory = "scene" | "rail" | "chrome";

export type HudPanelDefinition = {
  id: HudPanelId;
  label: string;
  shortLabel: string;
  category: HudPanelCategory;
  defaultVisibility: HudVisibilityState;
  defaultSize: HudSizeMode;
  defaultDock: HudDockPosition;
  allowedDocks: readonly HudDockPosition[];
  customizable: {
    visibility: boolean;
    size: boolean;
    dock: boolean;
  };
};

export function isHudVisibilityState(value: unknown): value is HudVisibilityState {
  return value === "visible" || value === "hidden";
}

export function isHudSizeMode(value: unknown): value is HudSizeMode {
  return value === "compact" || value === "normal" || value === "expanded";
}

export function isHudDockPosition(value: unknown): value is HudDockPosition {
  return value === "left" || value === "right" || value === "top" || value === "bottom";
}

// E2:20 Executive Workspace Profiles
// E3 Scene Object Catalog
// E3 Scene Control System
// D8 Personalized Strategic Workspace
// D10 Production Preference Management
