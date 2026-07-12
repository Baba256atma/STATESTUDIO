import type { ExecutiveEngineModelDescriptor } from "./engineModelTypes.ts";
export const ExecutivePlanModel = Object.freeze({
  id: "executive-plan", name: "Executive Plan", description: "Conceptual schema for a future Engine plan without generation or execution.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["planId", "requestReference", "intentReference", "goalReferences", "planType", "orderedStepReferences", "requiredCapabilityReferences", "requiredPlatformReferences", "dependencyReferences", "constraintReferences", "expectedOutcomeReferences", "lifecycleStatus"]),
  referencePolicies: Object.freeze(["steps-by-reference", "platforms-by-public-reference", "dependencies-by-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
export const ExecutivePlanStepModel = Object.freeze({
  id: "executive-plan-step", name: "Executive Plan Step", description: "Conceptual schema for one ordered descriptive plan step.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["stepId", "sequence", "title", "responsibility", "ownerLayer", "capabilityReference", "inputReferences", "outputReferences", "dependencyReferences", "blockingStatus"]),
  referencePolicies: Object.freeze(["inputs-by-reference", "outputs-by-reference", "owner-layer-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
export const ExecutiveCoordinationInstructionModel = Object.freeze({
  id: "executive-coordination-instruction", name: "Executive Coordination Instruction", description: "Conceptual coordination instruction schema without dispatch or execution.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["instructionId", "planReference", "stepReference", "targetLayer", "targetPlatform", "targetCapability", "requestedOperationMetadata", "inputContractReferences", "expectedOutputContractReferences", "dependencyReferences", "executionPolicyMetadata", "status"]),
  referencePolicies: Object.freeze(["target-by-public-reference", "contracts-by-reference", "no-dispatch"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
