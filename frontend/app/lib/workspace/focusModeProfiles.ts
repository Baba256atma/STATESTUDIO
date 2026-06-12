/** E2:53 — Executive focus mode HUD profiles. */

export type FocusModeProfileId = "MINIMAL" | "ANALYSIS" | "PRESENTATION";

export type FocusHudPanelId =
  | "sceneInfoHud"
  | "objectInfoHud"
  | "timelineHud"
  | "quickActionsDock"
  | "executiveStatusHud"
  | "aiAssistant"
  | "scenarioSuggestions"
  | "scenarioComparison";

export type FocusModeProfile = {
  id: FocusModeProfileId;
  label: string;
  panels: Readonly<Record<FocusHudPanelId, boolean>>;
};

export const DEFAULT_FOCUS_MODE_PROFILE: FocusModeProfileId = "ANALYSIS";

export const FOCUS_MODE_PROFILES: Readonly<Record<FocusModeProfileId, FocusModeProfile>> = Object.freeze({
  MINIMAL: {
    id: "MINIMAL",
    label: "Minimal",
    panels: {
      sceneInfoHud: true,
      objectInfoHud: false,
      timelineHud: false,
      quickActionsDock: false,
      executiveStatusHud: false,
      aiAssistant: false,
      scenarioSuggestions: false,
      scenarioComparison: false,
    },
  },
  ANALYSIS: {
    id: "ANALYSIS",
    label: "Analysis",
    panels: {
      sceneInfoHud: true,
      objectInfoHud: false,
      timelineHud: false,
      quickActionsDock: false,
      executiveStatusHud: false,
      aiAssistant: false,
      scenarioSuggestions: false,
      scenarioComparison: false,
    },
  },
  PRESENTATION: {
    id: "PRESENTATION",
    label: "Presentation",
    panels: {
      sceneInfoHud: true,
      objectInfoHud: false,
      timelineHud: false,
      quickActionsDock: true,
      executiveStatusHud: true,
      aiAssistant: true,
      scenarioSuggestions: false,
      scenarioComparison: false,
    },
  },
});

export function isFocusModeProfileId(value: unknown): value is FocusModeProfileId {
  return value === "MINIMAL" || value === "ANALYSIS" || value === "PRESENTATION";
}

export function resolveFocusModeProfile(profileId: FocusModeProfileId): FocusModeProfile {
  return FOCUS_MODE_PROFILES[profileId];
}
