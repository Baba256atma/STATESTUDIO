import { ResourceIntelligenceContracts } from "./resourceIntelligenceContracts.ts";
import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIdentity.ts";
import { buildResourceIntelligenceManifest } from "./resourceIntelligenceManifest.ts";
import { ResourceIntelligenceRegistry } from "./resourceIntelligenceRegistry.ts";
import { validateResourceIntelligenceFoundation } from "./resourceIntelligenceValidation.ts";

export const ExecutiveResourceIntelligenceFoundation = Object.freeze({
  identity: ResourceIntelligenceIdentity,
  registry: ResourceIntelligenceRegistry,
  contracts: ResourceIntelligenceContracts,
  manifest: buildResourceIntelligenceManifest(),
  validation: validateResourceIntelligenceFoundation(),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

