/**
 * NOL-2:9 — NexoraObject Material & Representation Public Index
 *
 * Sole supported consumer doorway into NOL-2 Material & Representation.
 * Publishes the Freeze-locked platform surface — no new engine logic.
 *
 * Upstream: NOL-2:8 Material & Representation Freeze only.
 * Identity: NOL-2:9/NexoraObjectMaterialRepresentationPublicIndex
 *
 * Consumer import path:
 *   @/app/lib/nol/nexoraObjectMaterialRepresentationPublicIndex
 */

import {
  NEXORA_MATERIAL_FROZEN_API_REGISTRY,
  NEXORA_MATERIAL_FROZEN_MODULES,
  NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES,
  NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS,
  NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES,
  NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
  NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
  NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS,
  NOL_MATERIAL_FREEZE_UPSTREAM,
  certifyDirectorPackage,
  certifyVisualization,
  certifyVisualizationCollection,
  compareVisualizationCertifications,
  deserializeMaterialRepresentationFreezeManifest,
  deserializeVisualizationCertification,
  deserializeVisualizationProjection,
  getMaterialRepresentationCompatibility,
  getMaterialRepresentationManifest,
  getMaterialRepresentationRegistry,
  getMaterialRepresentationReleaseInformation,
  getNexoraObjectMaterialRepresentationCertificationSummary,
  getNexoraObjectMaterialRepresentationFreezeSummary,
  materialRepresentationCertificationIdentity,
  materialRepresentationCertificationSchemaVersion,
  materialRepresentationCertificationVersion,
  materialRepresentationFreeze,
  materialRepresentationFreezeIdentity,
  materialRepresentationFreezeSchemaVersion,
  materialRepresentationFreezeVersion,
  projectDirectorPackage,
  projectVisualization,
  projectVisualizationCollection,
  recertifyVisualization,
  revokeVisualizationCertification,
  serializeMaterialRepresentationFreezeManifest,
  serializeVisualizationCertification,
  serializeVisualizationProjection,
  validateNexoraObjectVisualizationProjection,
  validateVisualizationCertification,
  verifyMaterialRepresentationFreezeManifest,
  visualizationDirectorProjectionEngineIdentity,
  visualizationDirectorProjectionEngineVersion,
  visualizationDirectorProjectionSchemaVersion,
  type MaterialRepresentationFreezeVerificationResult,
  type NexoraObjectDirectorPackage,
  type NexoraObjectMaterialFrozenApiRegistryEntry,
  type NexoraObjectMaterialRepresentationFreezeCompatibility,
  type NexoraObjectMaterialRepresentationFreezeManifest,
  type NexoraObjectMaterialRepresentationReleaseInformation,
  type NexoraObjectVisualizationBatchRequest,
  type NexoraObjectVisualizationBatchResult,
  type NexoraObjectVisualizationCertificationComparison,
  type NexoraObjectVisualizationCertificationDependencies,
  type NexoraObjectVisualizationCertificationOptions,
  type NexoraObjectVisualizationCertificationProfile,
  type NexoraObjectVisualizationCertificationReport,
  type NexoraObjectVisualizationCertificationState,
  type NexoraObjectVisualizationCompatibility,
  type NexoraObjectVisualizationDependencies,
  type NexoraObjectVisualizationProjection,
  type NexoraObjectVisualizationProjectionInput,
} from "./material/nexoraObjectMaterialRepresentationFreeze.ts";

// ─── Re-export frozen public surface (no wrapping, no signature changes) ────

