/**
 * NOL-3:8 — NexoraObject Director Integration Freeze
 *
 * Immutable Release surface for the Director Integration platform.
 * Republishes only the certified public surface from NOL-3:7.
 * No validation, certification, Director execution, or rendering.
 *
 * Upstream: NOL-3:7 only.
 * Identity: NOL-3:8/NexoraObjectDirectorIntegrationFreeze
 */

import {
  NOL_DIRECTOR_CERTIFICATION_UPSTREAM,
  assertDirectorCertificationInvariants,
  certifyDirectorIntegration,
  compareDirectorCertifications,
  createDirectorCertificationStamp,
  deserializeDirectorCertification,
  deserializeDirectorCertificationReport,
  directorIntegrationCertificationIdentity,
  directorIntegrationCertificationSchemaVersion,
  directorIntegrationCertificationVersion,
  evaluateDirectorCertificationPolicy,
  expireDirectorCertification,
  getNexoraObjectDirectorIntegrationCertificationSummary,
  projectDirectorCertification,
  recertifyDirectorIntegration,
  revokeDirectorCertification,
  serializeDirectorCertification,
  serializeDirectorCertificationReport,
  validateDirectorCertification,
  validateDirectorCertificationReport,
  type NexoraDirectorCertificationComparison,
  type NexoraDirectorCertificationConsumerProjection,
  type NexoraDirectorCertificationDependencies,
  type NexoraDirectorCertificationDiagnosticsProjection,
  type NexoraDirectorCertificationError,
  type NexoraDirectorCertificationErrorCode,
  type NexoraDirectorCertificationHistoryEntry,
  type NexoraDirectorCertificationPlatformProjection,
  type NexoraDirectorCertificationPolicy,
  type NexoraDirectorCertificationPolicyEvaluation,
  type NexoraDirectorCertificationProfile,
  type NexoraDirectorCertificationProjection,
  type NexoraDirectorCertificationProjectionKind,
  type NexoraDirectorCertificationReleaseProjection,
  type NexoraDirectorCertificationReport,
  type NexoraDirectorCertificationRequest,
  type NexoraDirectorCertificationStamp,
  type NexoraDirectorCertificationStatus,
  type NexoraDirectorCertificationWarning,
  type NexoraDirectorCertificationWarningCode,
  type NexoraDirectorValidationProfile,
  type NexoraDirectorIntegrationValidationInput,
  type NexoraDirectorValidationReport,
} from "./nexoraObjectDirectorIntegrationCertification.ts";

// ─── Re-export certified public surface ─────────────────────────────────────

export {
  directorIntegrationCertificationIdentity,
  directorIntegrationCertificationVersion,
  directorIntegrationCertificationSchemaVersion,
  NOL_DIRECTOR_CERTIFICATION_UPSTREAM,
  certifyDirectorIntegration,
  recertifyDirectorIntegration,
  revokeDirectorCertification,
  expireDirectorCertification,
  compareDirectorCertifications,
  evaluateDirectorCertificationPolicy,
  createDirectorCertificationStamp,
  projectDirectorCertification,
  validateDirectorCertification,
  validateDirectorCertificationReport,
  assertDirectorCertificationInvariants,
  serializeDirectorCertification,
  deserializeDirectorCertification,
  serializeDirectorCertificationReport,
  deserializeDirectorCertificationReport,
  getNexoraObjectDirectorIntegrationCertificationSummary,
};

