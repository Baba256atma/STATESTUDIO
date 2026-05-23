import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { getDemoScenarioById } from "./demoContentRegistry.ts";
import type { ExecutiveDemoModeInput, ExecutivePresentationSnapshot } from "./executiveDemoModeTypes.ts";

export function buildExecutivePresentationSnapshot(input: ExecutiveDemoModeInput): ExecutivePresentationSnapshot {
  const journeyId = input.activeJourneyId ?? input.requestedJourneyIds?.[0] ?? "platform_overview";
  const scenario = getDemoScenarioById(journeyId) ?? getDemoScenarioById("platform_overview")!;
  const dashboardEvidence = input.dashboard
    ? [`Health: ${input.dashboard.healthSurface.status}`, `Launch assessment: ${input.dashboard.launchAssessment}`]
    : ["Executive dashboard evidence unavailable"];
  const validationEvidence = input.validationSuite
    ? [`Validation: ${input.validationSuite.state}`, `Coverage: ${input.validationSuite.coverage.coverageScore}`]
    : ["Validation evidence unavailable"];
  const launchEvidence = input.launchGate
    ? [`Launch gate: ${input.launchGate.state}`, `Recommendation: ${input.launchGate.recommendation}`]
    : ["Launch gate evidence unavailable"];
  const supportingEvidence = [...dashboardEvidence, ...validationEvidence, ...launchEvidence];
  const exploreNext = scenario.sequence.map((step) => step.safeFallback).slice(0, 3);

  return {
    snapshotId: stableSignature(["d10-presentation-snapshot", input.organizationId ?? "nexora-default", journeyId]).slice(0, 56),
    capabilityDemonstrated: scenario.capability,
    whyItMatters: scenario.whyItMatters,
    valueProvided: scenario.valueProvided,
    supportingEvidence: Object.freeze(supportingEvidence),
    exploreNext: Object.freeze(exploreNext),
    executiveSummary: `${scenario.title}: ${scenario.valueProvided}`,
    signature: stableSignature(["d10-presentation-snapshot", journeyId, supportingEvidence, exploreNext]),
  };
}
