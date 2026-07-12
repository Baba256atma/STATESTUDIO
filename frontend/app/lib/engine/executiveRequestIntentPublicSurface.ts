import type { ExecutiveRequestIntentPublicSurface as PublicSurface } from "./executiveRequestIntentManifestTypes.ts";

export const ExecutiveRequestIntentPublicSurface = Object.freeze({
  namespace: "nexora.engine.executive.request-intent.public",
  apiInventory: Object.freeze([
    Object.freeze({ phase: "ENG-2:1", publicIndex: "executiveRequestIntentIndex.ts", exports: Object.freeze([
      "ExecutiveRequestIntentFoundation", "ExecutiveRequestIntentContracts", "ExecutiveRequestIntentRegistry",
      "ExecutiveRequestIntentMetadata", "getExecutiveRequestIntentFoundation", "getExecutiveRequestIntentRegistry",
      "getExecutiveRequestIntentMetadata",
    ]) }),
    Object.freeze({ phase: "ENG-2:2", publicIndex: "executiveRequestIntentRegistryIndex.ts", exports: Object.freeze([
      "ExecutiveRequestCategoryRegistry", "ExecutiveIntentRegistry", "ExecutiveRequestPriorityRegistry",
      "ExecutiveRequestStatusRegistry", "ExecutiveRequestScopeRegistry", "ExecutiveRequestSourceRegistry",
      "ExecutiveRequestClassificationRegistry", "ExecutiveRequestContextRegistry", "ExecutiveRequestIntentRegistryManifest",
      "getExecutiveRequestIntentRegistryManifest", "getExecutiveRequestRegistrySummary",
    ]) }),
    Object.freeze({ phase: "ENG-2:3", publicIndex: "executiveRequestIntentModelIndex.ts", exports: Object.freeze([
      "ExecutiveRequestIntentRequestModel", "ExecutiveRequestIntentIntentModel", "ExecutiveRequestIntentClassificationModel",
      "ExecutiveRequestIntentContextModel", "ExecutiveRequestIntentMetadataModel", "ExecutiveRequestIntentLifecycleModel",
      "ExecutiveRequestIntentRelationshipModel", "ExecutiveRequestIntentModelManifest",
      "getExecutiveRequestIntentModelManifest", "getExecutiveRequestIntentModelSummary",
    ]) }),
    Object.freeze({ phase: "ENG-2:4", publicIndex: "executiveRequestIntentValidationIndex.ts", exports: Object.freeze([
      "ExecutiveRequestIntentFoundationValidation", "ExecutiveRequestIntentRegistryValidation",
      "ExecutiveRequestIntentModelValidation", "ExecutiveRequestIntentOwnershipValidation",
      "ExecutiveRequestIntentPublicApiValidation", "ExecutiveRequestIntentValidationManifest",
      "getExecutiveRequestIntentValidationManifest", "getExecutiveRequestIntentValidationSummary",
    ]) }),
  ]),
  apiOwnership: "ENG-2", apiStability: "StableDraft", exportPolicy: "ExplicitOnly",
  collisionPolicy: "ExecutiveRequestIntentPrefix",
  antiDuplicationPolicy: "Every public symbol remains phase-owned, explicitly exported, and collision-safe; no prior phase artifact is redefined.",
  metadataOnly: true, immutable: true,
} as const satisfies PublicSurface);
