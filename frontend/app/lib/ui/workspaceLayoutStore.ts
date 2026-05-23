import type { WorkspaceLayoutPreset } from "./workspaceLayoutTypes";

export const WORKSPACE_LAYOUT_PRESET_STORAGE_KEY = "nx-workspace-layout-preset";

export const DEFAULT_WORKSPACE_LAYOUT_PRESET: WorkspaceLayoutPreset = "executive";

export function readStoredWorkspaceLayoutPreset(): WorkspaceLayoutPreset {
  if (typeof window === "undefined") return DEFAULT_WORKSPACE_LAYOUT_PRESET;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_LAYOUT_PRESET_STORAGE_KEY);
    if (raw === "executive" || raw === "analysis" || raw === "simulation") return raw;
  } catch {
    // ignore
  }
  return DEFAULT_WORKSPACE_LAYOUT_PRESET;
}

export function persistWorkspaceLayoutPreset(preset: WorkspaceLayoutPreset): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_LAYOUT_PRESET_STORAGE_KEY, preset);
  } catch {
    // ignore
  }
}
