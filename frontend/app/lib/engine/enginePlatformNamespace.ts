import * as foundationApi from "./engineIndex.ts";
import * as registryApi from "./engineRegistryIndex.ts";
import * as modelApi from "./engineModelIndex.ts";
import * as validationApi from "./engineValidationIndex.ts";
import * as manifestApi from "./engineManifestIndex.ts";
import type { ExecutiveEnginePlatformDescriptor } from "./enginePlatformTypes.ts";

export const ExecutiveEnginePlatform = Object.freeze({
  foundation: Object.freeze({ ...foundationApi }),
  registry: Object.freeze({ ...registryApi }),
  model: Object.freeze({ ...modelApi }),
  validation: Object.freeze({ ...validationApi }),
  manifest: Object.freeze({ ...manifestApi }),
} as const satisfies ExecutiveEnginePlatformDescriptor);
