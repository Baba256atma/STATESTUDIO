import { getNexoraMode } from "../typec/nexoraTypeCMode";

export const EXECUTIVE_DEV_SURFACES_STORAGE_KEY = "nexora.executive_dev_surfaces";

/**
 * E2:1 — Type-C executive workspace defaults to clean presentation (scene-first, low chrome).
 */
export function isExecutiveWorkspaceCleanPresentation(): boolean {
  return getNexoraMode() === "type_c";
}

/** Dev/diagnostic UI opt-in for clean executive workspace (dev builds only). */
export function shouldExposeExecutiveDevSurfaces(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(EXECUTIVE_DEV_SURFACES_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function shouldShowExecutiveOnboardingOverlays(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

export function shouldShowExecutiveSceneOperationalStrip(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

export function shouldShowExecutivePipelineStatusHud(status: string): boolean {
  const active = status === "processing" || status === "ready" || status === "error";
  if (!active) return false;
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return status === "processing" || status === "error";
}

export function shouldShowExecutiveStageSummaryCard(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

export function shouldShowExecutiveOperationalHud(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

export function shouldShowExecutiveStatusStrip(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

export function shouldShowExecutiveCenterHelperCopy(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

export function shouldShowExecutiveDemoSelector(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

/** E2:8 — hide legacy Scene Control sidebar when embedded Scene Info HUD is active. */
export function shouldShowExecutiveScenePanelDock(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

/** E2:9 — hide legacy Object Intelligence sidebar when embedded Object HUD is active. */
export function shouldShowExecutiveObjectPanelDock(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return true;
  return shouldExposeExecutiveDevSurfaces();
}

/** E2:12 — primary executive AI assistant on the right rail in clean Type-C mode. */
export function shouldShowExecutiveRightAssistantPanel(): boolean {
  if (!isExecutiveWorkspaceCleanPresentation()) return false;
  return !shouldExposeExecutiveDevSurfaces();
}

/** E2:12 — hide legacy left command column when right assistant is active. */
export function shouldShowExecutiveLeftCommandPanel(): boolean {
  return !shouldShowExecutiveRightAssistantPanel();
}

/** E2:12 — hide floating stage assistant when dedicated right assistant is active. */
export function shouldShowExecutiveStageAssistantOverlay(): boolean {
  return shouldShowExecutiveLeftCommandPanel();
}

/** E2:13 — scenario suggestions surface below Nexora AI assistant. */
export function shouldShowExecutiveScenarioSuggestionsPanel(): boolean {
  return shouldShowExecutiveRightAssistantPanel();
}

/** E2:14 — scenario comparison workspace below scenario suggestions. */
export function shouldShowExecutiveScenarioComparisonPanel(): boolean {
  return shouldShowExecutiveRightAssistantPanel();
}

/** E2:15 — executive top command bar status surface in clean Type-C mode. */
export function shouldShowExecutiveCommandBar(): boolean {
  return shouldShowExecutiveRightAssistantPanel();
}

/** E2:16 — scene-native executive quick actions dock. */
export function shouldShowExecutiveQuickActionsDock(): boolean {
  return shouldShowExecutiveRightAssistantPanel();
}
