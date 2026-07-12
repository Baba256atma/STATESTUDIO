import type { ExecutiveEngineModelDescriptor } from "./engineModelTypes.ts";
export const ExecutiveContextModel = Object.freeze({
  id: "executive-context", name: "Executive Context", description: "Conceptual schema for context references required by the Engine.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["contextId", "requestReference", "tenantReference", "workspaceReference", "actorReferences", "businessDomainReferences", "operationDomainReferences", "relevantEntityReferences", "dataSourceReferences", "timeHorizonMetadata", "constraintReferences", "assumptionReferences", "contextCompletenessStatus"]),
  referencePolicies: Object.freeze(["external-entities-by-reference", "data-sources-by-reference", "tenant-aware-by-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
