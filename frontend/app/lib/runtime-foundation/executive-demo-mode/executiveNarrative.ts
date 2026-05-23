import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { getDemoScenarioById } from "./demoContentRegistry.ts";
import type { ExecutiveDemoModeInput, ExecutiveDemoNarrative } from "./executiveDemoModeTypes.ts";

export function generateExecutiveDemoNarrative(input: ExecutiveDemoModeInput): ExecutiveDemoNarrative {
  const journeyId = input.activeJourneyId ?? input.requestedJourneyIds?.[0] ?? "platform_overview";
  const scenario = getDemoScenarioById(journeyId) ?? getDemoScenarioById("platform_overview")!;
  const health = input.dashboard?.healthSurface.status ?? "unknown";
  const recommendation = input.launchGate?.recommendation ?? "launch_after_remediation";
  const validation = input.validationSuite?.state ?? "pending";
  const groundedEvidence = [
    `Capability: ${scenario.capability}`,
    `Health: ${health}`,
    `Validation: ${validation}`,
    `Launch recommendation: ${recommendation}`,
  ];

  return {
    narrativeId: stableSignature(["d10-demo-narrative", input.organizationId ?? "nexora-default", journeyId]).slice(0, 56),
    operationalSignificance: scenario.whyItMatters,
    strategicImplications: scenario.valueProvided,
    riskRelevance:
      health === "healthy"
        ? "Current platform evidence indicates controlled presentation risk is low."
        : "Presentation risk should be reviewed against current readiness, trust, and validation evidence.",
    decisionRelevance:
      recommendation === "MVP_release_candidate" || recommendation === "pilot_launch_recommended"
        ? "The demonstration can connect capability evidence to a controlled launch conversation."
        : "The demonstration should remain advisory and focus on what must be remediated next.",
    expectedBusinessValue: "Nexora reduces executive ambiguity by connecting operational signals to explainable decisions.",
    groundedEvidence: Object.freeze(groundedEvidence),
    signature: stableSignature(["d10-demo-narrative", journeyId, groundedEvidence]),
  };
}