export type {
  NexoraDirectorCertificationProfile,
  NexoraDirectorCertificationStatus,
  NexoraDirectorCertificationStamp,
  NexoraDirectorCertificationHistoryEntry,
  NexoraDirectorCertificationWarningCode,
  NexoraDirectorCertificationErrorCode,
  NexoraDirectorCertificationWarning,
  NexoraDirectorCertificationError,
  NexoraDirectorCertificationReport,
  NexoraDirectorCertificationPolicy,
  NexoraDirectorCertificationProjectionKind,
  NexoraDirectorCertificationDependencies,
  NexoraDirectorCertificationRequest,
  NexoraDirectorCertificationPolicyEvaluation,
  NexoraDirectorCertificationComparison,
  NexoraDirectorCertificationConsumerProjection,
  NexoraDirectorCertificationPlatformProjection,
  NexoraDirectorCertificationReleaseProjection,
  NexoraDirectorCertificationDiagnosticsProjection,
  NexoraDirectorCertificationProjection,
  NexoraDirectorValidationProfile,
  NexoraDirectorIntegrationValidationInput,
  NexoraDirectorValidationReport,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorIntegrationFreezeIdentity =
  "NOL-3:8/NexoraObjectDirectorIntegrationFreeze" as const;

export const directorIntegrationFreezeVersion = "1.0.0" as const;

export const directorIntegrationFreezeSchemaVersion = "1.0.0" as const;

export const NOL_DIRECTOR_FREEZE_IDENTITY = directorIntegrationFreezeIdentity;
export const NOL_DIRECTOR_FREEZE_VERSION = directorIntegrationFreezeVersion;
export const NOL_DIRECTOR_FREEZE_SCHEMA_VERSION =
  directorIntegrationFreezeSchemaVersion;

/** Freeze depends exclusively on NOL-3:7. */
export const NOL_DIRECTOR_FREEZE_UPSTREAM = Object.freeze([
  directorIntegrationCertificationIdentity,
] as const);

// ─── Platform status / release metadata ─────────────────────────────────────

export type NexoraDirectorIntegrationReleaseStatus =
  | "Released"
  | "Certified"
  | "Frozen"
  | "Stable"
  | "ReadyForConsumer";

export const directorIntegrationFreezeStatus = Object.freeze([
  "Released",
  "Certified",
  "Frozen",
  "Stable",
  "ReadyForConsumer",
] as const satisfies readonly NexoraDirectorIntegrationReleaseStatus[]);

export type NexoraDirectorCompatibility =
  | "BackwardCompatible"
  | "ForwardCompatible"
  | "Breaking";

export const directorIntegrationCompatibility =
  "BackwardCompatible" as const satisfies NexoraDirectorCompatibility;

export const directorIntegrationReleaseInformation = Object.freeze({
  releaseChannel: "Stable",
  releaseStatus: "Released",
  platformStatus:
    "Released · Certified · Frozen · Stable · ReadyForConsumer",
  consumerEntry: "PublicIndex",
  soleDependency: "NOL-3:7",
  compatibility: directorIntegrationCompatibility,
  ReadyForConsumer: true,
  SoleConsumerEntryPoint: true,
  FreezeOnlyDependency: true,
  StableAPI: true,
} as const);

// ─── Locked Director Integration modules (documented strings only) ───────────

export type NexoraDirectorFrozenModuleName =
  | "DirectorIntegrationFoundation"
  | "DirectorSceneBinding"
  | "DirectorSceneSynchronization"
  | "DirectorInteractionRouting"
  | "DirectorCameraFocus"
  | "DirectorValidation"
  | "DirectorCertification";

export const NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES = Object.freeze({
  DirectorIntegrationFoundation:
    "NOL-3:1/NexoraObjectDirectorIntegrationFoundation",
  DirectorSceneBinding: "NOL-3:2/NexoraObjectDirectorSceneBindingModel",
  DirectorSceneSynchronization:
    "NOL-3:3/NexoraObjectDirectorSceneSynchronizationEngine",
  DirectorInteractionRouting:
    "NOL-3:4/NexoraObjectDirectorInteractionRoutingEngine",
  DirectorCameraFocus:
    "NOL-3:5/NexoraObjectDirectorCameraFocusCoordinationEngine",
  DirectorValidation:
    "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine",
  DirectorCertification: directorIntegrationCertificationIdentity,
} as const);

export interface NexoraDirectorFrozenModuleDescriptor {
  readonly name: NexoraDirectorFrozenModuleName;
  readonly identity: string;
  readonly phase: number;
  readonly version: string;
  readonly schemaVersion: string;
  readonly status: "Frozen";
}

export const NEXORA_DIRECTOR_FROZEN_MODULES: readonly NexoraDirectorFrozenModuleDescriptor[] =
  Object.freeze([
    Object.freeze({
      name: "DirectorIntegrationFoundation" as const,
      identity:
        NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES.DirectorIntegrationFoundation,
      phase: 1,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "DirectorSceneBinding" as const,
      identity: NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES.DirectorSceneBinding,
      phase: 2,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "DirectorSceneSynchronization" as const,
      identity:
        NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES.DirectorSceneSynchronization,
      phase: 3,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "DirectorInteractionRouting" as const,
      identity:
        NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES.DirectorInteractionRouting,
      phase: 4,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "DirectorCameraFocus" as const,
      identity: NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES.DirectorCameraFocus,
      phase: 5,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "DirectorValidation" as const,
      identity: NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES.DirectorValidation,
      phase: 6,
      version: "1.0.0",
      schemaVersion: "1.0.0",
      status: "Frozen" as const,
    }),
    Object.freeze({
      name: "DirectorCertification" as const,
      identity: directorIntegrationCertificationIdentity,
      phase: 7,
      version: directorIntegrationCertificationVersion,
      schemaVersion: directorIntegrationCertificationSchemaVersion,
      status: "Frozen" as const,
    }),
  ]);

// ─── Public API registry (certified surface only) ───────────────────────────

export interface NexoraDirectorFrozenApiRegistryEntry {
  readonly apiIdentity: string;
  readonly apiName: string;
  readonly version: string;
  readonly status: "Stable";
  readonly compatibility: NexoraDirectorCompatibility;
  readonly owningModule: "DirectorCertification" | "DirectorFreeze";
}

const CERTIFIED_API_NAMES = Object.freeze([
  "certifyDirectorIntegration",
  "recertifyDirectorIntegration",
  "revokeDirectorCertification",
  "expireDirectorCertification",
  "compareDirectorCertifications",
  "evaluateDirectorCertificationPolicy",
  "createDirectorCertificationStamp",
  "projectDirectorCertification",
  "validateDirectorCertification",
  "validateDirectorCertificationReport",
  "assertDirectorCertificationInvariants",
  "serializeDirectorCertification",
  "deserializeDirectorCertification",
  "serializeDirectorCertificationReport",
  "deserializeDirectorCertificationReport",
  "getNexoraObjectDirectorIntegrationCertificationSummary",
] as const);

const FREEZE_API_NAMES = Object.freeze([
  "createDirectorIntegrationFreezeManifest",
  "projectDirectorFreeze",
  "verifyDirectorFreeze",
  "compareDirectorFreeze",
  "getDirectorPublicApiRegistry",
  "validateDirectorFreeze",
  "assertDirectorFreezeInvariants",
  "serializeDirectorFreeze",
  "deserializeDirectorFreeze",
  "serializeDirectorFreezeManifest",
  "deserializeDirectorFreezeManifest",
] as const);

export const directorIntegrationPublicApiRegistry: readonly NexoraDirectorFrozenApiRegistryEntry[] =
  Object.freeze([
    ...CERTIFIED_API_NAMES.map((apiName) =>
      Object.freeze({
        apiIdentity: `${directorIntegrationCertificationIdentity}/${apiName}`,
        apiName,
        version: directorIntegrationCertificationVersion,
        status: "Stable" as const,
        compatibility: directorIntegrationCompatibility,
        owningModule: "DirectorCertification" as const,
      }),
    ),
    ...FREEZE_API_NAMES.map((apiName) =>
      Object.freeze({
        apiIdentity: `${directorIntegrationFreezeIdentity}/${apiName}`,
        apiName,
        version: directorIntegrationFreezeVersion,
        status: "Stable" as const,
        compatibility: directorIntegrationCompatibility,
        owningModule: "DirectorFreeze" as const,
      }),
    ),
  ]);

export const NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS: readonly string[] =
  Object.freeze([
    ...CERTIFIED_API_NAMES,
    ...FREEZE_API_NAMES,
    "directorIntegrationFreezeIdentity",
    "directorIntegrationFreezeVersion",
    "directorIntegrationFreezeSchemaVersion",
    "directorIntegrationCertificationIdentity",
    "directorIntegrationFreezeManifest",
    "directorIntegrationPublicApiRegistry",
    "directorIntegrationReleaseInformation",
    "directorIntegrationCompatibility",
    "directorIntegrationFreezeStatus",
  ]);

export const NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES: readonly string[] =
  Object.freeze([
    "NexoraDirectorCertificationProfile",
    "NexoraDirectorCertificationStatus",
    "NexoraDirectorCertificationStamp",
    "NexoraDirectorCertificationReport",
    "NexoraDirectorIntegrationFreezeManifest",
    "NexoraDirectorFrozenApiRegistryEntry",
    "NexoraDirectorCompatibility",
    "NexoraDirectorFreezeProjection",
  ]);

// ─── Manifest ───────────────────────────────────────────────────────────────

export interface NexoraDirectorIntegrationFreezeManifest {
  readonly identity: typeof directorIntegrationFreezeIdentity;
  readonly version: typeof directorIntegrationFreezeVersion;
  readonly schemaVersion: typeof directorIntegrationFreezeSchemaVersion;
  readonly releaseVersion: typeof directorIntegrationFreezeVersion;
  readonly certificationIdentity: typeof directorIntegrationCertificationIdentity;
  readonly certificationVersion: typeof directorIntegrationCertificationVersion;
  readonly certificationSchemaVersion: typeof directorIntegrationCertificationSchemaVersion;
  readonly compatibility: NexoraDirectorCompatibility;
  readonly dependency: typeof NOL_DIRECTOR_FREEZE_UPSTREAM;
  readonly releaseStatus: readonly NexoraDirectorIntegrationReleaseStatus[];
  readonly platformStatus: typeof directorIntegrationReleaseInformation.platformStatus;
  readonly releaseChannel: typeof directorIntegrationReleaseInformation.releaseChannel;
  readonly consumerEntry: typeof directorIntegrationReleaseInformation.consumerEntry;
  readonly soleDependency: typeof directorIntegrationReleaseInformation.soleDependency;
  readonly publicApiCount: number;
  readonly dependencyCount: number;
  readonly moduleCount: number;
  readonly exportedTypeCount: number;
  readonly exportedApiCount: number;
  readonly freezeTimestamp: string;
  readonly readinessFlags: typeof directorIntegrationReleaseInformation;
  readonly upstream: typeof NOL_DIRECTOR_FREEZE_UPSTREAM;
  readonly certificationUpstream: typeof NOL_DIRECTOR_CERTIFICATION_UPSTREAM;
}

export type NexoraDirectorFreezeProjectionKind =
  | "Consumer"
  | "Platform"
  | "Diagnostics"
  | "Release";

export interface NexoraDirectorFreezeProjection {
  readonly kind: NexoraDirectorFreezeProjectionKind;
  readonly identity: typeof directorIntegrationFreezeIdentity;
  readonly version: typeof directorIntegrationFreezeVersion;
  readonly compatibility: NexoraDirectorCompatibility;
  readonly platformStatus: typeof directorIntegrationReleaseInformation.platformStatus;
  readonly publicApiCount?: number;
  readonly certificationIdentity?: typeof directorIntegrationCertificationIdentity;
  readonly moduleCount?: number;
  readonly registry?: readonly NexoraDirectorFrozenApiRegistryEntry[];
  readonly releaseInformation?: typeof directorIntegrationReleaseInformation;
  readonly manifest?: NexoraDirectorIntegrationFreezeManifest;
}

export interface NexoraDirectorFreezeComparison {
  readonly equal: boolean;
  readonly identityMatch: boolean;
  readonly versionMatch: boolean;
  readonly schemaMatch: boolean;
  readonly compatibilityMatch: boolean;
  readonly publicApiCountDelta: number;
  readonly moduleCountDelta: number;
  readonly certificationVersionMatch: boolean;
}

export type NexoraDirectorFreezeErrorCode =
  | "DIRECTOR_FREEZE_CORRUPTED_MANIFEST"
  | "DIRECTOR_FREEZE_UNSUPPORTED_SCHEMA"
  | "DIRECTOR_FREEZE_DEPENDENCY_LOCK_VIOLATION"
  | "DIRECTOR_FREEZE_CERTIFICATION_REQUIRED"
  | "DIRECTOR_FREEZE_REGISTRY_MISMATCH"
  | "DIRECTOR_FREEZE_COUNT_MISMATCH"
  | "DIRECTOR_FREEZE_IMMUTABILITY_VIOLATION"
  | "DIRECTOR_FREEZE_INVALID_COMPATIBILITY"
  | "DIRECTOR_FREEZE_VERSION_LOCK_VIOLATION"
  | "DIRECTOR_FREEZE_STATUS_MISMATCH";

export interface NexoraDirectorFreezeIssue {
  readonly code: NexoraDirectorFreezeErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorFreezeVerificationResult {
  readonly ok: boolean;
  readonly errors: readonly NexoraDirectorFreezeIssue[];
  readonly warnings: readonly NexoraDirectorFreezeIssue[];
  readonly checkedAt: string;
}

export class NexoraDirectorIntegrationFreezeException extends Error {
  readonly code: NexoraDirectorFreezeErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(issueValue: NexoraDirectorFreezeIssue) {
    super(issueValue.message);
    this.name = "NexoraDirectorIntegrationFreezeException";
    this.code = issueValue.code;
    this.details = issueValue.details;
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
  code: NexoraDirectorFreezeErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraDirectorFreezeIssue {
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

// ─── Manifest / registry APIs ───────────────────────────────────────────────

export function createDirectorIntegrationFreezeManifest(
  freezeTimestamp = "1970-01-01T00:00:00.000Z",
): NexoraDirectorIntegrationFreezeManifest {
  return deepFreeze({
    identity: directorIntegrationFreezeIdentity,
    version: directorIntegrationFreezeVersion,
    schemaVersion: directorIntegrationFreezeSchemaVersion,
    releaseVersion: directorIntegrationFreezeVersion,
    certificationIdentity: directorIntegrationCertificationIdentity,
    certificationVersion: directorIntegrationCertificationVersion,
    certificationSchemaVersion: directorIntegrationCertificationSchemaVersion,
    compatibility: directorIntegrationCompatibility,
    dependency: NOL_DIRECTOR_FREEZE_UPSTREAM,
    releaseStatus: directorIntegrationFreezeStatus,
    platformStatus: directorIntegrationReleaseInformation.platformStatus,
    releaseChannel: directorIntegrationReleaseInformation.releaseChannel,
    consumerEntry: directorIntegrationReleaseInformation.consumerEntry,
    soleDependency: directorIntegrationReleaseInformation.soleDependency,
    publicApiCount: directorIntegrationPublicApiRegistry.length,
    dependencyCount: NOL_DIRECTOR_FREEZE_UPSTREAM.length,
    moduleCount: NEXORA_DIRECTOR_FROZEN_MODULES.length,
    exportedTypeCount: NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES.length,
    exportedApiCount: NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS.length,
    freezeTimestamp,
    readinessFlags: directorIntegrationReleaseInformation,
    upstream: NOL_DIRECTOR_FREEZE_UPSTREAM,
    certificationUpstream: NOL_DIRECTOR_CERTIFICATION_UPSTREAM,
  });
}

/** Canonical frozen manifest instance for consumers. */
export const directorIntegrationFreezeManifest =
  createDirectorIntegrationFreezeManifest("1970-01-01T00:00:00.000Z");

export function getDirectorPublicApiRegistry(): readonly NexoraDirectorFrozenApiRegistryEntry[] {
  return directorIntegrationPublicApiRegistry;
}

export function projectDirectorFreeze(
  kind: NexoraDirectorFreezeProjectionKind,
  manifest: NexoraDirectorIntegrationFreezeManifest = directorIntegrationFreezeManifest,
): NexoraDirectorFreezeProjection {
  if (kind === "Consumer") {
    return deepFreeze({
      kind,
      identity: directorIntegrationFreezeIdentity,
      version: directorIntegrationFreezeVersion,
      compatibility: directorIntegrationCompatibility,
      platformStatus: directorIntegrationReleaseInformation.platformStatus,
      publicApiCount: manifest.publicApiCount,
      releaseInformation: directorIntegrationReleaseInformation,
    });
  }
  if (kind === "Platform") {
    return deepFreeze({
      kind,
      identity: directorIntegrationFreezeIdentity,
      version: directorIntegrationFreezeVersion,
      compatibility: directorIntegrationCompatibility,
      platformStatus: directorIntegrationReleaseInformation.platformStatus,
      publicApiCount: manifest.publicApiCount,
      certificationIdentity: directorIntegrationCertificationIdentity,
      moduleCount: manifest.moduleCount,
      releaseInformation: directorIntegrationReleaseInformation,
    });
  }
  if (kind === "Release") {
    return deepFreeze({
      kind,
      identity: directorIntegrationFreezeIdentity,
      version: directorIntegrationFreezeVersion,
      compatibility: directorIntegrationCompatibility,
      platformStatus: directorIntegrationReleaseInformation.platformStatus,
      publicApiCount: manifest.publicApiCount,
      certificationIdentity: directorIntegrationCertificationIdentity,
      moduleCount: manifest.moduleCount,
      releaseInformation: directorIntegrationReleaseInformation,
      manifest,
    });
  }
  return deepFreeze({
    kind: "Diagnostics",
    identity: directorIntegrationFreezeIdentity,
    version: directorIntegrationFreezeVersion,
    compatibility: directorIntegrationCompatibility,
    platformStatus: directorIntegrationReleaseInformation.platformStatus,
    publicApiCount: manifest.publicApiCount,
    certificationIdentity: directorIntegrationCertificationIdentity,
    moduleCount: manifest.moduleCount,
    registry: directorIntegrationPublicApiRegistry,
    releaseInformation: directorIntegrationReleaseInformation,
    manifest,
  });
}

export function verifyDirectorFreeze(
  manifest: NexoraDirectorIntegrationFreezeManifest = directorIntegrationFreezeManifest,
  options?: {
    readonly checkedAt?: string;
    readonly requireCertification?: boolean;
  },
): NexoraDirectorFreezeVerificationResult {
  const errors: NexoraDirectorFreezeIssue[] = [];
  const warnings: NexoraDirectorFreezeIssue[] = [];
  const checkedAt = options?.checkedAt ?? "1970-01-01T00:00:00.000Z";
  const requireCertification = options?.requireCertification !== false;

  if (manifest.identity !== directorIntegrationFreezeIdentity) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_CORRUPTED_MANIFEST",
        "Manifest identity does not match Freeze identity.",
        { identity: manifest.identity },
      ),
    );
  }
  if (manifest.schemaVersion !== directorIntegrationFreezeSchemaVersion) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_UNSUPPORTED_SCHEMA",
        `Unsupported freeze schema: ${String(manifest.schemaVersion)}`,
      ),
    );
  }
  if (manifest.version !== directorIntegrationFreezeVersion) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_VERSION_LOCK_VIOLATION",
        "Manifest version does not match Freeze version.",
        { version: manifest.version },
      ),
    );
  }
  if (manifest.releaseVersion !== directorIntegrationFreezeVersion) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_VERSION_LOCK_VIOLATION",
        "Release version must match Freeze version.",
        { releaseVersion: manifest.releaseVersion },
      ),
    );
  }

  if (
    manifest.upstream.length !== 1 ||
    manifest.upstream[0] !== directorIntegrationCertificationIdentity ||
    manifest.dependency.length !== 1 ||
    manifest.dependency[0] !== directorIntegrationCertificationIdentity
  ) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_DEPENDENCY_LOCK_VIOLATION",
        "Freeze upstream/dependency must be exactly NOL-3:7 Certification.",
        {
          upstream: [...manifest.upstream],
          dependency: [...manifest.dependency],
        },
      ),
    );
  }
  if (manifest.dependencyCount !== 1) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_DEPENDENCY_LOCK_VIOLATION",
        "Freeze dependencyCount must be 1.",
        { dependencyCount: manifest.dependencyCount },
      ),
    );
  }
  if (manifest.soleDependency !== "NOL-3:7") {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_DEPENDENCY_LOCK_VIOLATION",
        "soleDependency metadata must be NOL-3:7.",
        { soleDependency: manifest.soleDependency },
      ),
    );
  }

  if (requireCertification) {
    if (
      manifest.certificationIdentity !==
        directorIntegrationCertificationIdentity ||
      !manifest.certificationVersion ||
      !manifest.certificationSchemaVersion
    ) {
      errors.push(
        issue(
          "DIRECTOR_FREEZE_CERTIFICATION_REQUIRED",
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
          "DIRECTOR_FREEZE_CERTIFICATION_REQUIRED",
          "Release status must include Certified and Frozen.",
        ),
      );
    }
  }

  if (manifest.compatibility !== directorIntegrationCompatibility) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_INVALID_COMPATIBILITY",
        "Compatibility must match the locked freeze compatibility.",
        { compatibility: manifest.compatibility },
      ),
    );
  }

  const expectedStatus = [
    "Released",
    "Certified",
    "Frozen",
    "Stable",
    "ReadyForConsumer",
  ];
  if (
    manifest.releaseStatus.length !== expectedStatus.length ||
    expectedStatus.some((flag, index) => manifest.releaseStatus[index] !== flag)
  ) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_STATUS_MISMATCH",
        "Release status flags must be exact and ordered.",
        { releaseStatus: [...manifest.releaseStatus] },
      ),
    );
  }
  if (
    manifest.platformStatus !==
    directorIntegrationReleaseInformation.platformStatus
  ) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_STATUS_MISMATCH",
        "platformStatus must match locked release metadata.",
        { platformStatus: manifest.platformStatus },
      ),
    );
  }

  if (
    manifest.publicApiCount !== directorIntegrationPublicApiRegistry.length
  ) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_COUNT_MISMATCH",
        "publicApiCount does not match frozen API registry length.",
        {
          publicApiCount: manifest.publicApiCount,
          registryLength: directorIntegrationPublicApiRegistry.length,
        },
      ),
    );
  }
  if (manifest.moduleCount !== NEXORA_DIRECTOR_FROZEN_MODULES.length) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_COUNT_MISMATCH",
        "moduleCount does not match frozen module list.",
      ),
    );
  }
  if (
    manifest.exportedApiCount !== NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS.length
  ) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_COUNT_MISMATCH",
        "exportedApiCount does not match public export list.",
      ),
    );
  }
  if (
    manifest.exportedTypeCount !== NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES.length
  ) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_COUNT_MISMATCH",
        "exportedTypeCount does not match public type list.",
      ),
    );
  }

  if (!isDeeplyFrozen(manifest)) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_IMMUTABILITY_VIOLATION",
        "Manifest must be deeply immutable.",
      ),
    );
  }
  if (!isDeeplyFrozen(directorIntegrationPublicApiRegistry)) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_IMMUTABILITY_VIOLATION",
        "API registry must be deeply immutable.",
      ),
    );
  }
  if (!isDeeplyFrozen(directorIntegrationReleaseInformation)) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_IMMUTABILITY_VIOLATION",
        "Release metadata must be deeply immutable.",
      ),
    );
  }

  const names = directorIntegrationPublicApiRegistry.map(
    (entry) => entry.apiName,
  );
  if (new Set(names).size !== names.length) {
    errors.push(
      issue(
        "DIRECTOR_FREEZE_REGISTRY_MISMATCH",
        "Frozen API registry contains duplicate apiName values.",
      ),
    );
  }

  const certifiedNames = new Set<string>(CERTIFIED_API_NAMES);
  for (const entry of directorIntegrationPublicApiRegistry) {
    if (
      entry.owningModule === "DirectorCertification" &&
      !certifiedNames.has(entry.apiName)
    ) {
      errors.push(
        issue(
          "DIRECTOR_FREEZE_REGISTRY_MISMATCH",
          "Registry entry is not derived from Certification public APIs.",
          { apiName: entry.apiName },
        ),
      );
    }
  }

  return deepFreeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt,
  });
}

