import type React from "react";

import {
  DEFAULT_FOCUS_MODE_PROFILE,
  FOCUS_MODE_PROFILES,
  type FocusHudPanelId,
  type FocusModeProfileId,
} from "./focusModeProfiles";

export type FocusHudPresentation = {
  panelId: FocusHudPanelId;
  visible: boolean;
  preserveMount: true;
  style: React.CSSProperties;
};

const logKeys = new Set<string>();

function devLog(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

/** Scene Panel is permanent scene control authority — never hidden by focus mode. */
export function isScenePanelPreservedInFocus(panelId: FocusHudPanelId): boolean {
  return panelId === "sceneInfoHud";
}

export function resolveFocusHudVisibility(input: {
  focusEnabled: boolean;
  profileId: FocusModeProfileId;
  panelId: FocusHudPanelId;
  layoutVisible: boolean;
}): FocusHudPresentation {
  const profile = FOCUS_MODE_PROFILES[input.profileId] ?? FOCUS_MODE_PROFILES[DEFAULT_FOCUS_MODE_PROFILE];
  const focusAllows =
    !input.focusEnabled ||
    isScenePanelPreservedInFocus(input.panelId) ||
    profile.panels[input.panelId] === true;
  const visible = input.layoutVisible && focusAllows;

  devLog("[Nexora][HudVisibility]", {
    panelId: input.panelId,
    focusEnabled: input.focusEnabled,
    profileId: input.profileId,
    layoutVisible: input.layoutVisible,
    visible,
  });

  return {
    panelId: input.panelId,
    visible,
    preserveMount: true,
    style: visible
      ? {}
      : {
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
          transform: "none",
        },
  };
}

export function shouldHideChromeRail(input: {
  focusEnabled: boolean;
  profileId: FocusModeProfileId;
}): boolean {
  if (!input.focusEnabled) return false;
  const profile = FOCUS_MODE_PROFILES[input.profileId] ?? FOCUS_MODE_PROFILES[DEFAULT_FOCUS_MODE_PROFILE];
  return !profile.panels.aiAssistant && !profile.panels.scenarioSuggestions && !profile.panels.scenarioComparison;
}

export function resetFocusHudVisibilityRuntimeForTests(): void {
  logKeys.clear();
}
