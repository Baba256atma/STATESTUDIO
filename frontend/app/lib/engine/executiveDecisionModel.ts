import type { ExecutiveEngineModelDescriptor } from "./engineModelTypes.ts";
export const ExecutiveReasoningRecordModel = Object.freeze({
  id: "executive-reasoning-record", name: "Executive Reasoning Record", description: "Safe auditable reasoning summary and evidence-reference schema; excludes private reasoning traces.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["reasoningRecordId", "requestReference", "reasoningCategory", "inputReferences", "observationReferences", "inferenceReferences", "assumptionReferences", "evidenceReferences", "uncertaintyMetadata", "conclusionReferences", "lifecycleStatus"]),
  referencePolicies: Object.freeze(["evidence-by-reference", "safe-summary-only", "no-chain-of-thought"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
export const ExecutiveDecisionModel = Object.freeze({
  id: "executive-decision", name: "Executive Decision", description: "Conceptual schema for a future decision without calculation or selection.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["decisionId", "requestReference", "goalReference", "decisionType", "decisionStatement", "consideredOptionReferences", "selectedOptionReference", "evidenceReferences", "reasoningRecordReferences", "riskReferences", "confidenceMetadata", "approvalStatus", "lifecycleStatus"]),
  referencePolicies: Object.freeze(["options-by-reference", "evidence-by-reference", "risks-by-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
export const ExecutiveDecisionOptionModel = Object.freeze({
  id: "executive-decision-option", name: "Executive Decision Option", description: "Conceptual option schema without scoring or ranking behavior.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["optionId", "title", "description", "benefitReferences", "costReferences", "riskReferences", "constraintReferences", "scoreMetadata", "status"]),
  referencePolicies: Object.freeze(["benefits-by-reference", "costs-by-reference", "score-metadata-only"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
