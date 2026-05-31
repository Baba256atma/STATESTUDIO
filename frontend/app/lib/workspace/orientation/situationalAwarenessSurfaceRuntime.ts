import { resolveExecutiveEmptyState } from "../minimalism";
import { harmonizeExecutiveVocabulary } from "../harmonization";
import type {
  ExecutiveOrientationContext,
  SituationalAwarenessSnapshot,
} from "./executiveOrientationTypes";
import { logSituationalAwareness } from "./executiveOrientationInstrumentation";

function resolveOperationalStatus(input: ExecutiveOrientationContext): string {
  if (input.pipelineStatus === "processing") return "Assessment in progress";
  if (input.pipelineStatus === "error") return "Operational review required";
  if (input.objectCount === 0) return "System map pending";
  if (input.workspaceReadiness.ready) return "Workspace operational";
  return "Core systems online";
}

function resolveRiskStatus(input: ExecutiveOrientationContext): string {
  if (input.elevatedRiskCount > 0) {
    return `${input.elevatedRiskCount} elevated risk signal${input.elevatedRiskCount === 1 ? "" : "s"}`;
  }
  if (input.fragilityLevel) {
    return `Fragility ${input.fragilityLevel.toUpperCase()}`;
  }
  return resolveExecutiveEmptyState("no_risk_signals");
}

function resolveRecommendedNextStep(input: ExecutiveOrientationContext): string {
  if (input.decisionNextMove?.trim()) return input.decisionNextMove.trim();
  if (input.selectedObjectLabel?.trim()) return `Inspect ${input.selectedObjectLabel.trim()}`;
  if (input.objectCount === 0) return "Map your operational system";
  if (input.elevatedRiskCount > 0) return "Analyze current risks";
  if (input.activeScenarioTitle?.trim()) return `Review ${input.activeScenarioTitle.trim()}`;
  return "Review critical dependencies";
}

function resolveEntryHeadline(input: ExecutiveOrientationContext): string {
  if (input.insightLine?.trim()) return input.insightLine.trim();
  if (input.pipelineStatus === "processing") return "Analyzing operational context";
  if (input.objectCount === 0) return "Executive workspace ready for system mapping";
  if (input.elevatedRiskCount > 0) return "Elevated risk signals require executive attention";
  if (input.workspaceReadiness.ready) return "Executive workspace operational";
  return "Core systems online";
}

/** E2:48 Part 3 — workspace entry situational awareness (replaces generic init copy). */
export function resolveSituationalAwarenessSurface(
  input: ExecutiveOrientationContext
): SituationalAwarenessSnapshot {
  const snapshot: SituationalAwarenessSnapshot = {
    systemOverview: harmonizeExecutiveVocabulary(
      input.domainLabel?.trim()
        ? `${input.domainLabel.trim()} executive workspace`
        : "Strategic operations workspace"
    ),
    operationalStatus: harmonizeExecutiveVocabulary(resolveOperationalStatus(input)),
    riskStatus: harmonizeExecutiveVocabulary(resolveRiskStatus(input)),
    recommendedNextStep: harmonizeExecutiveVocabulary(resolveRecommendedNextStep(input)),
    entryHeadline: harmonizeExecutiveVocabulary(resolveEntryHeadline(input)),
  };

  logSituationalAwareness("resolved", snapshot);
  return snapshot;
}
