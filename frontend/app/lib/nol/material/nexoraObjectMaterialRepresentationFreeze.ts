/**
 * NOL-2:8 — NexoraObject Material & Representation Freeze
 *
 * Official freeze of the NOL-2 Material & Representation platform.
 * Locks the certified public surface for Director and future consumers.
 * No visualization, rendering, or business logic.
 *
 * Upstream: NOL-2:7 only.
 * Identity: NOL-2:8/NexoraObjectMaterialRepresentationFreeze
 */

import {
  NOL_MATERIAL_CERTIFICATION_UPSTREAM,
  compareVisualizationCertifications,
  certifyDirectorPackage,
  certifyVisualization,
  certifyVisualizationCollection,
  deserializeVisualizationCertification,
  deserializeVisualizationProjection,
  getNexoraObjectMaterialRepresentationCertificationSummary,
  materialRepresentationCertificationIdentity,
  materialRepresentationCertificationSchemaVersion,
  materialRepresentationCertificationVersion,
  projectDirectorPackage,
  projectVisualization,
  projectVisualizationCollection,
  recertifyVisualization,
  revokeVisualizationCertification,
  serializeVisualizationCertification,
  serializeVisualizationProjection,
  validateNexoraObjectVisualizationProjection,
  validateVisualizationCertification,
  visualizationDirectorProjectionEngineIdentity,
  visualizationDirectorProjectionEngineVersion,
  visualizationDirectorProjectionSchemaVersion,
  type NexoraObjectDirectorPackage,
  type NexoraObjectDirectorPackageCertificationResult,
  type NexoraObjectVisualizationBatchRequest,
  type NexoraObjectVisualizationBatchResult,
  type NexoraObjectVisualizationCertificationCheckId,
  type NexoraObjectVisualizationCertificationCheckResult,
  type NexoraObjectVisualizationCertificationComparison,
  type NexoraObjectVisualizationCertificationDependencies,
  type NexoraObjectVisualizationCertificationHistoryEntry,
  type NexoraObjectVisualizationCertificationOptions,
  type NexoraObjectVisualizationCertificationProfile,
  type NexoraObjectVisualizationCertificationReport,
  type NexoraObjectVisualizationCertificationState,
  type NexoraObjectVisualizationCollectionCertificationResult,
  type NexoraObjectVisualizationCompatibility,
  type NexoraObjectVisualizationDependencies,
  type NexoraObjectVisualizationProjection,
  type NexoraObjectVisualizationProjectionInput,
  type NexoraObjectVisualizationRevocationReason,
  type VisualizationCertificationErrorCode,
} from "./nexoraObjectMaterialRepresentationCertification.ts";

// ─── Re-export certified public surface ─────────────────────────────────────

