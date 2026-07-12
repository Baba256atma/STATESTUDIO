import { ExecutiveIntentResolutionDomainRegistry, ExecutiveIntentResolutionIntentRegistry } from "./executiveIntentResolutionRegistryIndex.ts";
import type { ExecutiveIntentModel } from "./executiveIntentResolutionModelTypes.ts";

export const ExecutiveIntentResolutionIntentModel = Object.freeze({
  id: "eng-3-model-intent", name: "Executive Intent Resolution Intent Model",
  fields: Object.freeze(["intentId", "intentType", "intentCategory", "intentOwnership", "intentScope", "businessDomain", "priority", "confidence", "status", "lifecycleStage"]),
  registryReferences: Object.freeze({
    intentTypes: ExecutiveIntentResolutionIntentRegistry,
    domains: ExecutiveIntentResolutionDomainRegistry,
  }),
  owner: "ENG-3", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveIntentModel);
