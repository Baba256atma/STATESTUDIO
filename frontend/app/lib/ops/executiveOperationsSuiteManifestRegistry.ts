import { ExecutiveOperationsSuiteFoundationVersion, getExecutiveOperationsSuiteMetadata } from "./executiveOperationsSuiteFoundationIndex.ts";
import { ExecutiveOperationsSuiteRegistryVersion, getExecutiveOperationsSuiteRegistryMetadata } from "./executiveOperationsSuiteRegistryIndex.ts";
import { ExecutiveOperationsSuiteValidationVersion, getExecutiveOperationsSuiteValidationMetadata } from "./executiveOperationsSuiteValidationIndex.ts";
import type { ExecutiveOperationsSuiteManifestRegistryEntry, ExecutiveOperationsSuiteManifestStatus as ManifestStatusShape } from "./executiveOperationsSuiteManifestTypes.ts";

export const ExecutiveOperationsSuiteManifestId = "executive-operations-suite-manifest" as const;
export const ExecutiveOperationsSuiteManifestName = "Executive Operations Suite Manifest" as const;
export const ExecutiveOperationsSuiteManifestDescription = "Canonical immutable architectural manifest for the complete Executive Operations Suite." as const;
export const ExecutiveOperationsSuiteManifestVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteManifestNamespace = "nexora.ops.suite.manifest" as const;
export const ExecutiveOperationsSuiteManifestStatus = Object.freeze({
  metadataOnly: true, phase: "Manifest", immutable: true, deterministic: true,
  visibility: "Public", releaseStatus: "Draft",
} as const satisfies ManifestStatusShape);

export const ExecutiveOperationsSuiteManifestRegistry = Object.freeze([
  Object.freeze({ id: "OPS-10:1", name: getExecutiveOperationsSuiteMetadata().name,
    namespace: getExecutiveOperationsSuiteMetadata().namespace, version: ExecutiveOperationsSuiteFoundationVersion,
    status: "Available", role: "Foundation", immutable: true, metadataOnly: true,
  } as const satisfies ExecutiveOperationsSuiteManifestRegistryEntry),
  Object.freeze({ id: "OPS-10:2", name: getExecutiveOperationsSuiteRegistryMetadata().name,
    namespace: getExecutiveOperationsSuiteRegistryMetadata().namespace, version: ExecutiveOperationsSuiteRegistryVersion,
    status: "Available", role: "Registry", immutable: true, metadataOnly: true,
  } as const satisfies ExecutiveOperationsSuiteManifestRegistryEntry),
  Object.freeze({ id: "OPS-10:3", name: getExecutiveOperationsSuiteValidationMetadata().name,
    namespace: getExecutiveOperationsSuiteValidationMetadata().namespace, version: ExecutiveOperationsSuiteValidationVersion,
    status: "Available", role: "Validation", immutable: true, metadataOnly: true,
  } as const satisfies ExecutiveOperationsSuiteManifestRegistryEntry),
] as const);