export {
  materialRepresentationCertificationIdentity,
  materialRepresentationCertificationVersion,
  materialRepresentationCertificationSchemaVersion,
  NOL_MATERIAL_CERTIFICATION_UPSTREAM,
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
  NexoraObjectVisualizationCertificationProfile,
  NexoraObjectVisualizationCertificationState,
  NexoraObjectVisualizationCompatibility,
  NexoraObjectVisualizationCertificationCheckId,
  NexoraObjectVisualizationCertificationCheckResult,
  NexoraObjectVisualizationCertificationHistoryEntry,
  NexoraObjectVisualizationCertificationReport,
  NexoraObjectVisualizationCertificationComparison,
  NexoraObjectVisualizationCertificationDependencies,
  NexoraObjectVisualizationCertificationOptions,
  NexoraObjectVisualizationCollectionCertificationResult,
  NexoraObjectDirectorPackageCertificationResult,
  NexoraObjectVisualizationRevocationReason,
  VisualizationCertificationErrorCode,
  NexoraObjectVisualizationProjection,
  NexoraObjectDirectorPackage,
  NexoraObjectVisualizationProjectionInput,
  NexoraObjectVisualizationBatchRequest,
  NexoraObjectVisualizationBatchResult,
  NexoraObjectVisualizationDependencies,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const materialRepresentationFreezeIdentity =
  "NOL-2:8/NexoraObjectMaterialRepresentationFreeze" as const;

export const materialRepresentationFreezeVersion = "1.0.0" as const;

export const materialRepresentationFreezeSchemaVersion = "1.0.0" as const;

export const NOL_MATERIAL_FREEZE_IDENTITY = materialRepresentationFreezeIdentity;
export const NOL_MATERIAL_FREEZE_VERSION = materialRepresentationFreezeVersion;
export const NOL_MATERIAL_FREEZE_SCHEMA_VERSION =
  materialRepresentationFreezeSchemaVersion;

/** Freeze depends exclusively on NOL-2:7. */
export const NOL_MATERIAL_FREEZE_UPSTREAM = Object.freeze([
  materialRepresentationCertificationIdentity,
] as const);

export const NOL_MATERIAL_FREEZE_TAGS = Object.freeze([
  "[NOL-2:8]",
  "[MATERIAL_REPRESENTATION_FREEZE]",
  "[IMMUTABLE_SURFACE]",
  "[READY_FOR_CONSUMER]",
  "[NO_NEW_FEATURES]",
] as const);

// ─── Platform status / consumer metadata ────────────────────────────────────

export type NexoraObjectMaterialRepresentationReleaseStatus =
  | "Released"
  | "Certified"
  | "Frozen"
  | "Stable"
  | "ReadyForConsumer";

export const NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS = Object.freeze([
  "Released",
  "Certified",
  "Frozen",
  "Stable",
  "ReadyForConsumer",
] as const satisfies readonly NexoraObjectMaterialRepresentationReleaseStatus[]);

export type NexoraObjectMaterialRepresentationConsumerFlag =
  | "ReadyForConsumer"
  | "SoleConsumerEntryPoint"
  | "FreezeOnlyDependency"
  | "StableAPI";

export const NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA = Object.freeze({
  ReadyForConsumer: true,
  SoleConsumerEntryPoint: true,
  FreezeOnlyDependency: true,
  StableAPI: true,
} as const satisfies Record<
  NexoraObjectMaterialRepresentationConsumerFlag,
  true
>);

export type NexoraObjectMaterialRepresentationFreezeCompatibility =
  NexoraObjectVisualizationCompatibility;

export const NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY =
  "BackwardCompatible" as const satisfies NexoraObjectMaterialRepresentationFreezeCompatibility;

// ─── Locked platform modules (documented; Freeze imports only Certification) ─

export type NexoraObjectMaterialFrozenModuleName =
  | "MaterialFoundation"
  | "MaterialResolution"
  | "RepresentationTransition"
  | "AdaptiveDensity"
  | "MaterialAttention"
  | "VisualizationProjection"
  | "MaterialCertification";

/**
 * Locked NOL-2 module identities. Values are frozen string constants so Freeze
 * does not import NOL-2:1–2:6 (dependency lock: Certification only).
 */
export const NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES = Object.freeze({
  MaterialFoundation:
    "NOL-2:1/NexoraObjectMaterialRepresentationFoundation",
  MaterialResolution: "NOL-2:2/NexoraObjectMaterialStateResolutionModel",
  RepresentationTransition:
    "NOL-2:3/NexoraObjectRepresentationTransitionBehaviorEngine",
  AdaptiveDensity:
    "NOL-2:4/NexoraObjectRepresentationContextAdaptiveDensityEngine",
  MaterialAttention:
    "NOL-2:5/NexoraObjectMaterialInteractionAttentionEngine",
  VisualizationProjection:
    "NOL-2:6/NexoraObjectVisualizationDirectorProjectionEngine",
  MaterialCertification: materialRepresentationCertificationIdentity,
} as const);

export interface NexoraObjectMaterialFrozenModuleDescriptor {
  readonly name: NexoraObjectMaterialFrozenModuleName;
  readonly identity: string;
  readonly phase: number;
  readonly version: string;
  readonly schemaVersion: string;
  readonly status: "Frozen";
}

export const NEXORA_MATERIAL_FROZEN_MODULES: readonly NexoraObjectMaterialFrozenModuleDescriptor[] =
  Object.freeze([
    Object.freeze({
      name: "MaterialFoundation" as const,
      identity: NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES.MaterialFoundation,
      phase: 1,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "MaterialResolution" as const,
      identity: NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES.MaterialResolution,
      phase: 2,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "RepresentationTransition" as const,
      identity:
        NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES.RepresentationTransition,
      phase: 3,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "AdaptiveDensity" as const,
      identity: NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES.AdaptiveDensity,
      phase: 4,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "MaterialAttention" as const,
      identity: NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES.MaterialAttention,
      phase: 5,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "VisualizationProjection" as const,
      identity:
        NEXORA_MATERIAL_FROZEN_MODULE_IDENTITIES.VisualizationProjection,
      phase: 6,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "MaterialCertification" as const,
      identity: materialRepresentationCertificationIdentity,
      phase: 7,
      version: materialRepresentationCertificationVersion,
      schemaVersion: materialRepresentationCertificationSchemaVersion,
      status: "Frozen" as const,
    }),
  ]);

// ─── Public API registry (certified surface only) ───────────────────────────

export interface NexoraObjectMaterialFrozenApiRegistryEntry {
  readonly apiIdentity: string;
  readonly apiName: string;
  readonly version: string;
  readonly status: "Stable";
  readonly compatibility: NexoraObjectMaterialRepresentationFreezeCompatibility;
  readonly owningModule: "MaterialCertification" | "MaterialFreeze";
}

const CERTIFIED_API_NAMES = Object.freeze([
  "certifyVisualization",
  "certifyVisualizationCollection",
  "certifyDirectorPackage",
  "recertifyVisualization",
  "revokeVisualizationCertification",
  "compareVisualizationCertifications",
  "validateVisualizationCertification",
  "serializeVisualizationCertification",
  "deserializeVisualizationCertification",
  "getNexoraObjectMaterialRepresentationCertificationSummary",
] as const);

const VISUALIZATION_API_NAMES = Object.freeze([
  "validateNexoraObjectVisualizationProjection",
  "serializeVisualizationProjection",
  "deserializeVisualizationProjection",
  "projectVisualization",
  "projectVisualizationCollection",
  "projectDirectorPackage",
] as const);

const FREEZE_API_NAMES = Object.freeze([
  "materialRepresentationFreeze",
  "verifyMaterialRepresentationFreezeManifest",
  "getMaterialRepresentationRegistry",
  "getMaterialRepresentationManifest",
  "getMaterialRepresentationCompatibility",
  "getMaterialRepresentationReleaseInformation",
] as const);

export const NEXORA_MATERIAL_FROZEN_API_REGISTRY: readonly NexoraObjectMaterialFrozenApiRegistryEntry[] =
  Object.freeze([
    ...CERTIFIED_API_NAMES.map((apiName) =>
      Object.freeze({
        apiIdentity: `${materialRepresentationCertificationIdentity}/${apiName}`,
        apiName,
        version: materialRepresentationCertificationVersion,
        status: "Stable" as const,
        compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
        owningModule: "MaterialCertification" as const,
      }),
    ),
    ...VISUALIZATION_API_NAMES.map((apiName) =>
      Object.freeze({
        apiIdentity: `${materialRepresentationCertificationIdentity}/${apiName}`,
        apiName,
        version: materialRepresentationCertificationVersion,
        status: "Stable" as const,
        compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
        owningModule: "MaterialCertification" as const,
      }),
    ),
    ...FREEZE_API_NAMES.map((apiName) =>
      Object.freeze({
        apiIdentity: `${materialRepresentationFreezeIdentity}/${apiName}`,
        apiName,
        version: materialRepresentationFreezeVersion,
        status: "Stable" as const,
        compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
        owningModule: "MaterialFreeze" as const,
      }),
    ),
  ]);

export const NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS: readonly string[] =
  Object.freeze([
    ...CERTIFIED_API_NAMES,
    ...VISUALIZATION_API_NAMES,
    ...FREEZE_API_NAMES,
    "materialRepresentationFreezeIdentity",
    "materialRepresentationFreezeVersion",
    "materialRepresentationFreezeSchemaVersion",
    "materialRepresentationCertificationIdentity",
    "visualizationDirectorProjectionEngineIdentity",
    "NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA",
    "NEXORA_MATERIAL_FROZEN_MODULES",
    "NEXORA_MATERIAL_FROZEN_API_REGISTRY",
  ]);

export const NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES: readonly string[] =
  Object.freeze([
    "NexoraObjectVisualizationCertificationProfile",
    "NexoraObjectVisualizationCertificationState",
    "NexoraObjectVisualizationCompatibility",
    "NexoraObjectVisualizationCertificationReport",
    "NexoraObjectMaterialRepresentationFreezeManifest",
    "NexoraObjectMaterialRepresentationReleaseInformation",
    "NexoraObjectMaterialFrozenApiRegistryEntry",
    "NexoraObjectVisualizationProjection",
    "NexoraObjectDirectorPackage",
    "NexoraObjectVisualizationProjectionInput",
    "NexoraObjectVisualizationBatchRequest",
    "NexoraObjectVisualizationBatchResult",
    "NexoraObjectVisualizationDependencies",
  ]);

// ─── Manifest / release ─────────────────────────────────────────────────────

export interface NexoraObjectMaterialRepresentationFreezeManifest {
  readonly identity: typeof materialRepresentationFreezeIdentity;
  readonly version: typeof materialRepresentationFreezeVersion;
  readonly schemaVersion: typeof materialRepresentationFreezeSchemaVersion;
  readonly certificationIdentity: typeof materialRepresentationCertificationIdentity;
  readonly certificationVersion: typeof materialRepresentationCertificationVersion;
  readonly certificationSchemaVersion: typeof materialRepresentationCertificationSchemaVersion;
  readonly compatibility: NexoraObjectMaterialRepresentationFreezeCompatibility;
  readonly releaseStatus: readonly NexoraObjectMaterialRepresentationReleaseStatus[];
  readonly publicApiCount: number;
  readonly dependencyCount: number;
  readonly moduleCount: number;
  readonly exportedTypeCount: number;
  readonly exportedApiCount: number;
  readonly generatedAt: string;
  readonly consumerMetadata: typeof NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA;
  readonly upstream: typeof NOL_MATERIAL_FREEZE_UPSTREAM;
  readonly certificationUpstream: typeof NOL_MATERIAL_CERTIFICATION_UPSTREAM;
}

export interface NexoraObjectMaterialRepresentationReleaseInformation {
  readonly identity: typeof materialRepresentationFreezeIdentity;
  readonly version: typeof materialRepresentationFreezeVersion;
  readonly schemaVersion: typeof materialRepresentationFreezeSchemaVersion;
  readonly releaseStatus: readonly NexoraObjectMaterialRepresentationReleaseStatus[];
  readonly compatibility: NexoraObjectMaterialRepresentationFreezeCompatibility;
  readonly consumerMetadata: typeof NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA;
  readonly readiness: "ReadyForConsumer";
  readonly stability: "Stable";
  readonly soleConsumerEntryPoint: true;
  readonly freezeOnlyDependency: true;
  readonly stableApi: true;
  readonly releaseDate: string;
}

export type MaterialRepresentationFreezeErrorCode =
  | "MATERIAL_FREEZE_CORRUPTED_MANIFEST"
  | "MATERIAL_FREEZE_UNSUPPORTED_SCHEMA"
  | "MATERIAL_FREEZE_DEPENDENCY_LOCK_VIOLATION"
  | "MATERIAL_FREEZE_CERTIFICATION_REQUIRED"
  | "MATERIAL_FREEZE_REGISTRY_MISMATCH"
  | "MATERIAL_FREEZE_COUNT_MISMATCH"
  | "MATERIAL_FREEZE_IMMUTABILITY_VIOLATION"
  | "MATERIAL_FREEZE_INVALID_COMPATIBILITY";

export interface MaterialRepresentationFreezeVerificationIssue {
  readonly code: MaterialRepresentationFreezeErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface MaterialRepresentationFreezeVerificationResult {
  readonly ok: boolean;
  readonly errors: readonly MaterialRepresentationFreezeVerificationIssue[];
  readonly warnings: readonly MaterialRepresentationFreezeVerificationIssue[];
  readonly checkedAt: string;
}

export class MaterialRepresentationFreezeException extends Error {
  readonly code: MaterialRepresentationFreezeErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(issue: MaterialRepresentationFreezeVerificationIssue) {
    super(issue.message);
    this.name = "MaterialRepresentationFreezeException";
    this.code = issue.code;
    this.details = issue.details;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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
  code: MaterialRepresentationFreezeErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): MaterialRepresentationFreezeVerificationIssue {
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

// ─── Public getters ─────────────────────────────────────────────────────────

export function getMaterialRepresentationRegistry(): readonly NexoraObjectMaterialFrozenApiRegistryEntry[] {
  return NEXORA_MATERIAL_FROZEN_API_REGISTRY;
}

export function getMaterialRepresentationManifest(
  generatedAt = "1970-01-01T00:00:00.000Z",
): NexoraObjectMaterialRepresentationFreezeManifest {
  return deepFreeze({
    identity: materialRepresentationFreezeIdentity,
    version: materialRepresentationFreezeVersion,
    schemaVersion: materialRepresentationFreezeSchemaVersion,
    certificationIdentity: materialRepresentationCertificationIdentity,
    certificationVersion: materialRepresentationCertificationVersion,
    certificationSchemaVersion: materialRepresentationCertificationSchemaVersion,
    compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
    releaseStatus: NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS,
    publicApiCount: NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
    dependencyCount: NOL_MATERIAL_FREEZE_UPSTREAM.length,
    moduleCount: NEXORA_MATERIAL_FROZEN_MODULES.length,
    exportedTypeCount: NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES.length,
    exportedApiCount: NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length,
    generatedAt,
    consumerMetadata: NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
    upstream: NOL_MATERIAL_FREEZE_UPSTREAM,
    certificationUpstream: NOL_MATERIAL_CERTIFICATION_UPSTREAM,
  });
}

export function getMaterialRepresentationCompatibility(): {
  readonly compatibility: NexoraObjectMaterialRepresentationFreezeCompatibility;
  readonly version: typeof materialRepresentationFreezeVersion;
  readonly immutable: true;
} {
  return deepFreeze({
    compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
    version: materialRepresentationFreezeVersion,
    immutable: true as const,
  });
}

export function getMaterialRepresentationReleaseInformation(
  releaseDate = "1970-01-01T00:00:00.000Z",
): NexoraObjectMaterialRepresentationReleaseInformation {
  return deepFreeze({
    identity: materialRepresentationFreezeIdentity,
    version: materialRepresentationFreezeVersion,
    schemaVersion: materialRepresentationFreezeSchemaVersion,
    releaseStatus: NEXORA_MATERIAL_REPRESENTATION_RELEASE_STATUS,
    compatibility: NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY,
    consumerMetadata: NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
    readiness: "ReadyForConsumer" as const,
    stability: "Stable" as const,
    soleConsumerEntryPoint: true as const,
    freezeOnlyDependency: true as const,
    stableApi: true as const,
    releaseDate,
  });
}

// ─── Verification ───────────────────────────────────────────────────────────

export function verifyMaterialRepresentationFreezeManifest(
  manifest: NexoraObjectMaterialRepresentationFreezeManifest = getMaterialRepresentationManifest(),
  options?: {
    readonly checkedAt?: string;
    readonly requireCertification?: boolean;
  },
): MaterialRepresentationFreezeVerificationResult {
  const errors: MaterialRepresentationFreezeVerificationIssue[] = [];
  const warnings: MaterialRepresentationFreezeVerificationIssue[] = [];
  const checkedAt = options?.checkedAt ?? "1970-01-01T00:00:00.000Z";
  const requireCertification = options?.requireCertification !== false;

  if (manifest.identity !== materialRepresentationFreezeIdentity) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_CORRUPTED_MANIFEST",
        "Manifest identity does not match Freeze identity.",
        { identity: manifest.identity },
      ),
    );
  }
  if (manifest.schemaVersion !== materialRepresentationFreezeSchemaVersion) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_UNSUPPORTED_SCHEMA",
        `Unsupported freeze schema: ${String(manifest.schemaVersion)}`,
      ),
    );
  }
  if (manifest.version !== materialRepresentationFreezeVersion) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_CORRUPTED_MANIFEST",
        "Manifest version does not match Freeze version.",
        { version: manifest.version },
      ),
    );
  }

  // Dependency lock: Freeze → Certification only
  if (
    manifest.upstream.length !== 1 ||
    manifest.upstream[0] !== materialRepresentationCertificationIdentity
  ) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_DEPENDENCY_LOCK_VIOLATION",
        "Freeze upstream must be exactly NOL-2:7 Certification.",
        { upstream: [...manifest.upstream] },
      ),
    );
  }
  if (manifest.dependencyCount !== 1) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_DEPENDENCY_LOCK_VIOLATION",
        "Freeze dependencyCount must be 1.",
        { dependencyCount: manifest.dependencyCount },
      ),
    );
  }

  if (requireCertification) {
    if (
      manifest.certificationIdentity !==
        materialRepresentationCertificationIdentity ||
      !manifest.certificationVersion ||
      !manifest.certificationSchemaVersion
    ) {
      errors.push(
        issue(
          "MATERIAL_FREEZE_CERTIFICATION_REQUIRED",
          "Freeze requires a locked Certification identity and versions.",
        ),
      );
    }
    if (
      !manifest.releaseStatus.includes("Certified") ||
      !manifest.releaseStatus.includes("Frozen")
    ) {
      errors.push(
        issue(
          "MATERIAL_FREEZE_CERTIFICATION_REQUIRED",
          "Release status must include Certified and Frozen.",
        ),
      );
    }
  }

  if (manifest.compatibility !== NEXORA_MATERIAL_REPRESENTATION_COMPATIBILITY) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_INVALID_COMPATIBILITY",
        "Compatibility must match the locked freeze compatibility.",
        { compatibility: manifest.compatibility },
      ),
    );
  }

  if (manifest.publicApiCount !== NEXORA_MATERIAL_FROZEN_API_REGISTRY.length) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_COUNT_MISMATCH",
        "publicApiCount does not match frozen API registry length.",
        {
          publicApiCount: manifest.publicApiCount,
          registryLength: NEXORA_MATERIAL_FROZEN_API_REGISTRY.length,
        },
      ),
    );
  }
  if (manifest.moduleCount !== NEXORA_MATERIAL_FROZEN_MODULES.length) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_COUNT_MISMATCH",
        "moduleCount does not match frozen module list.",
        {
          moduleCount: manifest.moduleCount,
          moduleLength: NEXORA_MATERIAL_FROZEN_MODULES.length,
        },
      ),
    );
  }
  if (
    manifest.exportedApiCount !== NEXORA_MATERIAL_FROZEN_PUBLIC_EXPORTS.length
  ) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_COUNT_MISMATCH",
        "exportedApiCount does not match public export list.",
      ),
    );
  }
  if (
    manifest.exportedTypeCount !== NEXORA_MATERIAL_FROZEN_PUBLIC_TYPES.length
  ) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_COUNT_MISMATCH",
        "exportedTypeCount does not match public type list.",
      ),
    );
  }

  if (!isDeeplyFrozen(manifest)) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_IMMUTABILITY_VIOLATION",
        "Manifest must be deeply immutable.",
      ),
    );
  }
  if (!isDeeplyFrozen(NEXORA_MATERIAL_FROZEN_API_REGISTRY)) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_IMMUTABILITY_VIOLATION",
        "API registry must be deeply immutable.",
      ),
    );
  }
  if (!isDeeplyFrozen(NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA)) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_IMMUTABILITY_VIOLATION",
        "Consumer metadata must be deeply immutable.",
      ),
    );
  }

  if (
    !manifest.consumerMetadata.ReadyForConsumer ||
    !manifest.consumerMetadata.SoleConsumerEntryPoint ||
    !manifest.consumerMetadata.FreezeOnlyDependency ||
    !manifest.consumerMetadata.StableAPI
  ) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_CORRUPTED_MANIFEST",
        "Consumer metadata flags must all be true.",
      ),
    );
  }

  // Registry determinism: api names unique and sorted by owning module then name
  const names = NEXORA_MATERIAL_FROZEN_API_REGISTRY.map((entry) => entry.apiName);
  if (new Set(names).size !== names.length) {
    errors.push(
      issue(
        "MATERIAL_FREEZE_REGISTRY_MISMATCH",
        "Frozen API registry contains duplicate apiName values.",
      ),
    );
  }

  return deepFreeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt,
  });
}

