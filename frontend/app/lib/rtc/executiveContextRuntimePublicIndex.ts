/**
 * RTC-1:9 — Executive Context Runtime Public Index.
 *
 * Sole public consumer entry point for the Executive Context Runtime.
 * Imports only the Freeze artifact. Republishes only. No implementation.
 *
 * Ownership: owned exclusively by RTC-1:9.
 *
 * Public exports (exactly 12):
 *   publicIndexId
 *   publicIndexName
 *   publicIndexNamespace
 *   publicIndexVersion
 *   publicIndexStatus
 *   publicIndexReadiness
 *   publicApiSurface
 *   publicApiCount
 *   publicNamespaceSections
 *   publicReleaseMetadata
 *   executiveContextRuntimePublicIndexMetadata
 *   executiveContextRuntimePublicIndex
 */

import { ExecutiveContextRuntimeFreeze } from "./executiveContextRuntimeFreeze.ts";

const freeze = ExecutiveContextRuntimeFreeze;

/** Canonical Public Index identity constants. */
export const publicIndexId =
  "RTC-1:9/ExecutiveContextRuntimePublicIndex" as const;

export const publicIndexName =
  "Executive Context Runtime Public Index" as const;

export const publicIndexNamespace =
  "nexora.runtime.executive-context.public-index" as const;

export const publicIndexVersion = "1.0.0" as const;

export const publicIndexStatus =
  "Released · Certified · Frozen · Stable" as const;

export const publicIndexReadiness = "ReadyForConsumer" as const;

/** Canonical namespace section order — immutable. */
const NAMESPACE_SECTION_NAMES = Object.freeze([
  "Identity",
  "Public Entry",
  "Dependencies",
  "Public API Registry",
  "Compatibility",
  "Architecture",
  "Release Status",
  "Readiness",
  "Release Information",
] as const);