export {
  materialRepresentationCertificationIdentity,
  materialRepresentationCertificationVersion,
  materialRepresentationCertificationSchemaVersion,
  materialRepresentationFreezeIdentity,
  materialRepresentationFreezeVersion,
  materialRepresentationFreezeSchemaVersion,
  materialRepresentationFreeze,
  NEXORA_MATERIAL_FROZEN_API_REGISTRY,
  NEXORA_MATERIAL_FROZEN_MODULES,
  NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES,
  NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS,
  NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES,
  NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
  NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
  NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS,
  NOL_MATERIAL_FREEZE_UPSTREAM,
  certifyVisualization,
  certifyVisualizationCollection,
  certifyDirectorPackage,
  recertifyVisualization,
  revokeVisualizationCertification,
  compareVisualizationCertifications,
  validateVisualizationCertification,
  serializeVisualizationCertification,
  deserializeVisualizationCertification,
  getNexoraObjectMaterialRepresentationCertificationSummary,
  getMaterialRepresentationRegistry,
  getMaterialRepresentationManifest,
  getMaterialRepresentationCompatibility,
  getMaterialRepresentationReleaseInformation,
  verifyMaterialRepresentationFreezeManifest,
  serializeMaterialRepresentationFreezeManifest,
  deserializeMaterialRepresentationFreezeManifest,
  getNexoraObjectMaterialRepresentationFreezeSummary,
  validateNexoraObjectVisualizationProjection,
  serializeVisualizationProjection,
  deserializeVisualizationProjection,
  projectVisualization,
  projectVisualizationCollection,
  projectDirectorPackage,
  visualizationDirectorProjectionEngineIdentity,
  visualizationDirectorProjectionEngineVersion,
  visualizationDirectorProjectionSchemaVersion,
};

export type {
  NexoraObjectMaterialFrozenApiRegistryEntry,
  NexoraObjectMaterialRepresentationFreezeManifest,
  NexoraObjectMaterialRepresentationReleaseInformation,
  NexoraObjectMaterialRepresentationFreezeCompatibility,
  NexoraObjectVisualizationCertificationProfile,
  NexoraObjectVisualizationCertificationState,
  NexoraObjectVisualizationCompatibility,
  NexoraObjectVisualizationCertificationReport,
  NexoraObjectVisualizationCertificationComparison,
  NexoraObjectVisualizationCertificationDependencies,
  NexoraObjectVisualizationCertificationOptions,
  MaterialRepresentationFreezeVerificationResult,
  NexoraObjectVisualizationProjection,
  NexoraObjectDirectorPackage,
  NexoraObjectVisualizationProjectionInput,
  NexoraObjectVisualizationBatchRequest,
  NexoraObjectVisualizationBatchResult,
  NexoraObjectVisualizationDependencies,
};

// ─── Public Index identity ──────────────────────────────────────────────────

export const materialRepresentationPublicIndexIdentity =
  "NOL-2:9/NexoraObjectMaterialRepresentationPublicIndex" as const;

export const materialRepresentationPublicIndexNamespace =
  "nexora.nol.material-representation.public-index" as const;

export const materialRepresentationPublicIndexUpstream =
  materialRepresentationFreezeIdentity;

export const materialRepresentationPublicIndexLock =
  "NOL-2-MATERIAL-REPRESENTATION-LOCKED" as const;

export const materialRepresentationPublicIndexVersion = "1.0.0" as const;

export const materialRepresentationPublicIndexStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

// ─── Exactly nine ordered namespace sections ─────────────────────────────────

export const MATERIAL_REPRESENTATION_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Public APIs",
  "Public Types",
  "Registry",
  "Manifest",
  "Compatibility",
  "Consumer Rules",
  "Release Information",
  "Platform Information",
] as const);

export const materialRepresentationNamespaceSectionCount =
  MATERIAL_REPRESENTATION_NAMESPACE_SECTIONS.length;

// ─── Consumer rules ─────────────────────────────────────────────────────────

export const materialRepresentationConsumerRules = Object.freeze([
  "FreezeOnlyDependency",
  "SoleConsumerEntryPoint",
  "ReadyForConsumer",
  "StableAPI",
] as const);

export const MATERIAL_REPRESENTATION_CONSUMER_RULE_DESCRIPTIONS = Object.freeze({
  FreezeOnlyDependency:
    "Public Index depends only on NOL-2:8 Freeze; consumers must not import earlier NOL-2 modules.",
  SoleConsumerEntryPoint:
    "Import only @/app/lib/nol/nexoraObjectMaterialRepresentationPublicIndex.",
  ReadyForConsumer: "Platform status includes ReadyForConsumer.",
  StableAPI: "Only Stable frozen APIs are published.",
} as const);

// ─── Derived freeze-backed constants ────────────────────────────────────────

const RELEASE_DATE = "2026-08-04T00:00:00.000Z";

export const materialRepresentationManifest =
  getMaterialRepresentationManifest(RELEASE_DATE);

export const materialRepresentationRegistry = getMaterialRepresentationRegistry();

export const materialRepresentationCompatibility =
  getMaterialRepresentationCompatibility();

export const materialRepresentationReleaseInformation =
  getMaterialRepresentationReleaseInformation(RELEASE_DATE);

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MaterialRepresentationPublicIndexIdentityNamespace {
  readonly publicIndexIdentity: typeof materialRepresentationPublicIndexIdentity;
  readonly namespace: typeof materialRepresentationPublicIndexNamespace;
  readonly lockIdentity: typeof materialRepresentationPublicIndexLock;
  readonly upstreamIdentity: typeof materialRepresentationPublicIndexUpstream;
  readonly freezeIdentity: typeof materialRepresentationFreezeIdentity;
  readonly certificationIdentity: typeof materialRepresentationCertificationIdentity;
  readonly publicIndexVersion: typeof materialRepresentationPublicIndexVersion;
  readonly status: typeof materialRepresentationPublicIndexStatus;
}

export interface MaterialRepresentationPublicApisNamespace {
  readonly certifyVisualization: typeof certifyVisualization;
  readonly certifyVisualizationCollection: typeof certifyVisualizationCollection;
  readonly certifyDirectorPackage: typeof certifyDirectorPackage;
  readonly recertifyVisualization: typeof recertifyVisualization;
  readonly revokeVisualizationCertification: typeof revokeVisualizationCertification;
  readonly compareVisualizationCertifications: typeof compareVisualizationCertifications;
  readonly validateVisualizationCertification: typeof validateVisualizationCertification;
  readonly serializeVisualizationCertification: typeof serializeVisualizationCertification;
  readonly deserializeVisualizationCertification: typeof deserializeVisualizationCertification;
  readonly getNexoraObjectMaterialRepresentationCertificationSummary: typeof getNexoraObjectMaterialRepresentationCertificationSummary;
  readonly getMaterialRepresentationRegistry: typeof getMaterialRepresentationRegistry;
  readonly getMaterialRepresentationManifest: typeof getMaterialRepresentationManifest;
  readonly getMaterialRepresentationCompatibility: typeof getMaterialRepresentationCompatibility;
  readonly getMaterialRepresentationReleaseInformation: typeof getMaterialRepresentationReleaseInformation;
  readonly verifyMaterialRepresentationFreezeManifest: typeof verifyMaterialRepresentationFreezeManifest;
  readonly serializeMaterialRepresentationFreezeManifest: typeof serializeMaterialRepresentationFreezeManifest;
  readonly deserializeMaterialRepresentationFreezeManifest: typeof deserializeMaterialRepresentationFreezeManifest;
  readonly materialRepresentationFreeze: typeof materialRepresentationFreeze;
  readonly validateNexoraObjectVisualizationProjection: typeof validateNexoraObjectVisualizationProjection;
  readonly serializeVisualizationProjection: typeof serializeVisualizationProjection;
  readonly deserializeVisualizationProjection: typeof deserializeVisualizationProjection;
  readonly projectVisualization: typeof projectVisualization;
  readonly projectVisualizationCollection: typeof projectVisualizationCollection;
  readonly projectDirectorPackage: typeof projectDirectorPackage;
}

export interface MaterialRepresentationPublicTypesNamespace {
  readonly typeNames: typeof NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES;
  readonly exportedTypeCount: number;
}

export interface MaterialRepresentationRegistryNamespace {
  readonly registry: typeof NEXORA_MATERIAL_FROZEN_API_REGISTRY;
  readonly publicApiCount: number;
  readonly getMaterialRepresentationRegistry: typeof getMaterialRepresentationRegistry;
}

export interface MaterialRepresentationManifestNamespace {
  readonly manifest: typeof materialRepresentationManifest;
  readonly getMaterialRepresentationManifest: typeof getMaterialRepresentationManifest;
  readonly verifyMaterialRepresentationFreezeManifest: typeof verifyMaterialRepresentationFreezeManifest;
  readonly serializeMaterialRepresentationFreezeManifest: typeof serializeMaterialRepresentationFreezeManifest;
  readonly deserializeMaterialRepresentationFreezeManifest: typeof deserializeMaterialRepresentationFreezeManifest;
}

export interface MaterialRepresentationCompatibilityNamespace {
  readonly compatibility: typeof NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY;
  readonly details: typeof materialRepresentationCompatibility;
  readonly getMaterialRepresentationCompatibility: typeof getMaterialRepresentationCompatibility;
}

export interface MaterialRepresentationConsumerRulesNamespace {
  readonly rules: typeof materialRepresentationConsumerRules;
  readonly descriptions: typeof MATERIAL_REPRESENTATION_CONSUMER_RULE_DESCRIPTIONS;
  readonly consumerMetadata: typeof NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA;
  readonly FreezeOnlyDependency: true;
  readonly SoleConsumerEntryPoint: true;
  readonly ReadyForConsumer: true;
  readonly StableAPI: true;
}

export interface MaterialRepresentationReleaseInformationNamespace {
  readonly releaseInformation: typeof materialRepresentationReleaseInformation;
  readonly status: typeof materialRepresentationPublicIndexStatus;
  readonly releaseStatus: typeof NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS;
  readonly getMaterialRepresentationReleaseInformation: typeof getMaterialRepresentationReleaseInformation;
}

export interface MaterialRepresentationPlatformInformationNamespace {
  readonly platformName: "Material & Representation Platform";
  readonly modules: typeof NEXORA_MATERIAL_FROZEN_MODULES;
  readonly moduleIdentities: typeof NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES;
  readonly publicExports: typeof NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS;
  readonly freezeSummary: ReturnType<
    typeof getNexoraObjectMaterialRepresentationFreezeSummary
  >;
  readonly certificationSummary: ReturnType<
    typeof getNexoraObjectMaterialRepresentationCertificationSummary
  >;
}

export interface NexoraObjectMaterialRepresentationPublicIndex {
  readonly identity: MaterialRepresentationPublicIndexIdentityNamespace;
  readonly publicApis: MaterialRepresentationPublicApisNamespace;
  readonly publicTypes: MaterialRepresentationPublicTypesNamespace;
  readonly registry: MaterialRepresentationRegistryNamespace;
  readonly manifest: MaterialRepresentationManifestNamespace;
  readonly compatibility: MaterialRepresentationCompatibilityNamespace;
  readonly consumerRules: MaterialRepresentationConsumerRulesNamespace;
  readonly releaseInformation: MaterialRepresentationReleaseInformationNamespace;
  readonly platformInformation: MaterialRepresentationPlatformInformationNamespace;
}

export type MaterialRepresentationPublicIndexIssueCode =
  | "PUBLIC_INDEX_UPSTREAM"
  | "PUBLIC_INDEX_IDENTITY"
  | "PUBLIC_INDEX_LOCK"
  | "PUBLIC_INDEX_NAMESPACE"
  | "PUBLIC_INDEX_REGISTRY"
  | "PUBLIC_INDEX_MANIFEST"
  | "PUBLIC_INDEX_COMPATIBILITY"
  | "PUBLIC_INDEX_READINESS"
  | "PUBLIC_INDEX_COUNT"
  | "PUBLIC_INDEX_CONSUMER_RULE"
  | "PUBLIC_INDEX_ALTERNATE_ENTRY";

export interface MaterialRepresentationPublicIndexIssue {
  readonly code: MaterialRepresentationPublicIndexIssueCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface MaterialRepresentationConsumerEntryResult {
  readonly ok: boolean;
  readonly errors: readonly MaterialRepresentationPublicIndexIssue[];
  readonly warnings: readonly MaterialRepresentationPublicIndexIssue[];
  readonly checkedAt: string;
}

export interface MaterialRepresentationConsumerEntryOptions {
  readonly identity?: string;
  readonly lock?: string;
  readonly upstream?: string;
  readonly sectionCount?: number;
  readonly registry?: readonly NexoraObjectMaterialFrozenApiRegistryEntry[];
  readonly manifest?: NexoraObjectMaterialRepresentationFreezeManifest;
  readonly compatibility?: string;
  readonly readiness?: string;
  readonly consumerMetadata?: Partial<
    typeof NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA
  >;
  readonly apiCount?: number;
  readonly exportCount?: number;
  readonly supportedConsumerEntries?: readonly string[];
  readonly now?: () => string;
}

export class MaterialRepresentationPublicIndexException extends Error {
  readonly code: MaterialRepresentationPublicIndexIssueCode | "PUBLIC_INDEX_CORRUPTED";
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    issue: MaterialRepresentationPublicIndexIssue | {
      readonly code: "PUBLIC_INDEX_CORRUPTED";
      readonly message: string;
      readonly details?: Readonly<Record<string, unknown>>;
    },
  ) {
    super(issue.message);
    this.name = "MaterialRepresentationPublicIndexException";
    this.code = issue.code;
    this.details = issue.details;
  }
}

