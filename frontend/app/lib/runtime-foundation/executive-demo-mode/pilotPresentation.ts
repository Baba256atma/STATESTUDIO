import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { DemoJourneyId, ExecutiveDemoModeInput, PilotPresentationPlan } from "./executiveDemoModeTypes.ts";

const PILOT_JOURNEYS: readonly DemoJourneyId[] = Object.freeze([
  "platform_overview",
  "object_intelligence",
  "fragility_analysis",
  "scenario_simulation",
  "executive_decision_support",
]);

export function buildPilotPresentationPlan(input: ExecutiveDemoModeInput): PilotPresentationPlan {
  const readinessIndicators = [
    input.dashboard ? `Dashboard health: ${input.dashboard.healthSurface.status}` : "Dashboard health unavailable",
    input.validationSuite ? `Validation state: ${input.validationSuite.state}` : "Validation state unavailable",
    input.launchGate ? `Launch gate state: ${input.launchGate.state}` : "Launch gate state unavailable",
  ];
  const guidedExploration = (input.requestedJourneyIds?.length ? input.requestedJourneyIds : PILOT_JOURNEYS).filter(
    (journeyId): journeyId is DemoJourneyId => PILOT_JOURNEYS.includes(journeyId)
  );

  return {
    planId: stableSignature(["d10-pilot-plan", input.organizationId ?? "nexora-default", input.mode]).slice(0, 56),
    onboardingVisibility: Object.freeze([
      "Readiness posture",
      "Trust posture",
      "Validation posture",
      "Launch advisory status",
    ]),
    readinessIndicators: Object.freeze(readinessIndicators),
    guidedExploration: Object.freeze(guidedExploration),
    featureDiscoverability: Object.freeze([
      "Object intelligence",
      "Fragility analysis",
      "Scenario simulation",
      "Executive decision support",
    ]),
    feedbackPreparation: Object.freeze([
      "Capture questions about trust evidence.",
      "Capture workflows that require pilot validation.",
      "Capture unsupported exploration requests without changing runtime state.",
    ]),
    nonDestructive: true,
    signature: stableSignature(["d10-pilot-plan", readinessIndicators, guidedExploration]),
  };
}
