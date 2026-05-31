import type { ExecutiveOrientationContext, ExecutiveWelcomeSnapshot } from "./executiveOrientationTypes";
import { resolveExecutiveFirstImpression } from "./executiveFirstImpressionRuntime";
import { resolveExecutiveQuickStartRecommendations } from "./executiveQuickStartRuntime";
import { resolveSituationalAwarenessSurface } from "./situationalAwarenessSurfaceRuntime";

/** E2:48 Part 7 — minimal first-visit welcome surface (no tutorial overlays). */
export function resolveExecutiveWelcomeSurface(
  input: ExecutiveOrientationContext
): ExecutiveWelcomeSnapshot {
  const firstImpression = resolveExecutiveFirstImpression(input);
  const situational = resolveSituationalAwarenessSurface(input);
  const quickStart = resolveExecutiveQuickStartRecommendations(input, 1);
  const showWelcome = input.orientation.isFirstVisit && !input.orientation.welcomeDismissed;

  return {
    showWelcome,
    currentSystemState: `${firstImpression.operationalHealth} · ${firstImpression.activeObjectCount} objects · ${firstImpression.elevatedRiskCount} elevated risks`,
    mostImportantInsight:
      input.insightLine?.trim() ??
      situational.recommendedNextStep ??
      `Focus on ${firstImpression.recommendedFocus}`,
    suggestedFirstAction: quickStart[0]?.label ?? situational.recommendedNextStep,
  };
}
