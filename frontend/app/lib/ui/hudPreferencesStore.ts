import { createDefaultHudPreferences } from "./hudPanelRegistry";
import type { HudPanelId, HudPreferences } from "./hudPreferencesTypes";
import { isHudDockPosition, isHudSizeMode, isHudVisibilityState } from "./hudPreferencesTypes";

export const HUD_PREFERENCES_STORAGE_KEY = "nx-hud-preferences";

function sanitizePartialPreferences(raw: unknown): Partial<HudPreferences> {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Partial<HudPreferences>;
  const visibility: Partial<Record<HudPanelId, HudPreferences["visibility"][HudPanelId]>> = {};
  const size: Partial<Record<HudPanelId, HudPreferences["size"][HudPanelId]>> = {};
  const dock: Partial<Record<HudPanelId, HudPreferences["dock"][HudPanelId]>> = {};

  if (input.visibility && typeof input.visibility === "object") {
    for (const [key, value] of Object.entries(input.visibility)) {
      if (isHudVisibilityState(value)) visibility[key as HudPanelId] = value;
    }
  }
  if (input.size && typeof input.size === "object") {
    for (const [key, value] of Object.entries(input.size)) {
      if (isHudSizeMode(value)) size[key as HudPanelId] = value;
    }
  }
  if (input.dock && typeof input.dock === "object") {
    for (const [key, value] of Object.entries(input.dock)) {
      if (isHudDockPosition(value)) dock[key as HudPanelId] = value;
    }
  }

  return { visibility, size, dock };
}

export function mergeHudPreferences(stored: Partial<HudPreferences>): HudPreferences {
  const defaults = createDefaultHudPreferences();
  return {
    visibility: { ...defaults.visibility, ...stored.visibility },
    size: { ...defaults.size, ...stored.size },
    dock: { ...defaults.dock, ...stored.dock },
  };
}

export function readStoredHudPreferences(): HudPreferences {
  if (typeof window === "undefined") return createDefaultHudPreferences();
  try {
    const raw = window.localStorage.getItem(HUD_PREFERENCES_STORAGE_KEY);
    if (!raw) return createDefaultHudPreferences();
    return mergeHudPreferences(sanitizePartialPreferences(JSON.parse(raw)));
  } catch {
    return createDefaultHudPreferences();
  }
}

export function persistHudPreferences(preferences: HudPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HUD_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // ignore
  }
}
