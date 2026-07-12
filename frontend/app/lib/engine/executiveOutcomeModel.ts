import type { ExecutiveEngineModelDescriptor } from "./engineModelTypes.ts";
export const ExecutiveOutcomeModel = Object.freeze({
  id: "executive-outcome", name: "Executive Outcome", description: "Conceptual final outcome schema without recommendation or summary generation.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["outcomeId", "requestReference", "intentReference", "goalReferences", "planReference", "decisionReferences", "findingReferences", "recommendationReferences", "riskReferences", "confidenceMetadata", "executiveSummaryReference", "advisorHandoffMetadata", "completionStatus"]),
  referencePolicies: Object.freeze(["findings-by-reference", "recommendations-by-reference", "advisor-handoff-metadata-only"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
