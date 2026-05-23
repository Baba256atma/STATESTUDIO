import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveFinalHardeningInput,
  ProductionCandidateArea,
  ProductionReviewRegistry,
  StabilizationChecklistItem,
  StabilizationChecklistState,
} from "./finalHardeningTypes.ts";

const AREAS: readonly ProductionCandidateArea[] = Object.freeze([
  "readiness_systems",
  "trust_systems",
  "stability_systems",
  "validation_systems",
  "executive_workflows",
  "scenario_workflows",
  "decision_workflows",
  "dashboard_systems",
  "pilot_systems",
]);

function stateForArea(area: ProductionCandidateArea, input: ExecutiveFinalHardeningInput): StabilizationChecklistState {
  switch (area) {
    case "readiness_systems":
      return input.dashboard?.launchAssessment === "production_candidate" || input.dashboard?.launchAssessment === "pilot_ready" ? "verified" : "warning";
    case "trust_systems":
      return input.dashboard?.runtimeTrust === "healthy" ? "verified" : input.dashboard?.runtimeTrust === "critical" ? "blocked" : "warning";
    case "stability_systems":
      return input.dashboard?.interactionStability === "healthy" ? "verified" : input.dashboard?.interactionStability === "critical" ? "blocked" : "warning";
    case "validation_systems":
      return input.validationSuite?.summary.validationPassed ? "verified" : input.validationSuite ? "blocked" : "pending";
    case "executive_workflows":
      return input.demoPresentation?.successEvaluation.assessment === "pilot_ready" || input.demoPresentation?.successEvaluation.assessment === "demo_ready" ? "verified" : "warning";
    case "scenario_workflows":
      return input.demoPresentation?.journeys.some((journey) => journey.journeyId === "scenario_simulation" && !journey.blocked) ? "verified" : "warning";
    case "decision_workflows":
      return input.demoPresentation?.journeys.some((journey) => journey.journeyId === "executive_decision_support" && !journey.blocked) || input.launchGate?.summary.isNexoraReady ? "verified" : "warning";
    case "dashboard_systems":
      return input.dashboard?.healthSurface.status === "healthy" ? "verified" : input.dashboard?.healthSurface.status === "critical" ? "blocked" : "warning";
    case "pilot_systems":
      return input.feedbackLearning?.success.evaluation === "highly_successful" || input.feedbackLearning?.success.evaluation === "successful" ? "verified" : "warning";
  }
}

function evidenceForArea(area: ProductionCandidateArea, input: ExecutiveFinalHardeningInput): string[] {
  return [
    input.dashboard ? `dashboard:${input.dashboard.healthSurface.status}:${input.dashboard.launchAssessment}` : "dashboard:missing",
    input.validationSuite ? `validation:${input.validationSuite.state}` : "validation:missing",
    input.launchGate ? `launch:${input.launchGate.state}` : "launch:missing",
    input.demoPresentation ? `demo:${input.demoPresentation.successEvaluation.assessment}` : "demo:missing",
    input.feedbackLearning ? `feedback:${input.feedbackLearning.success.evaluation}` : "feedback:missing",
    `area:${area}`,
  ];
}

export function buildProductionReviewRegistry(input: ExecutiveFinalHardeningInput): ProductionReviewRegistry {
  const organizationId = input.organizationId?.trim() || input.dashboard?.organizationId || "nexora-default";
  const updatedAt = input.now ?? Date.now();
  const items: StabilizationChecklistItem[] = AREAS.map((area) => {
    const state = stateForArea(area, input);
    const evidence = evidenceForArea(area, input);
    return {
      itemId: stableSignature(["d10-review-item", organizationId, area]).slice(0, 56),
      area,
      title: area.replace(/_/g, " "),
      state,
      explanation: state === "verified" ? `${area} verified for production candidate review.` : `${area} requires stabilization review.`,
      evidence: Object.freeze(evidence),
      required: true,
      signature: stableSignature(["d10-review-item", organizationId, area, state, evidence]),
    };
  });

  return {
    registryId: stableSignature(["d10-review-registry", organizationId]).slice(0, 56),
    organizationId,
    items: Object.freeze(items),
    updatedAt,
    signature: stableSignature(["d10-review-registry", organizationId, items.map((item) => item.signature)]),
  };
}
