import { evaluateExecutiveSceneDensity } from "../../scene/density/executiveSceneDensityRuntime";
import { resolveExecutiveLabelReduction } from "../minimalism/executiveLabelReductionRuntime";
import type { E2WorkspaceReadinessContext, WorkspaceScalabilityReport } from "./e2ReadinessTypes";
import { logScalabilityAudit } from "./e2ReadinessInstrumentation";

const SCALE_TIERS = [10, 25, 50, 100] as const;

/** E2:50 Part 6 — scene scaling validation at executive object counts. */
export function buildWorkspaceScalabilityReport(context: E2WorkspaceReadinessContext): WorkspaceScalabilityReport {
  const findings: string[] = [];
  const relationshipRatio = context.objectCount > 0 ? context.relationshipCount / context.objectCount : 0;

  const tiers = SCALE_TIERS.map((objectCount) => {
    const relationships = Math.round(objectCount * Math.max(relationshipRatio, 0.5));
    const density = evaluateExecutiveSceneDensity({
      objectCount,
      relationshipCount: relationships,
      viewportWidth: context.viewportWidth ?? 1440,
      viewportHeight: context.viewportHeight ?? 900,
      layoutPreset: context.layoutPreset,
    });

    const labelState = resolveExecutiveLabelReduction({
      objectCount,
      selected: Boolean(context.selectedObjectId),
      focused: Boolean(context.selectedObjectId),
      isCritical: false,
      isHighRisk: false,
      isConnected: false,
      viewportWidth: context.viewportWidth,
    });

    const labelReadable = labelState.visible || objectCount <= 50;
    const selectionClear = density.sceneDensity !== "critical" || objectCount <= 50;
    const cameraStable = density.cameraProfile !== "compact" || objectCount <= 100;
    const usable = density.densityScore <= 0.82 && labelReadable && selectionClear;

    if (!usable) findings.push(`${objectCount} objects: density score ${density.densityScore.toFixed(2)} may reduce usability.`);
    if (!labelReadable) findings.push(`${objectCount} objects: label reduction hides too much context.`);
    if (!cameraStable) findings.push(`${objectCount} objects: camera profile may feel cramped.`);

    return {
      objectCount,
      usable,
      densityScore: density.densityScore,
      labelReadable,
      selectionClear,
      cameraStable,
    };
  });

  const passed = tiers.every((tier) => tier.usable);
  const report: WorkspaceScalabilityReport = { passed, tiers, findings };
  logScalabilityAudit("completed", { passed, tiers: tiers.map((t) => t.objectCount) });
  return report;
}
