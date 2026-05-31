import { verifyDayNightHarmonizationParity } from "../harmonization";
import { SCENE_HUD_THEME_SURFACES } from "../../theme/sceneThemeTokens";
import type { DayNightReadinessReport, E2WorkspaceReadinessContext } from "./e2ReadinessTypes";
import { logWorkspaceValidation } from "./e2ReadinessInstrumentation";

/** E2:50 Part 7 — day/night readiness review. */
export function reviewDayNightReadiness(context: E2WorkspaceReadinessContext): DayNightReadinessReport {
  const inconsistencies: string[] = [];

  const hierarchyParity = verifyDayNightHarmonizationParity([...SCENE_HUD_THEME_SURFACES]);
  const spacingParity = context.usesLegacyShellWithoutSurface.length === 0;
  const themeReady = context.workspaceReadiness.themeReady;

  const dayUsable =
    themeReady &&
    context.commandBarVisible &&
    context.sceneJsonPresent &&
    (context.themeMode === "day" || context.themeMode === "night");

  const nightUsable = dayUsable;

  if (!hierarchyParity) inconsistencies.push("Surface registry incomplete — day/night hierarchy may diverge.");
  if (!spacingParity) inconsistencies.push("Legacy HUD shells may use different spacing per theme.");
  if (!themeReady) inconsistencies.push("Theme runtime not confirmed ready.");

  const passed = dayUsable && nightUsable && hierarchyParity && spacingParity && inconsistencies.length === 0;

  const report: DayNightReadinessReport = {
    passed,
    dayUsable,
    nightUsable,
    hierarchyParity,
    spacingParity,
    inconsistencies,
  };

  logWorkspaceValidation("dayNight", report);
  return report;
}
