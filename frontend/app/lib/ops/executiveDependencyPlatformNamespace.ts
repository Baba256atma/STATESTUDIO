import * as foundation from "./dependencyIntelligenceIndex.ts";
import * as registry from "./dependencyRegistryIndex.ts";
import * as model from "./dependencyModelIndex.ts";
import * as validation from "./dependencyValidationIndex.ts";
import * as manifest from "./dependencyManifestIndex.ts";
import { ExecutiveDependencyPlatformMetadata } from "./executiveDependencyPlatformMetadata.ts";
import type { ExecutiveDependencyPlatformNamespace } from "./executiveDependencyPlatformTypes.ts";

export const ExecutiveDependencyPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  metadata: ExecutiveDependencyPlatformMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveDependencyPlatformNamespace);
