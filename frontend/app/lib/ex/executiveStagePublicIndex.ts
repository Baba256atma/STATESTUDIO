/**
 * EX-1:9 — Executive Stage Public Index.
 *
 * Sole public consumer entry point for the Executive Stage.
 * Imports only the Freeze artifact. Republishes only. No implementation.
 *
 * Ownership: owned exclusively by EX-1:9.
 *
 * Public exports (exactly 12):
 *   publicIndexId
 *   publicIndexName
 *   publicIndexVersion
 *   publicIndexNamespace
 *   publicIndexStatus
 *   publicApiSurface
 *   publicApiCount
 *   releaseInformation
 *   consumerDeclaration
 *   publicRegistry
 *   executiveStagePublicIndex
 *   default
 */

import { ExecutiveStageFreeze } from "./executiveStageFreeze.ts";

const freeze = ExecutiveStageFreeze;

/** Canonical Public Index identity constants. */
export const publicIndexId = "EX-1:9/ExecutiveStagePublicIndex" as const;

export const publicIndexName = "Executive Stage Public Index" as const;

export const publicIndexVersion = "1.0.0" as const;

export const publicIndexNamespace =
  "nexora.executive-experience.executive-stage.public-index" as const;

export const publicIndexStatus =
  "Released · Certified · Frozen · Stable" as const;

const publicIndexReadiness = "ReadyForConsumer" as const;

/** Canonical namespace section order — immutable. */
const NAMESPACE_SECTION_NAMES = Object.freeze([
  "Identity",
  "Public API",
  "Registry",
  "Platform",
  "Compatibility",
  "Consumer",
  "Metrics",
  "Release Information",
  "Metadata",
] as const);

const registerPublicApiEntry = (
  kind: string,
  exportName: string,
  order: number,
  sourcePhase: string,
) =>
  Object.freeze({
    apiIdentifier: `EX-1:9/Api/${kind}/${String(order).padStart(2, "0")}`,
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
  ...freeze.publicContracts.map((entry, index) =>
    registerPublicApiEntry(
      "Contract",
      entry.name,
      index + 1,
      freeze.identity.id,
    )
  ),
  ...freeze.certification.platform.serviceNames.map((name, index) =>
    registerPublicApiEntry(
      "Service",
      name,
      freeze.publicContracts.length + index + 1,
      freeze.identity.id,
    )
  ),
  ...freeze.compatibilityDeclarations.map((entry, index) =>
    registerPublicApiEntry(
      "Compatibility",
      entry.name,
      freeze.publicContracts.length +
        freeze.certification.platform.serviceNames.length +
        index +
        1,
      freeze.identity.id,
    )
  ),
  ...freeze.releaseMetadataFields.map((entry, index) =>
    registerPublicApiEntry(
      "Metadata",
      entry.fieldName,
      freeze.publicContracts.length +
        freeze.certification.platform.serviceNames.length +
        freeze.compatibilityDeclarations.length +
        index +
        1,
      freeze.identity.id,
    )
  ),
  ...freeze.architecturalLocks.map((entry, index) =>
    registerPublicApiEntry(
      "Identity",
      entry.lockName,
      freeze.publicContracts.length +
        freeze.certification.platform.serviceNames.length +
        freeze.compatibilityDeclarations.length +
        freeze.releaseMetadataFields.length +
        index +
        1,
      freeze.identity.id,
    )
  ),
]);

export const publicApiSurface = derivedPublicApiSurface;

/** Dynamic count — never hard-coded. */
export const publicApiCount = publicApiSurface.length;

/** Release information republished from Freeze. */
export const releaseInformation = Object.freeze({
  releaseIdentity: publicIndexId,
  architectureVersion: "NPA-T vNext" as const,
  freezeVersion: freeze.identity.version,
  platformVersion: freeze.releaseMetadataFields.find(
    (field) => field.fieldName === "Platform Version",
  )?.value,
  certificationVersion: freeze.releaseMetadataFields.find(
    (field) => field.fieldName === "Certification Version",
  )?.value,
  releaseTimestamp: freeze.releaseMetadataFields.find(
    (field) => field.fieldName === "Release Timestamp",
  )?.value,
  releaseStatuses: freeze.releaseStatuses,
  releaseStatus: publicIndexStatus,
  readiness: publicIndexReadiness,
  lockIdentifier: freeze.lockIdentifier,
  sourceFreeze: freeze.identity.id,
  namespace: publicIndexNamespace,
  version: publicIndexVersion,
  generatedTimestamp: "2026-07-25T00:00:00.000Z" as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/**
 * Consumer declaration — sole consumer entry point.
 */
export const consumerDeclaration = Object.freeze({
  file: "executiveStagePublicIndex.ts" as const,
  declaration: "Sole Consumer Entry Point",
  publicIndexName,
  isSoleConsumerEntryPoint: true as const,
  dependency: "executiveStageFreeze.ts" as const,
  dependencyPhase: "EX-1:8 — Executive Stage Freeze" as const,
  directArchitecturalImportsPermitted: false as const,
  prohibitedDirectImports: Object.freeze([
    "EX-1:1 Foundation",
    "EX-1:2 Registry",
    "EX-1:3 Model",
    "EX-1:4 Validation",
    "EX-1:5 Manifest",
    "EX-1:6 Platform",
    "EX-1:7 Certification",
    "EX-1:8 Freeze (directly)",
  ] as const),
  consumers: Object.freeze([
    "Manager",
    "Executive Journal",
    "Executive Timeline",
    "Executive Interaction",
    "Future Executive Experience Modules",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Compatibility republished from Freeze. */
const publicCompatibility = Object.freeze({
  declarations: freeze.compatibilityDeclarations,
  names: freeze.compatibilityNames,
  declarationCount: freeze.compatibilityDeclarations.length,
  immutableForRelease: true as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Public guarantees. */
const publicGuarantees = Object.freeze([
  "one public entry point",
  "stable exports",
  "immutable namespace",
  "deterministic API ordering",
  "Runtime compatibility",
  "consumer safety",
  "forward-compatible evolution",
  "architectural isolation",
] as const);

/**
 * Exactly nine namespace sections in canonical order.
 */
const publicNamespaceSections = Object.freeze([
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
    section: "Public API" as const,
    order: 2,
    value: publicApiSurface,
  }),
  Object.freeze({
    section: "Registry" as const,
    order: 3,
    value: Object.freeze({
      publicContracts: freeze.publicContracts,
      baselines: freeze.baselines,
      registryId: "EX-1:9/PublicRegistry" as const,
    }),
  }),
  Object.freeze({
    section: "Platform" as const,
    order: 4,
    value: Object.freeze({
      services: freeze.certification.platform.serviceNames,
      publicApis: freeze.certification.platform.publicApiNames,
      lifecycleStates: freeze.certification.platform.lifecycleStateNames,
      sourceFreeze: freeze.identity.id,
    }),
  }),
  Object.freeze({
    section: "Compatibility" as const,
    order: 5,
    value: publicCompatibility,
  }),
  Object.freeze({
    section: "Consumer" as const,
    order: 6,
    value: consumerDeclaration,
  }),
  Object.freeze({
    section: "Metrics" as const,
    order: 7,
    value: Object.freeze({
      publicApiCount,
      namespaceSectionCount: NAMESPACE_SECTION_NAMES.length,
      upstreamDependencyCount: 1 as const,
      consumerEntryPointCount: 1 as const,
    }),
  }),
  Object.freeze({
    section: "Release Information" as const,
    order: 8,
    value: releaseInformation,
  }),
  Object.freeze({
    section: "Metadata" as const,
    order: 9,
    value: Object.freeze({
      identity: publicIndexId,
      namespace: publicIndexNamespace,
      version: publicIndexVersion,
      architectureVersion: "NPA-T vNext" as const,
      releaseStatus: publicIndexStatus,
      readiness: publicIndexReadiness,
      generatedTimestamp: "2026-07-25T00:00:00.000Z" as const,
    }),
  }),
] as const);

/**
 * Public Registry — read-only catalogue derived from Freeze.
 */
export const publicRegistry = Object.freeze({
  registryId: "EX-1:9/PublicRegistry" as const,
  sourceFreeze: freeze.identity.id,
  publicIdentities: Object.freeze([
    publicIndexId,
    freeze.identity.id,
    freeze.lockIdentifier,
  ]),
  publicContracts: freeze.publicContracts,
  platformServices: freeze.certification.platform.serviceNames,
  publicMetadata: freeze.releaseMetadataFields,
  compatibilityDeclarations: freeze.compatibilityDeclarations,
  namespaceSections: publicNamespaceSections,
  publicApiSurface,
  publicApiCount,
  readOnly: true as const,
  derivedFromFreezeOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/**
 * Sole public Executive Stage aggregate for downstream consumers.
 */
export const executiveStagePublicIndex = Object.freeze({
  id: publicIndexId,
  name: publicIndexName,
  namespace: publicIndexNamespace,
  version: publicIndexVersion,
  status: publicIndexStatus,
  readiness: publicIndexReadiness,
  publicApiSurface,
  publicApiCount,
  releaseInformation,
  consumerDeclaration,
  publicRegistry,
  namespaceSections: publicNamespaceSections,
  compatibility: publicCompatibility,
  guarantees: publicGuarantees,
  freezeReference: freeze.identity.id,
  lockIdentifier: freeze.lockIdentifier,
  upstreamDependencies: Object.freeze([
    "EX-1:8 — Executive Stage Freeze",
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
  implementsRendering: false as const,
  executesRuntimeLogic: false as const,
  performsValidation: false as const,
  modifiesPlatformState: false as const,
  invokesAi: false as const,
  executesWorkspaceLogic: false as const,
  exposesInternalModules: false as const,
  communicatesExternally: false as const,
  bypassesFreeze: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
} as const);

/** Default export — sole public consumer entry. */
export default executiveStagePublicIndex;
