import { ExecutiveIntentResolutionCapabilityRegistry, ExecutiveIntentResolutionDomainRegistry, ExecutiveIntentResolutionRegistryManifest } from "./executiveIntentResolutionRegistryIndex.ts";
import type { ExecutiveResolutionModel } from "./executiveIntentResolutionModelTypes.ts";

const structuralModels = Object.freeze({
  domainMapping: Object.freeze({ fields: Object.freeze(["mappingId", "intentReference", "domainReference"] as const) }),
  capabilityMapping: Object.freeze({ fields: Object.freeze(["mappingId", "goalReference", "capabilityReferences"] as const) }),
  outputExpectation: Object.freeze({ fields: Object.freeze(["expectationId", "goalReference", "outputReference"] as const) }),
  confidence: Object.freeze({ fields: Object.freeze(["confidenceId", "confidenceReference"] as const) }),
  priority: Object.freeze({ fields: Object.freeze(["priorityId", "priorityReference"] as const) }),
  lifecycle: Object.freeze({ fields: Object.freeze(["lifecycleId", "stageReference", "statusReference"] as const) }),
  snapshot: Object.freeze({ fields: Object.freeze(["snapshotId", "resolutionReference", "lifecycleReference", "metadataReference"] as const) }),
  summary: Object.freeze({ fields: Object.freeze(["summaryId", "resolutionReference", "outputReference", "statusReference"] as const) }),
} as const);

export const ExecutiveIntentResolutionResolutionModel = Object.freeze({
  id: "eng-3-model-resolution", name: "Executive Intent Resolution Resolution Model",
  fields: Object.freeze(["intentReference", "goalReference", "domainReference", "capabilityReferences", "outputExpectation", "resolutionConfidence", "resolutionPriority", "resolutionStatus", "lifecycleStage", "resolutionSnapshot", "resolutionSummary"]),
  structuralModels,
  registryReferences: Object.freeze({
    domains: ExecutiveIntentResolutionDomainRegistry,
    capabilities: ExecutiveIntentResolutionCapabilityRegistry,
    manifest: ExecutiveIntentResolutionRegistryManifest,
  }),
  owner: "ENG-3", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveResolutionModel);
