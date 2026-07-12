import type { ExecutiveEngineModelDescriptor } from "./engineModelTypes.ts";
export const ExecutiveRequestModel = Object.freeze({
  id: "executive-request", name: "Executive Request", description: "Conceptual schema for a high-level request entering the Executive Engine.",
  owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["requestId", "requestType", "title", "description", "source", "requesterReference", "tenantReference", "workspaceReference", "priority", "urgency", "requestedOutcome", "submittedTimestampMetadata", "lifecycleStatus"]),
  referencePolicies: Object.freeze(["tenant-aware-by-reference", "requester-by-reference", "workspace-by-reference"]),
  publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3",
  runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);
