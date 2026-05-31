import { TYPE_C_WORKSPACE_IDENTITY_CONTRACT } from "../harmonization";
import type { E2WorkspaceReadinessContext, TypeCReferenceAuditReport } from "./e2ReadinessTypes";
import { logTypeCReferenceAudit } from "./e2ReadinessInstrumentation";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * E2:50 Part 9 — compare workspace against approved Type-C reference principles.
 * Uses the E2:49 identity contract as the canonical reference baseline.
 */
export function runTypeCReferenceAudit(context: E2WorkspaceReadinessContext): TypeCReferenceAuditReport {
  const recommendations: string[] = [];

  const sceneNativeFeel = clampScore(
    100 -
      context.usesLegacyShellWithoutSurface.length * 12 -
      (context.sceneJsonPresent ? 0 : 25)
  );

  const executiveAppearance = clampScore(
    (context.harmonizationScore + (context.commandBarVisible ? 15 : 0) + (context.statusHudVisible ? 10 : 0)) / 1.25
  );

  const panelIntegration = clampScore(
    [
      context.sceneInfoVisible,
      context.objectInfoVisible || Boolean(context.selectedObjectId),
      context.timelineVisible,
      context.assistantVisible,
    ].filter(Boolean).length * 22
  );

  const workspaceBalance = clampScore(
    context.workspaceReadiness.score -
      (context.usesLegacyShellWithoutSurface.length > 2 ? 15 : 0)
  );

  const decisionFocus = clampScore(
    context.orientationExperience?.situationalAwareness.entryHeadline
      ? 78
      : context.commandBarVisible
        ? 65
        : 40
  );

  if (sceneNativeFeel < 80) recommendations.push("Migrate remaining HUDs to scene-native E2:46 shells.");
  if (executiveAppearance < 75) recommendations.push("Apply harmonization pass to command bar and status surfaces.");
  if (panelIntegration < 70) recommendations.push("Ensure all core panels visible in clean Type-C layout.");
  if (workspaceBalance < 70) recommendations.push("Rebalance layout contract — reduce competing surfaces.");
  if (decisionFocus < 70) recommendations.push("Strengthen orientation and situational awareness on entry.");

  const alignmentScore = clampScore(
    (sceneNativeFeel + executiveAppearance + panelIntegration + workspaceBalance + decisionFocus) / 5
  );

  const report: TypeCReferenceAuditReport = {
    alignmentScore,
    sceneNativeFeel,
    executiveAppearance,
    panelIntegration,
    workspaceBalance,
    decisionFocus,
    recommendations,
  };

  logTypeCReferenceAudit("completed", {
    alignmentScore,
    reference: TYPE_C_WORKSPACE_IDENTITY_CONTRACT.version,
  });
  return report;
}