// ─── Helpers (index assembly / verification only — no business logic) ───────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function issue(
  code: MaterialRepresentationPublicIndexIssueCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): MaterialRepresentationPublicIndexIssue {
  return Object.freeze({ code, message, details });
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

// ─── Namespace assembly ─────────────────────────────────────────────────────

const identityNamespace: MaterialRepresentationPublicIndexIdentityNamespace =
  deepFreeze({
    publicIndexIdentity: materialRepresentationPublicIndexIdentity,
    namespace: materialRepresentationPublicIndexNamespace,
    lockIdentity: materialRepresentationPublicIndexLock,
    upstreamIdentity: materialRepresentationPublicIndexUpstream,
    freezeIdentity: materialRepresentationFreezeIdentity,
    certificationIdentity: materialRepresentationCertificationIdentity,
    publicIndexVersion: materialRepresentationPublicIndexVersion,
    status: materialRepresentationPublicIndexStatus,
  });

const publicApisNamespace: MaterialRepresentationPublicApisNamespace =
  deepFreeze({
    certifyVisualization,
    certifyVisualizationCollection,
    certifyDirectorPackage,
    recertifyVisualization,
    revokeVisualizationCertification,
    compareVisualizationCertifications,
    validateVisualizationCertification,
    serializeVisualizationCertification,
    deserializeVisualizationCertification,
    getNexoraObjectMaterialRepresentationCertificationSummary,
    getMaterialRepresentationRegistry,
    getMaterialRepresentationManifest,
    getMaterialRepresentationCompatibility,
    getMaterialRepresentationReleaseInformation,
    verifyMaterialRepresentationFreezeManifest,
    serializeMaterialRepresentationFreezeManifest,
    deserializeMaterialRepresentationFreezeManifest,
    materialRepresentationFreeze,
    validateNexoraObjectVisualizationProjection,
    serializeVisualizationProjection,
    deserializeVisualizationProjection,
    projectVisualization,
    projectVisualizationCollection,
    projectDirectorPackage,
  });

const publicTypesNamespace: MaterialRepresentationPublicTypesNamespace =
  deepFreeze({
    typeNames: NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES,
    exportedTypeCount: NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES.length,
  });

const registryNamespace: MaterialRepresentationRegistryNamespace = deepFreeze({
  registry: NEXORA_MATERIAL_FROZEN_API_REGISTRY,
  publicApiCount: NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
  getMaterialRepresentationRegistry,
});

const manifestNamespace: MaterialRepresentationManifestNamespace = deepFreeze({
  manifest: materialRepresentationManifest,
  getMaterialRepresentationManifest,
  verifyMaterialRepresentationFreezeManifest,
  serializeMaterialRepresentationFreezeManifest,
  deserializeMaterialRepresentationFreezeManifest,
});

const compatibilityNamespace: MaterialRepresentationCompatibilityNamespace =
  deepFreeze({
    compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
    details: materialRepresentationCompatibility,
    getMaterialRepresentationCompatibility,
  });

const consumerRulesNamespace: MaterialRepresentationConsumerRulesNamespace =
  deepFreeze({
    rules: materialRepresentationConsumerRules,
    descriptions: MATERIAL_REPRESENTATION_CONSUMER_RULE_DESCRIPTIONS,
    consumerMetadata: NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
    FreezeOnlyDependency: true as const,
    SoleConsumerEntryPoint: true as const,
    ReadyForConsumer: true as const,
    StableAPI: true as const,
  });

const releaseInformationNamespace: MaterialRepresentationReleaseInformationNamespace =
  deepFreeze({
    releaseInformation: materialRepresentationReleaseInformation,
    status: materialRepresentationPublicIndexStatus,
    releaseStatus: NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS,
    getMaterialRepresentationReleaseInformation,
  });

const platformInformationNamespace: MaterialRepresentationPlatformInformationNamespace =
  deepFreeze({
    platformName: "Material & Representation Platform" as const,
    modules: NEXORA_MATERIAL_FROZEN_MODULES,
    moduleIdentities: NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES,
    publicExports: NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS,
    freezeSummary: getNexoraObjectMaterialRepresentationFreezeSummary(),
    certificationSummary:
      getNexoraObjectMaterialRepresentationCertificationSummary(),
  });

export const nexoraObjectMaterialRepresentationPublicIndex: NexoraObjectMaterialRepresentationPublicIndex =
  deepFreeze({
    identity: identityNamespace,
    publicApis: publicApisNamespace,
    publicTypes: publicTypesNamespace,
    registry: registryNamespace,
    manifest: manifestNamespace,
    compatibility: compatibilityNamespace,
    consumerRules: consumerRulesNamespace,
    releaseInformation: releaseInformationNamespace,
    platformInformation: platformInformationNamespace,
  });

// ─── Consumer verification ──────────────────────────────────────────────────

export function verifyMaterialRepresentationConsumerEntry(
  options: MaterialRepresentationConsumerEntryOptions = {},
): MaterialRepresentationConsumerEntryResult {
  const now = options.now ?? (() => new Date().toISOString());
  const errors: MaterialRepresentationPublicIndexIssue[] = [];
  const warnings: MaterialRepresentationPublicIndexIssue[] = [];

  const identity =
    options.identity ?? materialRepresentationPublicIndexIdentity;
  const lock = options.lock ?? materialRepresentationPublicIndexLock;
  const upstream =
    options.upstream ?? materialRepresentationPublicIndexUpstream;
  const sectionCount =
    options.sectionCount ?? materialRepresentationNamespaceSectionCount;
  const registry = options.registry ?? materialRepresentationRegistry;
  const manifest = options.manifest ?? materialRepresentationManifest;
  const compatibility =
    options.compatibility ?? materialRepresentationCompatibility.compatibility;
  const readiness =
    options.readiness ?? materialRepresentationPublicIndexStatus.readiness;
  const consumerMetadata = {
    ...NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
    ...options.consumerMetadata,
  };
  const apiCount = options.apiCount ?? registry.length;
  const exportCount =
    options.exportCount ?? NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length;

  if (upstream !== materialRepresentationFreezeIdentity) {
    errors.push(
      issue(
        "PUBLIC_INDEX_UPSTREAM",
        `Upstream must be Freeze-only (${materialRepresentationFreezeIdentity}).`,
        { upstream },
      ),
    );
  }

  if (identity !== materialRepresentationPublicIndexIdentity) {
    errors.push(
      issue("PUBLIC_INDEX_IDENTITY", "Public Index identity mismatch.", {
        identity,
      }),
    );
  }

  if (lock !== materialRepresentationPublicIndexLock) {
    errors.push(
      issue("PUBLIC_INDEX_LOCK", "Public Index lock identity mismatch.", {
        lock,
      }),
    );
  }

  if (sectionCount !== 9) {
    errors.push(
      issue(
        "PUBLIC_INDEX_NAMESPACE",
        "Namespace must contain exactly nine sections.",
        { sectionCount },
      ),
    );
  }

  if (!isDeeplyFrozen(registry)) {
    errors.push(
      issue(
        "PUBLIC_INDEX_REGISTRY",
        "Registry must be deeply immutable.",
      ),
    );
  }

  const names = new Set<string>();
  const identities = new Set<string>();
  for (const entry of registry) {
    if (names.has(entry.apiName)) {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Duplicate API name in registry: ${entry.apiName}`,
          { apiName: entry.apiName },
        ),
      );
    }
    names.add(entry.apiName);
    if (identities.has(entry.apiIdentity)) {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Duplicate API identity in registry: ${entry.apiIdentity}`,
          { apiIdentity: entry.apiIdentity },
        ),
      );
    }
    identities.add(entry.apiIdentity);
    if (entry.status !== "Stable") {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Registry entry is not Stable: ${entry.apiName}`,
          { apiName: entry.apiName, status: entry.status },
        ),
      );
    }
  }

  if (!isDeeplyFrozen(manifest)) {
    errors.push(
      issue(
        "PUBLIC_INDEX_MANIFEST",
        "Manifest must be deeply immutable.",
      ),
    );
  }

  const freezeVerification = verifyMaterialRepresentationFreezeManifest(
    manifest,
    { checkedAt: now() },
  );
  if (!freezeVerification.ok) {
    errors.push(
      issue(
        "PUBLIC_INDEX_MANIFEST",
        "Freeze manifest verification failed.",
        {
          errorCodes: freezeVerification.errors.map((error) => error.code),
        },
      ),
    );
  }

  if (manifest.schemaVersion !== materialRepresentationFreezeSchemaVersion) {
    errors.push(
      issue(
        "PUBLIC_INDEX_MANIFEST",
        "Unsupported freeze manifest schema.",
        { schemaVersion: manifest.schemaVersion },
      ),
    );
  }

  if (compatibility !== NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COMPATIBILITY",
        "Compatibility must match the frozen compatibility value.",
        { compatibility },
      ),
    );
  }

  if (readiness !== "ReadyForConsumer") {
    errors.push(
      issue(
        "PUBLIC_INDEX_READINESS",
        "Public Index must be ReadyForConsumer.",
        { readiness },
      ),
    );
  }

  if (
    !consumerMetadata.ReadyForConsumer ||
    !consumerMetadata.StableAPI ||
    !consumerMetadata.SoleConsumerEntryPoint ||
    !consumerMetadata.FreezeOnlyDependency
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_CONSUMER_RULE",
        "Consumer metadata flags must all be true.",
        { consumerMetadata },
      ),
    );
  }

  if (apiCount !== NEXORA_MATERIAL_FROZEN_API_REGISTRY.length) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COUNT",
        "Public API count must match Freeze registry length.",
        {
          apiCount,
          freezeRegistryLength: NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
        },
      ),
    );
  }

  if (exportCount !== NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COUNT",
        "Export count must match Freeze public export length.",
        {
          exportCount,
          freezeExportLength: NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length,
        },
      ),
    );
  }

  const supported =
    options.supportedConsumerEntries ??
    Object.freeze([
      "@/app/lib/nol/nexoraObjectMaterialRepresentationPublicIndex",
    ]);
  for (const entry of supported) {
    if (
      entry.includes("/material/nexoraObject") &&
      !entry.endsWith("PublicIndex")
    ) {
      errors.push(
        issue(
          "PUBLIC_INDEX_ALTERNATE_ENTRY",
          "Alternate NOL-2 module import paths are not supported for consumers.",
          { entry },
        ),
      );
    }
  }

  return deepFreeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt: now(),
  });
}

export function getNexoraObjectMaterialRepresentationPublicIndexSummary() {
  return deepFreeze({
    identity: materialRepresentationPublicIndexIdentity,
    version: materialRepresentationPublicIndexVersion,
    upstream: materialRepresentationPublicIndexUpstream,
    namespaceSections: MATERIAL_REPRESENTATION_NAMESPACE_SECTIONS,
    sectionCount: materialRepresentationNamespaceSectionCount,
    status: materialRepresentationPublicIndexStatus,
    consumerRules: materialRepresentationConsumerRules,
    publicApiCount: NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
    exportCount: NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length,
    noBusinessLogic: true,
    noVisualizationLogic: true,
    noRendererLogic: true,
  });
}
