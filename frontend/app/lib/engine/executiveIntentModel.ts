import type { ExecutiveEngineModelDescriptor } from "./engineModelTypes.ts";
export const ExecutiveIntentModel = Object.freeze({
  id: "executive-intent", name: "Executive Intent", description: "Conceptual schema for intent associated with an executive request.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["intentId", "requestReference", "intentCategory", "intentDescription", "confidenceMetadata", "ambiguityStatus", "goalReferences", "relevantCapabilityReferences", "candidatePlatformReferences", "lifecycleStatus"]),
  referencePolicies: Object.freeze(["request-by-reference", "goals-by-reference", "platforms-by-public-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
export const ExecutiveGoalModel = Object.freeze({
  id: "executive-goal", name: "Executive Goal", description: "Conceptual schema for one goal associated with executive intent.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["goalId", "goalType", "title", "description", "desiredOutcome", "successCriteria", "priority", "constraintReferences", "dependencyReferences", "status"]),
  referencePolicies: Object.freeze(["constraints-by-reference", "dependencies-by-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