export function validateDirectorFreeze(
  manifest: NexoraDirectorIntegrationFreezeManifest = directorIntegrationFreezeManifest,
): NexoraDirectorFreezeVerificationResult {
  return verifyDirectorFreeze(manifest);
}

export function assertDirectorFreezeInvariants(
  manifest: NexoraDirectorIntegrationFreezeManifest = directorIntegrationFreezeManifest,
): void {
  const result = verifyDirectorFreeze(manifest);
  if (!result.ok) {
    throw new NexoraDirectorIntegrationFreezeException(result.errors[0]!);
  }
}

export function compareDirectorFreeze(
  left: NexoraDirectorIntegrationFreezeManifest,
  right: NexoraDirectorIntegrationFreezeManifest,
): NexoraDirectorFreezeComparison {
  return deepFreeze({
    equal:
      left.identity === right.identity &&
      left.version === right.version &&
      left.schemaVersion === right.schemaVersion &&
      left.compatibility === right.compatibility &&
      left.publicApiCount === right.publicApiCount &&
      left.moduleCount === right.moduleCount &&
      left.certificationVersion === right.certificationVersion,
    identityMatch: left.identity === right.identity,
    versionMatch: left.version === right.version,
    schemaMatch: left.schemaVersion === right.schemaVersion,
    compatibilityMatch: left.compatibility === right.compatibility,
    publicApiCountDelta: right.publicApiCount - left.publicApiCount,
    moduleCountDelta: right.moduleCount - left.moduleCount,
    certificationVersionMatch:
      left.certificationVersion === right.certificationVersion,
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeDirectorFreezeManifest(
  manifest: NexoraDirectorIntegrationFreezeManifest = directorIntegrationFreezeManifest,
): string {
  const verification = verifyDirectorFreeze(manifest);
  if (!verification.ok) {
    throw new NexoraDirectorIntegrationFreezeException(verification.errors[0]!);
  }
  return JSON.stringify({
    identity: directorIntegrationFreezeIdentity,
    version: directorIntegrationFreezeVersion,
    schemaVersion: directorIntegrationFreezeSchemaVersion,
    certificationIdentity: directorIntegrationCertificationIdentity,
    certificationVersion: directorIntegrationCertificationVersion,
    manifest,
  });
}

export function deserializeDirectorFreezeManifest(
  json: string,
): NexoraDirectorIntegrationFreezeManifest {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly identity?: string;
    readonly manifest?: NexoraDirectorIntegrationFreezeManifest;
  };
  if (parsed.schemaVersion !== directorIntegrationFreezeSchemaVersion) {
    throw new NexoraDirectorIntegrationFreezeException(
      issue(
        "DIRECTOR_FREEZE_UNSUPPORTED_SCHEMA",
        `Unsupported freeze schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (parsed.identity !== directorIntegrationFreezeIdentity) {
    throw new NexoraDirectorIntegrationFreezeException(
      issue(
        "DIRECTOR_FREEZE_CORRUPTED_MANIFEST",
        "Serialized freeze identity mismatch.",
        { identity: parsed.identity },
      ),
    );
  }
  if (!parsed.manifest) {
    throw new NexoraDirectorIntegrationFreezeException(
      issue(
        "DIRECTOR_FREEZE_CORRUPTED_MANIFEST",
        "Missing freeze manifest payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.manifest);
  assertDirectorFreezeInvariants(restored);
  return restored;
}

export function serializeDirectorFreeze(
  manifest: NexoraDirectorIntegrationFreezeManifest = directorIntegrationFreezeManifest,
): string {
  return serializeDirectorFreezeManifest(manifest);
}

export function deserializeDirectorFreeze(
  json: string,
): NexoraDirectorIntegrationFreezeManifest {
  return deserializeDirectorFreezeManifest(json);
}

export function getNexoraObjectDirectorIntegrationFreezeSummary() {
  const manifest = directorIntegrationFreezeManifest;
  return deepFreeze({
    identity: directorIntegrationFreezeIdentity,
    version: directorIntegrationFreezeVersion,
    schemaVersion: directorIntegrationFreezeSchemaVersion,
    upstream: NOL_DIRECTOR_FREEZE_UPSTREAM,
    moduleCount: manifest.moduleCount,
    publicApiCount: manifest.publicApiCount,
    compatibility: manifest.compatibility,
    releaseInformation: directorIntegrationReleaseInformation,
    noBusinessLogic: true,
    noValidationLogic: true,
    noCertificationLogic: true,
    noRenderingLogic: true,
  });
}

export const NexoraObjectDirectorIntegrationFreeze = Object.freeze({
  identity: directorIntegrationFreezeIdentity,
  version: directorIntegrationFreezeVersion,
  schemaVersion: directorIntegrationFreezeSchemaVersion,
  manifest: directorIntegrationFreezeManifest,
  registry: directorIntegrationPublicApiRegistry,
  releaseInformation: directorIntegrationReleaseInformation,
  compatibility: directorIntegrationCompatibility,
  status: directorIntegrationFreezeStatus,
  createManifest: createDirectorIntegrationFreezeManifest,
  project: projectDirectorFreeze,
  verify: verifyDirectorFreeze,
  compare: compareDirectorFreeze,
  validate: validateDirectorFreeze,
  assert: assertDirectorFreezeInvariants,
  serialize: serializeDirectorFreeze,
  deserialize: deserializeDirectorFreeze,
  certifyDirectorIntegration,
  recertifyDirectorIntegration,
  revokeDirectorCertification,
  expireDirectorCertification,
  compareDirectorCertifications,
  evaluateDirectorCertificationPolicy,
  projectDirectorCertification,
  summary: getNexoraObjectDirectorIntegrationFreezeSummary,
});
