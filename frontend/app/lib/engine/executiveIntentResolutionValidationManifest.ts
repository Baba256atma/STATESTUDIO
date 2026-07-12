import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";
import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionFoundationValidation } from "./executiveIntentResolutionFoundationValidation.ts";
import { ExecutiveIntentResolutionModelValidation } from "./executiveIntentResolutionModelValidation.ts";
import { ExecutiveIntentResolutionRegistryValidation } from "./executiveIntentResolutionRegistryValidation.ts";
import type { ExecutiveValidationManifest } from "./executiveIntentResolutionValidationTypes.ts";

export const ExecutiveIntentResolutionValidationManifest = Object.freeze({
  ownership: "ENG-3",
  scope: Object.freeze(["ENG-3:1", "ENG-3:2", "ENG-3:3"] as const),
  dependencies: Object.freeze([
    Object.freeze({ publicIndex: "executiveIntentResolutionIndex.ts", artifact: ExecutiveIntentResolutionFoundation }),
    Object.freeze({ publicIndex: "executiveIntentResolutionRegistryIndex.ts", artifact: ExecutiveIntentResolutionRegistryPlatform }),
    Object.freeze({ publicIndex: "executiveIntentResolutionModelIndex.ts", artifact: ExecutiveIntentResolutionModelPlatform }),
  ]),
  validationGroups: Object.freeze([
    ExecutiveIntentResolutionFoundationValidation,
    ExecutiveIntentResolutionRegistryValidation,
    ExecutiveIntentResolutionModelValidation,
  ]),
  validationGates: Object.freeze([
    Object.freeze({ id: "eng-3-gate-foundation", name: "Foundation Gate", category: "Foundation", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-registry", name: "Registry Gate", category: "Registry", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-model", name: "Model Gate", category: "Model", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-dependency", name: "Dependency Gate", category: "Dependencies", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-ownership", name: "Ownership Gate", category: "Ownership", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-compatibility", name: "Compatibility Gate", category: "Compatibility", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-public-api", name: "Public API Gate", category: "Public API", status: "Passed", metadataOnly: true, immutable: true } as const),
    Object.freeze({ id: "eng-3-gate-release", name: "Release Gate", category: "Release Readiness", status: "Passed", metadataOnly: true, immutable: true } as const),
  ]),
  categories: Object.freeze(["Foundation", "Registry", "Model", "Dependencies", "Ownership", "Compatibility", "Public API", "Metadata", "Immutability", "Release Readiness"] as const),
  severities: Object.freeze(["Informational", "Warning", "Error", "Critical"] as const),
  statuses: Object.freeze(["Pending", "Passed", "Failed", "Certified"] as const),
  compatibility: Object.freeze({ foundation: "Compatible", registry: "Compatible", model: "Compatible", ownershipSafe: true }),
  version: "1.0.0", stability: "Draft", certificationState: "ValidationComplete",
  publicationState: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveValidationManifest);
