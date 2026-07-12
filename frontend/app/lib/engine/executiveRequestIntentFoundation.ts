import { ExecutiveRequestIntentContracts } from "./executiveRequestIntentContracts.ts";
import { ExecutiveRequestIntentMetadata } from "./executiveRequestIntentMetadata.ts";
import { ExecutiveRequestIntentRegistry } from "./executiveRequestIntentRegistry.ts";
import type { ExecutiveRequestFoundation } from "./executiveRequestIntentTypes.ts";

export const ExecutiveRequestIntentFoundation = Object.freeze({
  contracts: ExecutiveRequestIntentContracts,
  registry: ExecutiveRequestIntentRegistry,
  metadata: ExecutiveRequestIntentMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveRequestFoundation);

export const getExecutiveRequestIntentFoundation = () => ExecutiveRequestIntentFoundation;
export const getExecutiveRequestIntentRegistry = () => ExecutiveRequestIntentRegistry;
export const getExecutiveRequestIntentMetadata = () => ExecutiveRequestIntentMetadata;
