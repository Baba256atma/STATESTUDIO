import * as foundation from "./executiveOperationsSuiteFoundationIndex.ts";
import * as registry from "./executiveOperationsSuiteRegistryIndex.ts";
import * as validation from "./executiveOperationsSuiteValidationIndex.ts";
import * as manifest from "./executiveOperationsSuiteManifestIndex.ts";
import { getExecutiveOperationsSuiteMetadata } from "./executiveOperationsSuiteFoundationIndex.ts";
import { getExecutiveOperationsSuiteRegistryMetadata } from "./executiveOperationsSuiteRegistryIndex.ts";
import { getExecutiveOperationsSuiteValidationMetadata } from "./executiveOperationsSuiteValidationIndex.ts";
import { getExecutiveOperationsSuiteManifestInventory, getExecutiveOperationsSuiteManifestMetadata } from "./executiveOperationsSuiteManifestIndex.ts";
import type { ExecutiveOperationsSuitePlatform as PlatformShape, ExecutiveOperationsSuitePlatformMetadata, ExecutiveOperationsSuitePlatformRegistryEntry, ExecutiveOperationsSuitePlatformStatusDescriptor, ExecutiveOperationsSuitePlatformSummary } from "./executiveOperationsSuitePlatformTypes.ts";

export const ExecutiveOperationsSuitePlatformId = "executive-operations-suite-platform" as const;
export const ExecutiveOperationsSuitePlatformName = "Executive Operations Suite Platform" as const;
export const ExecutiveOperationsSuitePlatformDescription = "Canonical immutable platform namespace for the complete Executive Operations Suite." as const;
export const ExecutiveOperationsSuitePlatformVersion = "1.0.0" as const;
export const ExecutiveOperationsSuitePlatformNamespace = "nexora.ops.suite.platform" as const;
export const ExecutiveOperationsSuitePlatformStatus = Object.freeze({
  metadataOnly: true, phase: "Platform", immutable: true, deterministic: true,
  visibility: "Public", releaseStatus: "Draft",
} as const satisfies ExecutiveOperationsSuitePlatformStatusDescriptor);

const component = (id: ExecutiveOperationsSuitePlatformRegistryEntry["id"], name: string, namespace: string, role: ExecutiveOperationsSuitePlatformRegistryEntry["role"]) => Object.freeze({
  id, name, namespace, version: "1.0.0", status: "Available", role,
  metadataOnly: true, immutable: true, publicApi: true,
} as const satisfies ExecutiveOperationsSuitePlatformRegistryEntry);

export const ExecutiveOperationsSuitePlatformComponentRegistry = Object.freeze([
  component("foundation", getExecutiveOperationsSuiteMetadata().name, getExecutiveOperationsSuiteMetadata().namespace, "Foundation"),
  component("registry", getExecutiveOperationsSuiteRegistryMetadata().name, getExecutiveOperationsSuiteRegistryMetadata().namespace, "Registry"),
  component("validation", getExecutiveOperationsSuiteValidationMetadata().name, getExecutiveOperationsSuiteValidationMetadata().namespace, "Validation"),
  component("manifest", getExecutiveOperationsSuiteManifestMetadata().name, getExecutiveOperationsSuiteManifestMetadata().namespace, "Manifest"),
] as const);

const metadata = Object.freeze({
  id: ExecutiveOperationsSuitePlatformId, name: ExecutiveOperationsSuitePlatformName,
  description: ExecutiveOperationsSuitePlatformDescription, version: ExecutiveOperationsSuitePlatformVersion,
  namespace: ExecutiveOperationsSuitePlatformNamespace, status: ExecutiveOperationsSuitePlatformStatus,
  consumedPhases: Object.freeze(["OPS-10:1", "OPS-10:2", "OPS-10:3", "OPS-10:4"]),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuitePlatformMetadata);

const manifestInventory = getExecutiveOperationsSuiteManifestInventory();
const summary = Object.freeze({
  suiteName: ExecutiveOperationsSuitePlatformName, version: ExecutiveOperationsSuitePlatformVersion,
  platformCount: manifestInventory.platformCount, phaseCount: manifestInventory.phaseCount,
  componentCount: ExecutiveOperationsSuitePlatformComponentRegistry.length,
  validationRuleCount: manifestInventory.validationRuleCount,
  readiness: "ReadyForCertification", releaseStage: "Draft",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuitePlatformSummary);

export const ExecutiveOperationsSuitePlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }), registry: Object.freeze({ ...registry }),
  validation: Object.freeze({ ...validation }), manifest: Object.freeze({ ...manifest }),
  metadata, summary,
} as const satisfies PlatformShape);

export const getExecutiveOperationsSuitePlatform = () => ExecutiveOperationsSuitePlatform;
export const getExecutiveOperationsSuitePlatformMetadata = () => metadata;
export const getExecutiveOperationsSuitePlatformSummary = () => summary;
export const getExecutiveOperationsSuitePlatformRegistry = () => ExecutiveOperationsSuitePlatformComponentRegistry;
