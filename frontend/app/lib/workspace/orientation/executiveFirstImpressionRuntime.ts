import type {
  ExecutiveFirstImpressionSnapshot,
  ExecutiveOrientationContext,
} from "./executiveOrientationTypes";
import { logExecutiveFirstImpression } from "./executiveOrientationInstrumentation";

function resolveOperationalHealthLabel(input: ExecutiveOrientationContext): string {
  if (input.pipelineStatus === "processing") return "Assessing";
  if (input.pipelineStatus === "error") return "Attention Required";
  if (input.fragilityLevel === "critical" || input.fragilityLevel === "high") return "Elevated Pressure";
  if (input.fragilityLevel === "medium") return "Monitoring";
  if (input.objectCount === 0) return "Awaiting System Map";
  return "Stable";
}

function resolveRecommendedFocus(input: ExecutiveOrientationContext): string {
  if (input.selectedObjectLabel?.trim()) return input.selectedObjectLabel.trim();
  if (input.recommendedFocusLabel?.trim()) return input.recommendedFocusLabel.trim();
  if (input.activeScenarioTitle?.trim()) return input.activeScenarioTitle.trim();
  if (input.domainLabel?.trim()) return input.domainLabel.trim();
  return "Primary Network";
}

/** E2:48 Part 2 — concise 5-second workspace explanation. */
export function resolveExecutiveFirstImpression(
  input: ExecutiveOrientationContext
): ExecutiveFirstImpressionSnapshot {
  const operationalHealth = resolveOperationalHealthLabel(input);
  const recommendedFocus = resolveRecommendedFocus(input);
  const activeScenarioCount = Math.max(input.activeScenarioCount, input.activeScenarioTitle ? 1 : 0);

  const summaryLines = [
    `Operational Health: ${operationalHealth}`,
    `${input.objectCount} Active Object${input.objectCount === 1 ? "" : "s"}`,
    `${input.elevatedRiskCount} Elevated Risk${input.elevatedRiskCount === 1 ? "" : "s"}`,
    `${activeScenarioCount} Active Scenario${activeScenarioCount === 1 ? "" : "s"}`,
    `Recommended Focus:\n${recommendedFocus}`,
  ];

  const snapshot: ExecutiveFirstImpressionSnapshot = {
    operationalHealth,
    activeObjectCount: input.objectCount,
    elevatedRiskCount: input.elevatedRiskCount,
    activeScenarioCount,
    recommendedFocus,
    summaryLines,
  };

  logExecutiveFirstImpression("resolved", snapshot);
  return snapshot;
}
