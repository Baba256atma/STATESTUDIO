import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  FeedbackPriorityAssessment,
  LearningPattern,
  PilotInsightSummary,
} from "./executiveFeedbackTypes.ts";

function evidence(patterns: readonly LearningPattern[], types: readonly LearningPattern["type"][]): string[] {
  return patterns
    .filter((pattern) => types.includes(pattern.type))
    .flatMap((pattern) => pattern.evidence.length ? pattern.evidence : [pattern.label])
    .slice(0, 4);
}

export function generatePilotInsightSummary(
  patterns: readonly LearningPattern[],
  priorities: readonly FeedbackPriorityAssessment[]
): PilotInsightSummary {
  const repeatedProblems = evidence(patterns, ["recurring_concern", "recurring_friction"]);
  const valuedCapabilities = evidence(patterns, ["successful_workflow", "trusted_capability"]);
  const confusionSources = patterns
    .filter((pattern) => pattern.type === "recurring_friction" || pattern.category === "UX" || pattern.category === "onboarding")
    .map((pattern) => pattern.label)
    .slice(0, 4);
  const improveFirst = priorities.slice(0, 4).map((priority) => priority.recommendation);
  const whatUsersTellUs = patterns.length
    ? patterns.slice(0, 4).map((pattern) => `${pattern.label} appears ${pattern.occurrenceCount} time(s).`)
    : ["No recurring pilot feedback pattern has been confirmed yet."];

  return {
    whatUsersTellUs: Object.freeze(whatUsersTellUs),
    repeatedProblems: Object.freeze(repeatedProblems.length ? repeatedProblems : ["No repeated problem confirmed yet."]),
    valuedCapabilities: Object.freeze(valuedCapabilities.length ? valuedCapabilities : ["No trusted capability pattern confirmed yet."]),
    confusionSources: Object.freeze(confusionSources.length ? confusionSources : ["No recurring confusion source confirmed yet."]),
    improveFirst: Object.freeze(improveFirst.length ? improveFirst : ["Collect additional structured pilot feedback."]),
    headline:
      repeatedProblems.length > 0
        ? "Pilot learning shows repeated improvement opportunities."
        : valuedCapabilities.length > 0
          ? "Pilot learning shows early product value signals."
          : "Pilot learning is forming from structured feedback.",
    signature: stableSignature(["d10-pilot-insights", whatUsersTellUs, repeatedProblems, valuedCapabilities, confusionSources, improveFirst]),
  };
}