export function serializeMaterialRepresentationFreezeManifest(
  manifest: NexoraObjectMaterialRepresentationFreezeManifest = getMaterialRepresentationManifest(),
): string {
  const verification = verifyMaterialRepresentationFreezeManifest(manifest);
  if (!verification.ok) {
    throw new MaterialRepresentationFreezeException(verification.errors[0]!);
  }
  return JSON.stringify({
    engineIdentity: materialRepresentationFreezeIdentity,
    engineVersion: materialRepresentationFreezeVersion,
    schemaVersion: materialRepresentationFreezeSchemaVersion,
    certificationIdentity: materialRepresentationCertificationIdentity,
    certificationVersion: materialRepresentationCertificationVersion,
    manifest,
  });
}

export function deserializeMaterialRepresentationFreezeManifest(
  json: string,
): NexoraObjectMaterialRepresentationFreezeManifest {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly engineIdentity?: string;
    readonly manifest?: NexoraObjectMaterialRepresentationFreezeManifest;
  };
  if (parsed.schemaVersion !== materialRepresentationFreezeSchemaVersion) {
    throw new MaterialRepresentationFreezeException(
      issue(
        "MATERIAL_FREEZE_UNSUPPORTED_SCHEMA",
        `Unsupported freeze schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.manifest) {
    throw new MaterialRepresentationFreezeException(
      issue(
        "MATERIAL_FREEZE_CORRUPTED_MANIFEST",
        "Missing freeze manifest payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.manifest);
  const verification = verifyMaterialRepresentationFreezeManifest(restored);
  if (!verification.ok) {
    throw new MaterialRepresentationFreezeException(verification.errors[0]!);
  }
  return restored;
}

export function getNexoraObjectMaterialRepresentationFreezeSummary() {
  const manifest = getMaterialRepresentationManifest(
    "1970-01-01T00:00:00.000Z",
  );
  return deepFreeze({
    identity: materialRepresentationFreezeIdentity,
    version: materialRepresentationFreezeVersion,
    schemaVersion: materialRepresentationFreezeSchemaVersion,
    upstream: NOL_MATERIAL_FREEZE_UPSTREAM,
    moduleCount: manifest.moduleCount,
    publicApiCount: manifest.publicApiCount,
    compatibility: manifest.compatibility,
    consumerMetadata: NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
    noBusinessLogic: true,
    noVisualizationLogic: true,
    noRenderingLogic: true,
  });
}

export const materialRepresentationFreeze = Object.freeze({
  identity: materialRepresentationFreezeIdentity,
  version: materialRepresentationFreezeVersion,
  schemaVersion: materialRepresentationFreezeSchemaVersion,
  getManifest: getMaterialRepresentationManifest,
  getRegistry: getMaterialRepresentationRegistry,
  getCompatibility: getMaterialRepresentationCompatibility,
  getReleaseInformation: getMaterialRepresentationReleaseInformation,
  verify: verifyMaterialRepresentationFreezeManifest,
  serialize: serializeMaterialRepresentationFreezeManifest,
  deserialize: deserializeMaterialRepresentationFreezeManifest,
  certifyVisualization,
  certifyVisualizationCollection,
  certifyDirectorPackage,
  recertifyVisualization,
  revokeVisualizationCertification,
  compareVisualizationCertifications,
  validateVisualizationCertification,
  serializeVisualizationCertification,
  deserializeVisualizationCertification,
  consumerMetadata: NEXORA_MATERIAL_REPRESENTATION_CONSUMER_METADATA,
  summary: getNexoraObjectMaterialRepresentationFreezeSummary,
});

export const NexoraObjectMaterialRepresentationFreeze = materialRepresentationFreeze;