const registerPublicApiEntry = (
  kind: string,
  exportName: string,
  order: number,
  sourcePhase: string,
) =>
  Object.freeze({
    apiIdentifier: `RTC-1:9/Api/${kind}/${String(order).padStart(2, "0")}`,
    exportName,
    kind,
    sourcePhase,
    order,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Public API Registry dynamically derived from the Freeze artifact.
 * Count is never hard-coded.
 */
const derivedPublicApiSurface = Object.freeze([
  ...freeze.publicApi.contracts.map((entry, index) =>
    registerPublicApiEntry(
      "Contract",
      entry.exportName,
      index + 1,
      freeze.identity.id,
    )
  ),
  ...freeze.publicApi.services.map((entry, index) =>
    registerPublicApiEntry(
      "Service",
      entry.exportName,
      freeze.publicApi.contracts.length + index + 1,
      freeze.identity.id,
    )
  ),
  ...freeze.publicApi.compatibilityDeclarations.map((name, index) =>
    registerPublicApiEntry(
      "Compatibility",
      name,
      freeze.publicApi.contracts.length +
        freeze.publicApi.services.length +
        index +
        1,
      freeze.identity.id,
    )
  ),
  ...freeze.publicApi.metadataIdentities.map((entry, index) =>
    registerPublicApiEntry(
      "ReleaseMetadata",
      entry.exportName,
      freeze.publicApi.contracts.length +
        freeze.publicApi.services.length +
        freeze.publicApi.compatibilityDeclarations.length +
        index +
        1,
      freeze.identity.id,
    )
  ),
  ...freeze.frozenPublicContracts.map((name, index) =>
    registerPublicApiEntry(
      "RuntimeDescriptor",
      name,
      freeze.publicApi.contracts.length +
        freeze.publicApi.services.length +
        freeze.publicApi.compatibilityDeclarations.length +
        freeze.publicApi.metadataIdentities.length +
        index +
        1,
      freeze.identity.id,
    )
  ),
]);

export const publicApiSurface = derivedPublicApiSurface;

export const publicApiCount = publicApiSurface.length;

/** Release metadata republished from Freeze. */
export const publicReleaseMetadata = Object.freeze({
  releaseVersion: freeze.metadata.releaseVersion,
  architectureVersion: freeze.metadata.architectureVersion,
  freezeTimestamp: freeze.metadata.freezeTimestamp,
  certificationVersion: freeze.metadata.certificationVersion,
  canonicalNamespace: publicIndexNamespace,
  releaseStatuses: freeze.releaseStatuses,
  releaseStatus: publicIndexStatus,
  readiness: publicIndexReadiness,
  lockIdentifier: freeze.lockIdentifier,
  sourceFreeze: freeze.identity.id,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Public Index metadata aggregate. */
export const executiveContextRuntimePublicIndexMetadata = Object.freeze({
  id: publicIndexId,
  name: publicIndexName,
  namespace: publicIndexNamespace,
  version: publicIndexVersion,
  status: publicIndexStatus,
  readiness: publicIndexReadiness,
  phaseId: "RTC-1:9" as const,
  layer: "Runtime Layer" as const,
  architecture: "NPA-T vNext" as const,
  sourceFreeze: freeze.identity.id,
  lockIdentifier: freeze.lockIdentifier,
  freezeDependency: "executiveContextRuntimeFreeze.ts" as const,
  publicApiCount,
  namespaceSectionCount: NAMESPACE_SECTION_NAMES.length,
  freezeDependencyCount: 1 as const,
  soleConsumerEntry: true as const,
  freezeOnlyDependency: true as const,
  republishesOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Compatibility republished from Freeze. */
const publicCompatibility = Object.freeze({
  declarations: freeze.compatibilityDeclarations,
  names: freeze.compatibilityNames,
  declarationCount: freeze.compatibilityDeclarations.length,
  immutableForRelease: true as const,
  targets: Object.freeze([
    "Executive Journal Runtime",
    "Executive Timeline Runtime",
    "Executive Stage Runtime",
    "Executive Workspace Runtime",
    "Executive Assistant Runtime",
    "Director Runtime",
    "Future Runtime Context modules",
    "Executive Experience modules",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Public guarantees. */
const publicGuarantees = Object.freeze([
  "one canonical Runtime entry",
  "Freeze-only dependency",
  "immutable export identities",
  "deterministic export ordering",
  "dynamic API registry",
  "stable consumer surface",
  "architectural isolation",
  "forward-compatible imports",
] as const);

/** Consumer entry declaration. */
const consumerEntry = Object.freeze({
  file: "executiveContextRuntimePublicIndex.ts" as const,
  declaration: "Sole supported Executive Context Runtime consumer entry",
  dependency: "executiveContextRuntimeFreeze.ts" as const,
  dependencyPhase: "RTC-1:8 — Executive Context Runtime Freeze" as const,
  directArchitecturalImportsPermitted: false as const,
  prohibitedDirectImports: Object.freeze([
    "RTC-1:1 Foundation",
    "RTC-1:2 Registry",
    "RTC-1:3 Model",
    "RTC-1:4 Validation",
    "RTC-1:5 Manifest",
    "RTC-1:6 Platform",
    "RTC-1:7 Certification",
    "RTC-1:8 Freeze (directly)",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/**
 * Exactly nine namespace sections in canonical order.
 */
export const publicNamespaceSections = Object.freeze([
  Object.freeze({
    section: "Identity" as const,
    order: 1,
    value: Object.freeze({
      id: publicIndexId,
      name: publicIndexName,
      namespace: publicIndexNamespace,
      version: publicIndexVersion,
    }),
  }),
  Object.freeze({
    section: "Public Entry" as const,
    order: 2,
    value: consumerEntry,
  }),
  Object.freeze({
    section: "Dependencies" as const,
    order: 3,
    value: Object.freeze({
      freezeOnly: true as const,
      dependency: "executiveContextRuntimeFreeze.ts" as const,
      dependencyCount: 1 as const,
      sourceFreeze: freeze.identity.id,
    }),
  }),
  Object.freeze({
    section: "Public API Registry" as const,
    order: 4,
    value: publicApiSurface,
  }),
  Object.freeze({
    section: "Compatibility" as const,
    order: 5,
    value: publicCompatibility,
  }),
  Object.freeze({
    section: "Architecture" as const,
    order: 6,
    value: Object.freeze({
      architecture: "NPA-T vNext" as const,
      compositionLayers: freeze.compositionLayers,
      lockIdentifier: freeze.lockIdentifier,
      architecturalLocks: freeze.architecturalLocks,
    }),
  }),
  Object.freeze({
    section: "Release Status" as const,
    order: 7,
    value: Object.freeze({
      status: publicIndexStatus,
      values: freeze.releaseStatuses,
    }),
  }),
  Object.freeze({
    section: "Readiness" as const,
    order: 8,
    value: publicIndexReadiness,
  }),
  Object.freeze({
    section: "Release Information" as const,
    order: 9,
    value: publicReleaseMetadata,
  }),
] as const);

/**
 * Sole public Runtime aggregate for downstream consumers.
 */
export const executiveContextRuntimePublicIndex = Object.freeze({
  id: publicIndexId,
  name: publicIndexName,
  namespace: publicIndexNamespace,
  version: publicIndexVersion,
  status: publicIndexStatus,
  readiness: publicIndexReadiness,
  metadata: executiveContextRuntimePublicIndexMetadata,
  publicApiSurface,
  publicApiCount,
  publicNamespaceSections,
  publicReleaseMetadata,
  compatibility: publicCompatibility,
  guarantees: publicGuarantees,
  consumerEntry,
  freezeReference: freeze.identity.id,
  lockIdentifier: freeze.lockIdentifier,
  upstreamDependencies: Object.freeze([
    "RTC-1:8 — Executive Context Runtime Freeze",
  ]),
  compositionLayers: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
    "Freeze",
    "Public Index",
  ]),
  released: true as const,
  certified: true as const,
  frozen: true as const,
  stable: true as const,
  soleConsumerEntry: true as const,
  freezeOnlyDependency: true as const,
  republishesOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  createsRuntimeContexts: false as const,
  executesRuntimeLogic: false as const,
  performsValidation: false as const,
  renderingBehavior: false as const,
  invokesAi: false as const,
  exposesInternalPhases: false as const,
  bypassesFreeze: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
} as const);
