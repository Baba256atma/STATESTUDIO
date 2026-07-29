/**
 * RTC-1:8 — Executive Context Freeze Public API.
 *
 * Canonical public API registry dynamically derived from frozen exports.
 * Counts are never hard-coded.
 *
 * Ownership: owned exclusively by RTC-1:8.
 */

import { EXECUTIVE_CONTEXT_RUNTIME_LOCK } from "./executiveContextFreezeLock.ts";

/** Frozen public contract identities. */
const FROZEN_PUBLIC_CONTRACTS = Object.freeze([
  "ExecutiveContext",
  "RuntimePlatform",
  "RuntimeLifecycle",
  "RuntimeRegistry",
  "RuntimeValidation",
  "RuntimeManifest",
] as const);

/** Frozen export surface consumed by Public Index. */
const FROZEN_EXPORT_SURFACE = Object.freeze([
  "ExecutiveContextRuntimeFreeze",
  "ExecutiveContextFreezeLock",
  "ExecutiveContextFreezeBaselines",
  "ExecutiveContextFreezeCompatibility",
  "ExecutiveContextFreezePublicApi",
  "ExecutiveContextFreezeMetadata",
  "ExecutiveContextFreezeManifest",
  "getExecutiveContextRuntimeFreezeSummary",
] as const);

/** Frozen service identities from Platform. */
const FROZEN_SERVICE_IDENTITIES = Object.freeze([
  "ExecutiveContextService",
  "ExecutiveContextRegistryService",
  "ExecutiveContextLifecycleService",
  "ExecutiveContextSnapshotService",
  "ExecutiveContextEventService",
  "ExecutiveContextMetadataService",
  "ExecutiveContextInspectionService",
  "ExecutiveContextPlatformService",
] as const);

/** Frozen metadata identities. */
const FROZEN_METADATA_IDENTITIES = Object.freeze([
  "RuntimeIdentity",
  "PlatformVersion",
  "ArchitectureVersion",
  "FreezeTimestamp",
  "CertificationVersion",
  "CanonicalNamespace",
  "ReleaseStatus",
] as const);

/** Frozen compatibility declaration names. */
const FROZEN_COMPATIBILITY_DECLARATIONS = Object.freeze([
  "Executive Journal Runtime",
  "Executive Timeline Runtime",
  "Executive Stage Runtime",
  "Executive Workspace Runtime",
  "Executive Assistant Runtime",
  "Director Runtime",
  "Runtime Context Consumers",
  "Future RTC Modules",
] as const);

const registerEntries = <T extends string>(
  kind: string,
  source: readonly T[],
) =>
  Object.freeze(
    source.map((exportName, index) =>
      Object.freeze({
        apiIdentifier: `RTC-1:8/Api/${kind}/${String(index + 1).padStart(2, "0")}`,
        exportName,
        kind,
        order: index + 1,
        frozen: true as const,
        executable: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

const contractEntries = registerEntries("Contract", FROZEN_PUBLIC_CONTRACTS);
const exportEntries = registerEntries("Export", FROZEN_EXPORT_SURFACE);
const serviceEntries = registerEntries("Service", FROZEN_SERVICE_IDENTITIES);
const metadataEntries = registerEntries("Metadata", FROZEN_METADATA_IDENTITIES);

/**
 * Canonical public API registry.
 * Inventory counts are dynamically derived from frozen export arrays.
 */
export const ExecutiveContextFreezePublicApi = Object.freeze({
  publicApiId: "RTC-1:8/PublicApiRegistry",
  lockIdentifier: EXECUTIVE_CONTEXT_RUNTIME_LOCK,
  contracts: contractEntries,
  exports: exportEntries,
  services: serviceEntries,
  metadataIdentities: metadataEntries,
  compatibilityDeclarations: FROZEN_COMPATIBILITY_DECLARATIONS,
  inventory: Object.freeze({
    contractCount: contractEntries.length,
    exportCount: exportEntries.length,
    serviceCount: serviceEntries.length,
    metadataIdentityCount: metadataEntries.length,
    compatibilityDeclarationCount: FROZEN_COMPATIBILITY_DECLARATIONS.length,
    totalRegistryEntries:
      contractEntries.length +
      exportEntries.length +
      serviceEntries.length +
      metadataEntries.length,
  }),
  sourceArrays: Object.freeze({
    contracts: FROZEN_PUBLIC_CONTRACTS,
    exports: FROZEN_EXPORT_SURFACE,
    services: FROZEN_SERVICE_IDENTITIES,
    metadataIdentities: FROZEN_METADATA_IDENTITIES,
    compatibilityDeclarations: FROZEN_COMPATIBILITY_DECLARATIONS,
  }),
  introducesNewApis: false as const,
  hardCodedCounts: false as const,
  consumerEntryDeclaration: Object.freeze({
    file: "executiveContextRuntimePublicIndex.ts",
    declaration:
      "Sole supported Executive Context Runtime consumer entry after Public Index.",
    freezeDependency: "executiveContextRuntimeFreeze.ts",
    lockIdentifier: EXECUTIVE_CONTEXT_RUNTIME_LOCK,
    directArchitecturalImportsPermitted: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Convenience aliases. */
export const ExecutiveContextFrozenPublicContracts = FROZEN_PUBLIC_CONTRACTS;
export const ExecutiveContextFrozenExportSurface = FROZEN_EXPORT_SURFACE;
