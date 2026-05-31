import { verifyDayNightHarmonizationParity } from "../harmonization";
import { SCENE_HUD_THEME_SURFACES } from "../../theme/sceneThemeTokens";
import type { E2WorkspaceReadinessContext, WorkspaceConsistencyLevel, WorkspaceConsistencyReport } from "./e2ReadinessTypes";
import { logWorkspaceValidation } from "./e2ReadinessInstrumentation";

/** E2:50 Part 3 — measure workspace consistency across E2 systems. */
export function buildWorkspaceConsistencyReport(context: E2WorkspaceReadinessContext): WorkspaceConsistencyReport {
  const findings: string[] = [];

  const terminology = context.harmonizationScore >= 75;
  const visualHierarchy = context.commandBarVisible && context.statusHudVisible;
  const interactionPatterns = context.usesLegacyShellWithoutSurface.length === 0;
  const iconLanguage = context.usesLegacyShellWithoutSurface.length <= 1;
  const panelBehavior = context.workspaceReadiness.hudReady;

  if (!terminology) findings.push("Harmonization score below threshold — terminology may diverge.");
  if (!visualHierarchy) findings.push("Command bar and status HUD not both visible — hierarchy split.");
  if (!interactionPatterns) findings.push("Surfaces missing E2:46 scene-native shell contract.");
  if (!panelBehavior) findings.push("Panel behavior baseline not ready.");

  const dayNightSurfaces = [...SCENE_HUD_THEME_SURFACES];
  const parity = verifyDayNightHarmonizationParity(dayNightSurfaces);
  if (!parity) findings.push("Day/night surface registry incomplete.");

  const flags = [terminology, visualHierarchy, interactionPatterns, iconLanguage, panelBehavior, parity];
  const score = Math.round((flags.filter(Boolean).length / flags.length) * 100);

  let level: WorkspaceConsistencyLevel = "consistent";
  if (score < 55) level = "inconsistent";
  else if (score < 85) level = "partiallyConsistent";

  const report: WorkspaceConsistencyReport = {
    level,
    terminology,
    visualHierarchy,
    interactionPatterns,
    iconLanguage,
    panelBehavior,
    findings,
    score,
  };

  logWorkspaceValidation("consistency", { level, score });
  return report;
}
