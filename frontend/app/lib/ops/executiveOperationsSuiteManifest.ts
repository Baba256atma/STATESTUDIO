import { ExecutiveOperationsSuiteFoundation, getExecutiveOperationsSuiteMetadata } from "./executiveOperationsSuiteFoundationIndex.ts";
import { ExecutiveOperationsSuitePhaseRegistry, ExecutiveOperationsSuitePlatformRegistry, ExecutiveOperationsSuiteRegistryManifest } from "./executiveOperationsSuiteRegistryIndex.ts";
import { ExecutiveOperationsSuiteValidationManifest, ExecutiveOperationsSuiteValidationMetadata, ExecutiveOperationsSuiteValidationRegistry } from "./executiveOperationsSuiteValidationIndex.ts";
import { ExecutiveOperationsSuiteManifestDescription, ExecutiveOperationsSuiteManifestId, ExecutiveOperationsSuiteManifestName, ExecutiveOperationsSuiteManifestNamespace, ExecutiveOperationsSuiteManifestRegistry, ExecutiveOperationsSuiteManifestStatus, ExecutiveOperationsSuiteManifestVersion } from "./executiveOperationsSuiteManifestRegistry.ts";
import type { ExecutiveOperationsSuiteManifest as ManifestShape, ExecutiveOperationsSuiteManifestInventory, ExecutiveOperationsSuiteManifestMetadata, ExecutiveOperationsSuiteManifestSummary } from "./executiveOperationsSuiteManifestTypes.ts";

const metadata = Object.freeze({
  id: ExecutiveOperationsSuiteManifestId, name: ExecutiveOperationsSuiteManifestName,
  description: ExecutiveOperationsSuiteManifestDescription, version: ExecutiveOperationsSuiteManifestVersion,
  namespace: ExecutiveOperationsSuiteManifestNamespace, status: ExecutiveOperationsSuiteManifestStatus,
  consumedPhases: Object.freeze(["OPS-10:1", "OPS-10:2", "OPS-10:3"]),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuiteManifestMetadata);

const inventory = Object.freeze({
  platformCount: 9, phaseCount: 9, foundationCount: 10, registryCount: 9,
  validationRuleCount: ExecutiveOperationsSuiteValidationMetadata.validationCount,
  componentCount: 3, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveOperationsSuiteManifestInventory);

const dependencyMap = Object.freeze(ExecutiveOperationsSuitePhaseRegistry.map((entry) => Object.freeze({
  phaseId: entry.phaseId, platformId: entry.platformId, order: entry.order,
  consumes: entry.consumes, provides: entry.provides, metadataOnly: true,
})));
const compatibility = Object.freeze(ExecutiveOperationsSuitePlatformRegistry.map((entry) => Object.freeze({
  platformId: entry.platformId, phaseId: entry.phaseId, foundationSection: entry.foundationSection,
  publicApiStatus: entry.publicApiStatus, compatibilityStatus: "Compatible", metadataOnly: true,
})));
const publicApi = Object.freeze({
  foundation: Object.freeze(["ExecutiveOperationsSuiteFoundation", "getExecutiveOperationsSuiteFoundation", "getExecutiveOperationsSuiteMetadata", "getExecutiveOperationsSuiteManifest"]),
  registry: Object.freeze(["ExecutiveOperationsSuitePlatformRegistry", "ExecutiveOperationsSuitePhaseRegistry", "ExecutiveOperationsSuiteRegistryManifest", "getExecutiveOperationsSuitePlatformById", "getExecutiveOperationsSuitePhaseById"]),
  validation: Object.freeze(["ExecutiveOperationsSuiteValidation", "ExecutiveOperationsSuiteValidationRegistry", "ExecutiveOperationsSuiteValidationManifest", "getExecutiveOperationsSuiteValidationRuleById", "getExecutiveOperationsSuiteValidationRulesByCategory"]),
  internalApisExposed: false, stableExportsOnly: true, metadataOnly: true,
});
const architecture = Object.freeze({
  architecturalScope: "Complete Executive Operations Suite",
  metadataOnlyArchitecture: true,
  immutablePolicy: "FrozenReadonlyExports", deterministicPolicy: "StableMetadataOutputs",
  publicApiPolicy: "ApprovedPublicIndicesOnly", importPolicy: "NoInternalImports",
  layeringPolicy: "FoundationRegistryValidationManifest", releasePolicy: "DraftUntilPlatformAggregation",
});
const boundaries = Object.freeze(["execution", "orchestration", "scheduling", "automation", "persistence", "networking", "UI", "React", "monitoring engine", "dashboard rendering", "certification", "runtime validation"]);
const summary = Object.freeze({
  suiteName: getExecutiveOperationsSuiteMetadata().name, version: "1.0.0",
  platformCount: 9, phaseCount: 9, consumedComponents: 3,
  readinessState: "ReadyForPlatformAggregation", releaseStage: "Draft", metadataOnly: true,
} as const satisfies ExecutiveOperationsSuiteManifestSummary);

export const ExecutiveOperationsSuiteManifest = Object.freeze({
  metadata,
  foundation: ExecutiveOperationsSuiteFoundation,
  registry: Object.freeze({ manifest: ExecutiveOperationsSuiteRegistryManifest, components: ExecutiveOperationsSuiteManifestRegistry }),
  validation: Object.freeze({ manifest: ExecutiveOperationsSuiteValidationManifest, registry: ExecutiveOperationsSuiteValidationRegistry }),
  inventory, dependencyMap, compatibility, publicApi, architecture, boundaries, summary,
} as const satisfies ManifestShape);

export const getExecutiveOperationsSuiteManifest = () => ExecutiveOperationsSuiteManifest;
export const getExecutiveOperationsSuiteManifestMetadata = () => metadata;
export const getExecutiveOperationsSuiteManifestInventory = () => inventory;
export const getExecutiveOperationsSuiteManifestSummary = () => summary;
export const getExecutiveOperationsSuiteDependencyMap = () => dependencyMap;
export const getExecutiveOperationsSuiteCompatibility = () => compatibility;
