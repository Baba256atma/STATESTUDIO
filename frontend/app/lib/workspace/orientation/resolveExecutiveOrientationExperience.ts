import { resolveExecutiveFirstImpression } from "./executiveFirstImpressionRuntime";
import { getExecutiveOrientationServerSnapshot, resolveExecutiveOrientationSnapshot } from "./executiveOrientationRuntime";
import { resolveExecutiveQuickStartRecommendations } from "./executiveQuickStartRuntime";
import { resolveExecutiveWelcomeSurface } from "./executiveWelcomeSurface";
import type { ExecutiveOrientationContext, ExecutiveOrientationExperience } from "./executiveOrientationTypes";
import { resolveProgressiveWorkspaceDisclosure } from "./progressiveWorkspaceDisclosure";
import { resolveSituationalAwarenessSurface } from "./situationalAwarenessSurfaceRuntime";
import { resolveWorkspaceConfidence } from "./workspaceConfidenceRuntime";
import { resolveWorkspaceMeaningLayer } from "./workspaceMeaningRuntime";

/** Orchestrates all E2:48 orientation runtimes into a single executive experience snapshot. */
export function resolveExecutiveOrientationExperience(
  input: Omit<ExecutiveOrientationContext, "orientation"> & {
    orientation?: ExecutiveOrientationContext["orientation"];
  }
): ExecutiveOrientationExperience {
  const orientation =
    input.orientation ??
    (typeof window === "undefined"
      ? getExecutiveOrientationServerSnapshot()
      : resolveExecutiveOrientationSnapshot());
  const context: ExecutiveOrientationContext = { ...input, orientation };

  return {
    orientation,
    firstImpression: resolveExecutiveFirstImpression(context),
    situationalAwareness: resolveSituationalAwarenessSurface(context),
    quickStart: resolveExecutiveQuickStartRecommendations(context),
    workspaceMeaning: resolveWorkspaceMeaningLayer(),
    progressiveDisclosure: resolveProgressiveWorkspaceDisclosure({
      tier: orientation.tier,
      elapsedSeconds: input.elapsedSeconds,
    }),
    welcome: resolveExecutiveWelcomeSurface(context),
    confidence: resolveWorkspaceConfidence(context),
  };
}

export function deriveElevatedRiskCount(input: {
  fragilityLevel: ExecutiveOrientationContext["fragilityLevel"];
  signalsCount: number;
}): number {
  if (input.signalsCount > 0) return Math.min(input.signalsCount, 12);
  if (input.fragilityLevel === "critical") return 3;
  if (input.fragilityLevel === "high") return 2;
  if (input.fragilityLevel === "medium") return 1;
  return 0;
}
