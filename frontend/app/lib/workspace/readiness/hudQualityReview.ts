import { resolvePanelBehaviorContract } from "../harmonization";
import type { E2WorkspaceReadinessContext, HudQualityReviewReport } from "./e2ReadinessTypes";
import { logWorkspaceValidation } from "./e2ReadinessInstrumentation";

type HudSurfaceKey = "sceneInfo" | "objectInfo" | "timeline" | "navigation";

function reviewSurface(
  key: HudSurfaceKey,
  visible: boolean,
  deviations: string[]
): { passed: boolean; deviations: string[] } {
  if (!visible) {
    return { passed: false, deviations: [...deviations, `${key} not visible in layout contract`] };
  }
  return { passed: deviations.length === 0, deviations };
}

/** E2:50 Part 4 — HUD quality review against Type-C principles. */
export function reviewHudQuality(context: E2WorkspaceReadinessContext): HudQualityReviewReport {
  const findings: string[] = [];

  const sceneInfoDeviations: string[] = [];
  const objectInfoDeviations: string[] = [];
  const timelineDeviations: string[] = [];
  const navigationDeviations: string[] = [];

  if (context.usesLegacyShellWithoutSurface.includes("sceneInfoHud")) {
    sceneInfoDeviations.push("Missing scene-native shell anchoring");
  }
  if (context.usesLegacyShellWithoutSurface.includes("objectInfoHud")) {
    objectInfoDeviations.push("Missing scene-native shell anchoring");
  }
  if (context.usesLegacyShellWithoutSurface.includes("timelineHud")) {
    timelineDeviations.push("Missing scene-native shell anchoring");
  }

  const sceneContract = resolvePanelBehaviorContract("sceneInfoHud");
  const timelineContract = resolvePanelBehaviorContract("timelineHud");

  if (!sceneContract.supportsCollapse) sceneInfoDeviations.push("Collapse behavior undefined");
  if (!timelineContract.supportsCollapse) timelineDeviations.push("Collapse behavior undefined");

  if ((context.viewportWidth ?? 1440) < 768 && context.sceneInfoVisible && context.objectInfoVisible) {
    findings.push("Narrow viewport with multiple HUDs — verify responsive collapse.");
  }

  if (!context.navigationToolbarVisible) {
    navigationDeviations.push("Navigation toolbar not exposed in clean Type-C layout");
  }

  const surfaces = {
    sceneInfo: reviewSurface("sceneInfo", context.sceneInfoVisible, sceneInfoDeviations),
    objectInfo: reviewSurface("objectInfo", context.objectInfoVisible || Boolean(context.selectedObjectId), objectInfoDeviations),
    timeline: reviewSurface("timeline", context.timelineVisible, timelineDeviations),
    navigation: reviewSurface("navigation", context.navigationToolbarVisible, navigationDeviations),
  };

  for (const [key, surface] of Object.entries(surfaces)) {
    if (!surface.passed) findings.push(`HUD ${key}: ${surface.deviations.join("; ")}`);
  }

  const passed = Object.values(surfaces).every((s) => s.passed) && findings.length === 0;

  const report: HudQualityReviewReport = { passed, surfaces, findings };
  logWorkspaceValidation("hudQuality", { passed, findingCount: findings.length });
  return report;
}
