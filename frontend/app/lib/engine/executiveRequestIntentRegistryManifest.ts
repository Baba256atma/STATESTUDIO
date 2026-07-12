import { ExecutiveIntentRegistry } from "./executiveIntentRegistry.ts";
import { ExecutiveRequestCategoryRegistry } from "./executiveRequestCategoryRegistry.ts";
import { ExecutiveRequestClassificationRegistry } from "./executiveRequestClassificationRegistry.ts";
import { ExecutiveRequestContextRegistry } from "./executiveRequestContextRegistry.ts";
import { ExecutiveRequestPriorityRegistry } from "./executiveRequestPriorityRegistry.ts";
import { ExecutiveRequestScopeRegistry } from "./executiveRequestScopeRegistry.ts";
import { ExecutiveRequestSourceRegistry } from "./executiveRequestSourceRegistry.ts";
import { ExecutiveRequestStatusRegistry } from "./executiveRequestStatusRegistry.ts";
import type { ExecutiveRequestIntentRegistryManifestDescriptor, RegistryCollection, RegistryGroupId, RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const collection = (groupId: RegistryGroupId, name: string, entries: readonly RegistryMetadata[]) => Object.freeze({
  groupId, name, entryCount: entries.length, entries,
  namespace: "nexora.engine.executive.request-intent.registry",
  version: "1.0.0", metadataOnly: true, immutable: true,
} as const satisfies RegistryCollection);

const registryInventory = Object.freeze([
  collection("category", "Request Categories", ExecutiveRequestCategoryRegistry),
  collection("intent", "Executive Intents", ExecutiveIntentRegistry),
  collection("priority", "Request Priorities", ExecutiveRequestPriorityRegistry),
  collection("status", "Request Statuses", ExecutiveRequestStatusRegistry),
  collection("scope", "Request Scopes", ExecutiveRequestScopeRegistry),
  collection("source", "Request Sources", ExecutiveRequestSourceRegistry),
  collection("classification", "Request Classifications", ExecutiveRequestClassificationRegistry),
  collection("context", "Request Context References", ExecutiveRequestContextRegistry),
] as const);

const registrySummary = Object.freeze({
  registryCount: 8,
  entryCount: registryInventory.reduce((total, registry) => total + registry.entryCount, 0),
  namespace: "nexora.engine.executive.request-intent.registry",
  version: "1.0.0", phase: "ENG-2:2",
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveRequestIntentRegistryManifest = Object.freeze({
  metadata: Object.freeze({
    id: "ENG-2:2", name: "Executive Request & Intent Registry",
    namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
    releaseStatus: "Draft", metadataOnly: true, immutable: true, deterministic: true,
  }),
  inventory: registryInventory,
  approvedNamespace: "nexora.engine.executive.request-intent.registry",
  version: "1.0.0",
  summary: registrySummary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveRequestIntentRegistryManifestDescriptor);

export const getExecutiveRequestIntentRegistryManifest = () => ExecutiveRequestIntentRegistryManifest;
export const getExecutiveRequestRegistrySummary = () => registrySummary;
