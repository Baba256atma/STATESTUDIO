/**
 * NOL-3:9 — NexoraObject Director Integration Public Index
 *
 * Sole supported consumer doorway into NOL-3 Director Integration.
 * Publishes the Freeze-locked platform surface — no new engine logic.
 *
 * Upstream: NOL-3:8 Director Integration Freeze only.
 * Identity: NOL-3:9/NexoraObjectDirectorIntegrationPublicIndex
 *
 * Consumer import path:
 *   @/app/lib/nol/nexoraObjectDirectorIntegrationPublicIndex
 */

import {
  NEXORA_DIRECTOR_FROZEN_MODULES,
  NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES,
  NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS,
  NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES,
  NOL_DIRECTOR_FREEZE_IDENTITY,
  NOL_DIRECTOR_FREEZE_SCHEMA_VERSION,
  NOL_DIRECTOR_FREEZE_UPSTREAM,
  NOL_DIRECTOR_FREEZE_VERSION,
  NexoraObjectDirectorIntegrationFreeze,
  assertDirectorCertificationInvariants,
  assertDirectorFreezeInvariants,
  certifyDirectorIntegration,
  compareDirectorCertifications,
  compareDirectorFreeze,
  createDirectorCertificationStamp,
  createDirectorIntegrationFreezeManifest,
  deserializeDirectorCertification,
  deserializeDirectorCertificationReport,
  deserializeDirectorFreeze,
  deserializeDirectorFreezeManifest,
  directorIntegrationCertificationIdentity,
  directorIntegrationCertificationSchemaVersion,
  directorIntegrationCertificationVersion,
  directorIntegrationCompatibility,
  directorIntegrationFreezeIdentity,
  directorIntegrationFreezeManifest,
  directorIntegrationFreezeSchemaVersion,
  directorIntegrationFreezeStatus,
  directorIntegrationFreezeVersion,
  directorIntegrationPublicApiRegistry,
  directorIntegrationReleaseInformation,
  evaluateDirectorCertificationPolicy,
  expireDirectorCertification,
  getDirectorPublicApiRegistry,
  getNexoraObjectDirectorIntegrationCertificationSummary,
  getNexoraObjectDirectorIntegrationFreezeSummary,
  projectDirectorCertification,
  projectDirectorFreeze,
  recertifyDirectorIntegration,
  revokeDirectorCertification,
  serializeDirectorCertification,
  serializeDirectorCertificationReport,
  serializeDirectorFreeze,
  serializeDirectorFreezeManifest,
  validateDirectorCertification,
  validateDirectorCertificationReport,
  validateDirectorFreeze,
  verifyDirectorFreeze,
  type NexoraDirectorCompatibility,
  type NexoraDirectorFrozenApiRegistryEntry,
  type NexoraDirectorFrozenModuleDescriptor,
  type NexoraDirectorIntegrationFreezeManifest,
  type NexoraDirectorFreezeComparison,
  type NexoraDirectorFreezeProjection,
  type NexoraDirectorFreezeVerificationResult,
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
  type NexoraDirectorIntegrationValidationInput,
  type NexoraDirectorValidationProfile,
  type NexoraDirectorValidationReport,
} from "./director/nexoraObjectDirectorIntegrationFreeze.ts";

// ─── Re-export frozen public surface (no wrapping, no signature changes) ────

export {
  directorIntegrationCertificationIdentity,
  directorIntegrationCertificationVersion,
  directorIntegrationCertificationSchemaVersion,
  directorIntegrationFreezeIdentity,
  directorIntegrationFreezeVersion,
  directorIntegrationFreezeSchemaVersion,
  NOL_DIRECTOR_FREEZE_IDENTITY,
  NOL_DIRECTOR_FREEZE_VERSION,
  NOL_DIRECTOR_FREEZE_SCHEMA_VERSION,
  NOL_DIRECTOR_FREEZE_UPSTREAM,
  directorIntegrationFreezeStatus,
  directorIntegrationCompatibility,
  directorIntegrationReleaseInformation,
  directorIntegrationPublicApiRegistry,
  directorIntegrationFreezeManifest,
  NEXORA_DIRECTOR_FROZEN_MODULES,
  NEXORA_DIRECTOR_FROZEN_MODULE_IDENTITIES,
  NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS,
  NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES,
  NexoraObjectDirectorIntegrationFreeze,
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
  createDirectorIntegrationFreezeManifest,
  projectDirectorFreeze,
  verifyDirectorFreeze,
  compareDirectorFreeze,
  getDirectorPublicApiRegistry,
  validateDirectorFreeze,
  assertDirectorFreezeInvariants,
  serializeDirectorFreezeManifest,
  deserializeDirectorFreezeManifest,
  serializeDirectorFreeze,
  deserializeDirectorFreeze,
  getNexoraObjectDirectorIntegrationFreezeSummary,
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
  NexoraDirectorCompatibility,
  NexoraDirectorFrozenApiRegistryEntry,
  NexoraDirectorFrozenModuleDescriptor,
  NexoraDirectorIntegrationFreezeManifest,
  NexoraDirectorFreezeProjection,
  NexoraDirectorFreezeComparison,
  NexoraDirectorFreezeVerificationResult,
};

// ─── Public Index identity ──────────────────────────────────────────────────

export const directorIntegrationPublicIndexIdentity =
  "NOL-3:9/NexoraObjectDirectorIntegrationPublicIndex" as const;

export const directorIntegrationPublicIndexVersion = "1.0.0" as const;

export const directorIntegrationPublicIndexSchemaVersion = "1.0.0" as const;

export const directorIntegrationPublicIndexUpstream =
  directorIntegrationFreezeIdentity;

export const directorIntegrationPublicIndexStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

export const DIRECTOR_INTEGRATION_CONSUMER_IMPORT_PATH =
  "@/app/lib/nol/nexoraObjectDirectorIntegrationPublicIndex" as const;

// ─── Exactly nine ordered namespace sections ─────────────────────────────────

export const DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Public Types",
  "Public APIs",
  "Validation",
  "Certification",
  "Release Information",
  "Compatibility",
  "Registry",
  "Consumer Information",
] as const);

export const directorIntegrationNamespaceSectionCount =
  DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS.length;

// ─── Consumer rules ─────────────────────────────────────────────────────────

export const DIRECTOR_INTEGRATION_CONSUMER_RULES = Object.freeze([
  "Imports Freeze only",
  "No direct imports from NOL-3:1–3:7",
  "No renderer implementation",
  "No Runtime implementation",
  "No Workspace implementation",
  "No Timeline implementation",
  "No React or Three.js imports",
  "No business logic",
] as const);

const BLOCKED_DIRECTOR_UPSTREAM_IDENTITIES = Object.freeze([
  "NOL-3:1/NexoraObjectDirectorIntegrationFoundation",
  "NOL-3:2/NexoraObjectDirectorSceneBindingModel",
  "NOL-3:3/NexoraObjectDirectorSceneSynchronizationEngine",
  "NOL-3:4/NexoraObjectDirectorInteractionRoutingEngine",
  "NOL-3:5/NexoraObjectDirectorCameraFocusCoordinationEngine",
  "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine",
  "NOL-3:7/NexoraObjectDirectorIntegrationCertification",
] as const);

// ─── Derived freeze-backed constants ────────────────────────────────────────

export const directorIntegrationRegistry = getDirectorPublicApiRegistry();

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DirectorIntegrationPublicIndexIdentityNamespace {
  readonly publicIndexIdentity: typeof directorIntegrationPublicIndexIdentity;
  readonly version: typeof directorIntegrationPublicIndexVersion;
  readonly schemaVersion: typeof directorIntegrationPublicIndexSchemaVersion;
  readonly freezeIdentity: typeof directorIntegrationFreezeIdentity;
  readonly certificationIdentity: typeof directorIntegrationCertificationIdentity;
  readonly upstreamIdentity: typeof directorIntegrationFreezeIdentity;
  readonly status: typeof directorIntegrationPublicIndexStatus;
}

export interface DirectorIntegrationPublicTypesNamespace {
  readonly typeNames: typeof NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES;
  readonly exportedTypeCount: number;
}

export interface DirectorIntegrationPublicApisNamespace {
  readonly certifyDirectorIntegration: typeof certifyDirectorIntegration;
  readonly recertifyDirectorIntegration: typeof recertifyDirectorIntegration;
  readonly revokeDirectorCertification: typeof revokeDirectorCertification;
  readonly expireDirectorCertification: typeof expireDirectorCertification;
  readonly compareDirectorCertifications: typeof compareDirectorCertifications;
  readonly evaluateDirectorCertificationPolicy: typeof evaluateDirectorCertificationPolicy;
  readonly createDirectorCertificationStamp: typeof createDirectorCertificationStamp;
  readonly projectDirectorCertification: typeof projectDirectorCertification;
  readonly validateDirectorCertification: typeof validateDirectorCertification;
  readonly validateDirectorCertificationReport: typeof validateDirectorCertificationReport;
  readonly assertDirectorCertificationInvariants: typeof assertDirectorCertificationInvariants;
  readonly serializeDirectorCertification: typeof serializeDirectorCertification;
  readonly deserializeDirectorCertification: typeof deserializeDirectorCertification;
  readonly serializeDirectorCertificationReport: typeof serializeDirectorCertificationReport;
  readonly deserializeDirectorCertificationReport: typeof deserializeDirectorCertificationReport;
  readonly getNexoraObjectDirectorIntegrationCertificationSummary: typeof getNexoraObjectDirectorIntegrationCertificationSummary;
  readonly createDirectorIntegrationFreezeManifest: typeof createDirectorIntegrationFreezeManifest;
  readonly projectDirectorFreeze: typeof projectDirectorFreeze;
  readonly verifyDirectorFreeze: typeof verifyDirectorFreeze;
  readonly compareDirectorFreeze: typeof compareDirectorFreeze;
  readonly getDirectorPublicApiRegistry: typeof getDirectorPublicApiRegistry;
  readonly validateDirectorFreeze: typeof validateDirectorFreeze;
  readonly assertDirectorFreezeInvariants: typeof assertDirectorFreezeInvariants;
  readonly serializeDirectorFreezeManifest: typeof serializeDirectorFreezeManifest;
  readonly deserializeDirectorFreezeManifest: typeof deserializeDirectorFreezeManifest;
  readonly serializeDirectorFreeze: typeof serializeDirectorFreeze;
  readonly deserializeDirectorFreeze: typeof deserializeDirectorFreeze;
  readonly getNexoraObjectDirectorIntegrationFreezeSummary: typeof getNexoraObjectDirectorIntegrationFreezeSummary;
  readonly NexoraObjectDirectorIntegrationFreeze: typeof NexoraObjectDirectorIntegrationFreeze;
}

export interface DirectorIntegrationValidationNamespace {
  readonly validateDirectorCertification: typeof validateDirectorCertification;
  readonly validateDirectorCertificationReport: typeof validateDirectorCertificationReport;
  readonly assertDirectorCertificationInvariants: typeof assertDirectorCertificationInvariants;
  readonly validateDirectorFreeze: typeof validateDirectorFreeze;
  readonly assertDirectorFreezeInvariants: typeof assertDirectorFreezeInvariants;
  readonly verifyDirectorFreeze: typeof verifyDirectorFreeze;
}

export interface DirectorIntegrationCertificationNamespace {
  readonly certificationIdentity: typeof directorIntegrationCertificationIdentity;
  readonly certificationVersion: typeof directorIntegrationCertificationVersion;
  readonly certificationSchemaVersion: typeof directorIntegrationCertificationSchemaVersion;
  readonly certifyDirectorIntegration: typeof certifyDirectorIntegration;
  readonly recertifyDirectorIntegration: typeof recertifyDirectorIntegration;
  readonly revokeDirectorCertification: typeof revokeDirectorCertification;
  readonly expireDirectorCertification: typeof expireDirectorCertification;
  readonly compareDirectorCertifications: typeof compareDirectorCertifications;
  readonly evaluateDirectorCertificationPolicy: typeof evaluateDirectorCertificationPolicy;
  readonly createDirectorCertificationStamp: typeof createDirectorCertificationStamp;
  readonly projectDirectorCertification: typeof projectDirectorCertification;
  readonly serializeDirectorCertification: typeof serializeDirectorCertification;
  readonly deserializeDirectorCertification: typeof deserializeDirectorCertification;
  readonly serializeDirectorCertificationReport: typeof serializeDirectorCertificationReport;
  readonly deserializeDirectorCertificationReport: typeof deserializeDirectorCertificationReport;
}

export interface DirectorIntegrationReleaseInformationNamespace {
  readonly releaseInformation: typeof directorIntegrationReleaseInformation;
  readonly freezeStatus: typeof directorIntegrationFreezeStatus;
  readonly platformStatus: typeof directorIntegrationReleaseInformation.platformStatus;
  readonly releaseChannel: typeof directorIntegrationReleaseInformation.releaseChannel;
  readonly consumerEntry: typeof directorIntegrationReleaseInformation.consumerEntry;
  readonly SoleConsumerEntryPoint: true;
  readonly ReadyForConsumer: true;
  readonly FreezeOnlyDependency: true;
  readonly StableAPI: true;
  readonly freezeManifest: typeof directorIntegrationFreezeManifest;
}

export interface DirectorIntegrationCompatibilityNamespace {
  readonly compatibility: typeof directorIntegrationCompatibility;
  readonly immutable: true;
}

export interface DirectorIntegrationRegistryNamespace {
  readonly registry: typeof directorIntegrationPublicApiRegistry;
  readonly publicApiCount: number;
  readonly exportedApiCount: number;
  readonly namespaceCount: 9;
  readonly releaseVersion: typeof directorIntegrationFreezeVersion;
  readonly compatibility: typeof directorIntegrationCompatibility;
  readonly getDirectorPublicApiRegistry: typeof getDirectorPublicApiRegistry;
}

export interface DirectorIntegrationConsumerInformationNamespace {
  readonly rules: typeof DIRECTOR_INTEGRATION_CONSUMER_RULES;
  readonly FreezeOnlyDependency: true;
  readonly SoleConsumerEntryPoint: true;
  readonly ReadyForConsumer: true;
  readonly StableAPI: true;
  readonly importPath: typeof DIRECTOR_INTEGRATION_CONSUMER_IMPORT_PATH;
  readonly freezeManifest: typeof directorIntegrationFreezeManifest;
}

export interface NexoraObjectDirectorIntegrationPublicIndex {
  readonly identity: DirectorIntegrationPublicIndexIdentityNamespace;
  readonly publicTypes: DirectorIntegrationPublicTypesNamespace;
  readonly publicApis: DirectorIntegrationPublicApisNamespace;
  readonly validation: DirectorIntegrationValidationNamespace;
  readonly certification: DirectorIntegrationCertificationNamespace;
  readonly releaseInformation: DirectorIntegrationReleaseInformationNamespace;
  readonly compatibility: DirectorIntegrationCompatibilityNamespace;
  readonly registry: DirectorIntegrationRegistryNamespace;
  readonly consumerInformation: DirectorIntegrationConsumerInformationNamespace;
}

export type DirectorIntegrationPublicIndexIssueCode =
  | "PUBLIC_INDEX_UPSTREAM"
  | "PUBLIC_INDEX_IDENTITY"
  | "PUBLIC_INDEX_NAMESPACE"
  | "PUBLIC_INDEX_REGISTRY"
  | "PUBLIC_INDEX_RELEASE"
  | "PUBLIC_INDEX_COMPATIBILITY"
  | "PUBLIC_INDEX_READINESS"
  | "PUBLIC_INDEX_CONSUMER_RULE"
  | "PUBLIC_INDEX_ALTERNATE_ENTRY"
  | "PUBLIC_INDEX_IMPORT"
  | "PUBLIC_INDEX_IMMUTABILITY";

export interface DirectorIntegrationPublicIndexIssue {
  readonly code: DirectorIntegrationPublicIndexIssueCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface DirectorIntegrationConsumerEntryResult {
  readonly ok: boolean;
  readonly errors: readonly DirectorIntegrationPublicIndexIssue[];
  readonly warnings: readonly DirectorIntegrationPublicIndexIssue[];
  readonly checkedAt: string;
}

export interface DirectorIntegrationConsumerEntryOptions {
  readonly upstream?: string;
  readonly registry?: readonly NexoraDirectorFrozenApiRegistryEntry[];
  readonly releaseInformation?: typeof directorIntegrationReleaseInformation;
  readonly compatibility?: NexoraDirectorCompatibility;
  readonly supportedConsumerEntries?: readonly string[];
  readonly imports?: readonly string[];
  readonly now?: () => string;
}

export interface DirectorIntegrationPublicIndexMetadataProjection {
  readonly identity: DirectorIntegrationPublicIndexIdentityNamespace;
  readonly status: typeof directorIntegrationPublicIndexStatus;
  readonly compatibility: NexoraDirectorCompatibility;
  readonly registryApiNames: readonly string[];
  readonly releaseInformation: DirectorIntegrationReleaseInformationNamespace;
  readonly namespaceSections: typeof DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS;
  readonly freezeManifest: NexoraDirectorIntegrationFreezeManifest;
  readonly consumerRules: typeof DIRECTOR_INTEGRATION_CONSUMER_RULES;
}

export class DirectorIntegrationPublicIndexException extends Error {
  readonly code: DirectorIntegrationPublicIndexIssueCode | "PUBLIC_INDEX_CORRUPTED";
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    issue: DirectorIntegrationPublicIndexIssue | {
      readonly code: "PUBLIC_INDEX_CORRUPTED";
      readonly message: string;
      readonly details?: Readonly<Record<string, unknown>>;
    },
  ) {
    super(issue.message);
    this.name = "DirectorIntegrationPublicIndexException";
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
  code: DirectorIntegrationPublicIndexIssueCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): DirectorIntegrationPublicIndexIssue {
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

function buildMetadataProjection(): DirectorIntegrationPublicIndexMetadataProjection {
  return deepFreeze({
    identity: nexoraObjectDirectorIntegrationPublicIndex.identity,
    status: directorIntegrationPublicIndexStatus,
    compatibility: directorIntegrationCompatibility,
    registryApiNames: Object.freeze(
      directorIntegrationRegistry.map((entry) => entry.apiName),
    ),
    releaseInformation: nexoraObjectDirectorIntegrationPublicIndex.releaseInformation,
    namespaceSections: DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS,
    freezeManifest: directorIntegrationFreezeManifest,
    consumerRules: DIRECTOR_INTEGRATION_CONSUMER_RULES,
  });
}

// ─── Namespace assembly ─────────────────────────────────────────────────────

const identityNamespace: DirectorIntegrationPublicIndexIdentityNamespace =
  deepFreeze({
    publicIndexIdentity: directorIntegrationPublicIndexIdentity,
    version: directorIntegrationPublicIndexVersion,
    schemaVersion: directorIntegrationPublicIndexSchemaVersion,
    freezeIdentity: directorIntegrationFreezeIdentity,
    certificationIdentity: directorIntegrationCertificationIdentity,
    upstreamIdentity: directorIntegrationFreezeIdentity,
    status: directorIntegrationPublicIndexStatus,
  });

const publicTypesNamespace: DirectorIntegrationPublicTypesNamespace = deepFreeze({
  typeNames: NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES,
  exportedTypeCount: NEXORA_DIRECTOR_FROZEN_PUBLIC_TYPES.length,
});

const publicApisNamespace: DirectorIntegrationPublicApisNamespace = deepFreeze({
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
  createDirectorIntegrationFreezeManifest,
  projectDirectorFreeze,
  verifyDirectorFreeze,
  compareDirectorFreeze,
  getDirectorPublicApiRegistry,
  validateDirectorFreeze,
  assertDirectorFreezeInvariants,
  serializeDirectorFreezeManifest,
  deserializeDirectorFreezeManifest,
  serializeDirectorFreeze,
  deserializeDirectorFreeze,
  getNexoraObjectDirectorIntegrationFreezeSummary,
  NexoraObjectDirectorIntegrationFreeze,
});

const validationNamespace: DirectorIntegrationValidationNamespace = deepFreeze({
  validateDirectorCertification,
  validateDirectorCertificationReport,
  assertDirectorCertificationInvariants,
  validateDirectorFreeze,
  assertDirectorFreezeInvariants,
  verifyDirectorFreeze,
});

const certificationNamespace: DirectorIntegrationCertificationNamespace =
  deepFreeze({
    certificationIdentity: directorIntegrationCertificationIdentity,
    certificationVersion: directorIntegrationCertificationVersion,
    certificationSchemaVersion: directorIntegrationCertificationSchemaVersion,
    certifyDirectorIntegration,
    recertifyDirectorIntegration,
    revokeDirectorCertification,
    expireDirectorCertification,
    compareDirectorCertifications,
    evaluateDirectorCertificationPolicy,
    createDirectorCertificationStamp,
    projectDirectorCertification,
    serializeDirectorCertification,
    deserializeDirectorCertification,
    serializeDirectorCertificationReport,
    deserializeDirectorCertificationReport,
  });

const releaseInformationNamespace: DirectorIntegrationReleaseInformationNamespace =
  deepFreeze({
    releaseInformation: directorIntegrationReleaseInformation,
    freezeStatus: directorIntegrationFreezeStatus,
    platformStatus: directorIntegrationReleaseInformation.platformStatus,
    releaseChannel: directorIntegrationReleaseInformation.releaseChannel,
    consumerEntry: directorIntegrationReleaseInformation.consumerEntry,
    SoleConsumerEntryPoint: true as const,
    ReadyForConsumer: true as const,
    FreezeOnlyDependency: true as const,
    StableAPI: true as const,
    freezeManifest: directorIntegrationFreezeManifest,
  });

const compatibilityNamespace: DirectorIntegrationCompatibilityNamespace =
  deepFreeze({
    compatibility: directorIntegrationCompatibility,
    immutable: true as const,
  });

const registryNamespace: DirectorIntegrationRegistryNamespace = deepFreeze({
  registry: directorIntegrationPublicApiRegistry,
  publicApiCount: directorIntegrationPublicApiRegistry.length,
  exportedApiCount: NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS.length,
  namespaceCount: 9 as const,
  releaseVersion: directorIntegrationFreezeVersion,
  compatibility: directorIntegrationCompatibility,
  getDirectorPublicApiRegistry,
});

const consumerInformationNamespace: DirectorIntegrationConsumerInformationNamespace =
  deepFreeze({
    rules: DIRECTOR_INTEGRATION_CONSUMER_RULES,
    FreezeOnlyDependency: true as const,
    SoleConsumerEntryPoint: true as const,
    ReadyForConsumer: true as const,
    StableAPI: true as const,
    importPath: DIRECTOR_INTEGRATION_CONSUMER_IMPORT_PATH,
    freezeManifest: directorIntegrationFreezeManifest,
  });

export const nexoraObjectDirectorIntegrationPublicIndex: NexoraObjectDirectorIntegrationPublicIndex =
  deepFreeze({
    identity: identityNamespace,
    publicTypes: publicTypesNamespace,
    publicApis: publicApisNamespace,
    validation: validationNamespace,
    certification: certificationNamespace,
    releaseInformation: releaseInformationNamespace,
    compatibility: compatibilityNamespace,
    registry: registryNamespace,
    consumerInformation: consumerInformationNamespace,
  });

// ─── Consumer verification ──────────────────────────────────────────────────

export function verifyDirectorIntegrationConsumerEntry(
  options: DirectorIntegrationConsumerEntryOptions = {},
): DirectorIntegrationConsumerEntryResult {
  const now = options.now ?? (() => new Date().toISOString());
  const errors: DirectorIntegrationPublicIndexIssue[] = [];
  const warnings: DirectorIntegrationPublicIndexIssue[] = [];

  const upstream =
    options.upstream ?? directorIntegrationPublicIndexUpstream;
  const registry = options.registry ?? directorIntegrationRegistry;
  const releaseInformation =
    options.releaseInformation ?? directorIntegrationReleaseInformation;
  const compatibility =
    options.compatibility ?? directorIntegrationCompatibility;

  if (upstream !== directorIntegrationFreezeIdentity) {
    errors.push(
      issue(
        "PUBLIC_INDEX_UPSTREAM",
        `Upstream must be Freeze-only (${directorIntegrationFreezeIdentity}).`,
        { upstream },
      ),
    );
  }

  if (
    BLOCKED_DIRECTOR_UPSTREAM_IDENTITIES.some(
      (blocked) => blocked === upstream,
    )
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_UPSTREAM",
        "Direct NOL-3:1–3:7 upstream imports are not supported for consumers.",
        { upstream },
      ),
    );
  }

  if (!isDeeplyFrozen(registry)) {
    errors.push(
      issue("PUBLIC_INDEX_REGISTRY", "Registry must be deeply immutable."),
    );
  }

  if (!isDeeplyFrozen(releaseInformation)) {
    errors.push(
      issue(
        "PUBLIC_INDEX_RELEASE",
        "Release metadata must be deeply immutable.",
      ),
    );
  }

  if (compatibility !== "BackwardCompatible") {
    errors.push(
      issue(
        "PUBLIC_INDEX_COMPATIBILITY",
        "Compatibility must be BackwardCompatible.",
        { compatibility },
      ),
    );
  }

  if (
    !releaseInformation.ReadyForConsumer ||
    !releaseInformation.StableAPI ||
    !releaseInformation.SoleConsumerEntryPoint ||
    !releaseInformation.FreezeOnlyDependency
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_RELEASE",
        "Release metadata flags must all be true.",
        { releaseInformation },
      ),
    );
  }

  if (
    releaseInformation.releaseChannel !== "Stable" ||
    releaseInformation.releaseStatus !== "Released" ||
    releaseInformation.consumerEntry !== "PublicIndex" ||
    releaseInformation.platformStatus !==
      "Released · Certified · Frozen · Stable · ReadyForConsumer"
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_RELEASE",
        "Release metadata values must match the locked Freeze release information.",
        { releaseInformation },
      ),
    );
  }

  const supported =
    options.supportedConsumerEntries ??
    Object.freeze([DIRECTOR_INTEGRATION_CONSUMER_IMPORT_PATH]);
  if (
    !supported.includes(DIRECTOR_INTEGRATION_CONSUMER_IMPORT_PATH)
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_ALTERNATE_ENTRY",
        "Supported consumer entries must include the Public Index import path.",
        { supportedConsumerEntries: supported },
      ),
    );
  }
  for (const entry of supported) {
    if (
      entry.includes("/director/nexoraObject") &&
      !entry.endsWith("DirectorIntegrationPublicIndex")
    ) {
      errors.push(
        issue(
          "PUBLIC_INDEX_ALTERNATE_ENTRY",
          "Alternate NOL-3 module import paths are not supported for consumers.",
          { entry },
        ),
      );
    }
  }

  if (options.imports) {
    for (const importPath of options.imports) {
      if (/from\s+"react/.test(importPath) || /from\s+["']three/.test(importPath)) {
        errors.push(
          issue(
            "PUBLIC_INDEX_IMPORT",
            "React and Three.js imports are not permitted for consumers.",
            { importPath },
          ),
        );
      }
      if (
        BLOCKED_DIRECTOR_UPSTREAM_IDENTITIES.some((blocked) =>
          importPath.includes(blocked),
        ) ||
        /nexoraObjectDirectorIntegration(Foundation|SceneBinding|SceneSynchronization|InteractionRouting|CameraFocus|ValidationIntegrityEngine|Certification)/.test(
          importPath,
        )
      ) {
        errors.push(
          issue(
            "PUBLIC_INDEX_UPSTREAM",
            "Direct NOL-3:1–3:7 module imports are not supported for consumers.",
            { importPath },
          ),
        );
      }
    }
  }

  const freezeVerification = verifyDirectorFreeze(
    directorIntegrationFreezeManifest,
    { checkedAt: now() },
  );
  if (!freezeVerification.ok) {
    errors.push(
      issue(
        "PUBLIC_INDEX_RELEASE",
        "Freeze manifest verification failed.",
        {
          errorCodes: freezeVerification.errors.map((error) => error.code),
        },
      ),
    );
  }

  return deepFreeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt: now(),
  });
}

export function validateDirectorIntegrationPublicIndex(): DirectorIntegrationConsumerEntryResult {
  const errors: DirectorIntegrationPublicIndexIssue[] = [];
  const warnings: DirectorIntegrationPublicIndexIssue[] = [];
  const checkedAt = new Date().toISOString();

  if (directorIntegrationNamespaceSectionCount !== 9) {
    errors.push(
      issue(
        "PUBLIC_INDEX_NAMESPACE",
        "Namespace must contain exactly nine sections.",
        { sectionCount: directorIntegrationNamespaceSectionCount },
      ),
    );
  }

  const expectedKeys = [
    "identity",
    "publicTypes",
    "publicApis",
    "validation",
    "certification",
    "releaseInformation",
    "compatibility",
    "registry",
    "consumerInformation",
  ] as const;
  const actualKeys = Object.keys(nexoraObjectDirectorIntegrationPublicIndex);
  if (
    actualKeys.length !== expectedKeys.length ||
    expectedKeys.some((key, index) => actualKeys[index] !== key)
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_NAMESPACE",
        "Public Index namespace key order is invalid.",
        { actualKeys, expectedKeys: [...expectedKeys] },
      ),
    );
  }

  if (
    [...DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS].join("|") !==
    [
      "Identity",
      "Public Types",
      "Public APIs",
      "Validation",
      "Certification",
      "Release Information",
      "Compatibility",
      "Registry",
      "Consumer Information",
    ].join("|")
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_NAMESPACE",
        "Namespace section labels are invalid.",
      ),
    );
  }

  if (!isDeeplyFrozen(nexoraObjectDirectorIntegrationPublicIndex)) {
    errors.push(
      issue(
        "PUBLIC_INDEX_IMMUTABILITY",
        "Public Index must be deeply immutable.",
      ),
    );
  }

  if (
    nexoraObjectDirectorIntegrationPublicIndex.identity.upstreamIdentity !==
    directorIntegrationFreezeIdentity
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_UPSTREAM",
        "Public Index upstream must be Freeze-only.",
      ),
    );
  }

  if (
    nexoraObjectDirectorIntegrationPublicIndex.compatibility.compatibility !==
    "BackwardCompatible"
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COMPATIBILITY",
        "Public Index compatibility must be BackwardCompatible.",
      ),
    );
  }

  if (
    nexoraObjectDirectorIntegrationPublicIndex.releaseInformation
      .SoleConsumerEntryPoint !== true ||
    nexoraObjectDirectorIntegrationPublicIndex.releaseInformation
      .ReadyForConsumer !== true ||
    nexoraObjectDirectorIntegrationPublicIndex.releaseInformation
      .FreezeOnlyDependency !== true ||
    nexoraObjectDirectorIntegrationPublicIndex.releaseInformation
      .StableAPI !== true
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_RELEASE",
        "Release information flags must match locked Freeze metadata.",
      ),
    );
  }

  if (
    nexoraObjectDirectorIntegrationPublicIndex.consumerInformation.rules
      .length !== 8
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_CONSUMER_RULE",
        "Consumer rules must contain exactly eight entries.",
        {
          ruleCount:
            nexoraObjectDirectorIntegrationPublicIndex.consumerInformation
              .rules.length,
        },
      ),
    );
  }

  if (
    nexoraObjectDirectorIntegrationPublicIndex.registry.publicApiCount !==
    getDirectorPublicApiRegistry().length
  ) {
    errors.push(
      issue(
        "PUBLIC_INDEX_REGISTRY",
        "Registry public API count must match Freeze registry length.",
      ),
    );
  }

  const consumerResult = verifyDirectorIntegrationConsumerEntry({ now: () => checkedAt });
  errors.push(...consumerResult.errors);
  warnings.push(...consumerResult.warnings);

  return deepFreeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt,
  });
}

export function assertDirectorIntegrationPublicIndexInvariants(): void {
  const result = validateDirectorIntegrationPublicIndex();
  if (!result.ok) {
    throw new DirectorIntegrationPublicIndexException(result.errors[0]!);
  }
}

export function serializeDirectorIntegrationPublicIndex(): string {
  assertDirectorIntegrationPublicIndexInvariants();
  const projection = buildMetadataProjection();
  return JSON.stringify({
    identity: directorIntegrationPublicIndexIdentity,
    version: directorIntegrationPublicIndexVersion,
    schemaVersion: directorIntegrationPublicIndexSchemaVersion,
    projection,
  });
}

export function deserializeDirectorIntegrationPublicIndex(
  json: string,
): DirectorIntegrationPublicIndexMetadataProjection {
  const parsed = JSON.parse(json) as {
    readonly identity?: string;
    readonly version?: string;
    readonly schemaVersion?: string;
    readonly projection?: DirectorIntegrationPublicIndexMetadataProjection;
  };

  if (parsed.schemaVersion !== directorIntegrationPublicIndexSchemaVersion) {
    throw new DirectorIntegrationPublicIndexException({
      code: "PUBLIC_INDEX_CORRUPTED",
      message: `Unsupported public index schema: ${String(parsed.schemaVersion)}`,
      details: { schemaVersion: parsed.schemaVersion },
    });
  }

  if (parsed.identity !== directorIntegrationPublicIndexIdentity) {
    throw new DirectorIntegrationPublicIndexException({
      code: "PUBLIC_INDEX_IDENTITY",
      message: "Serialized public index identity mismatch.",
      details: { identity: parsed.identity },
    });
  }

  if (parsed.version !== directorIntegrationPublicIndexVersion) {
    throw new DirectorIntegrationPublicIndexException({
      code: "PUBLIC_INDEX_CORRUPTED",
      message: "Serialized public index version mismatch.",
      details: { version: parsed.version },
    });
  }

  if (!parsed.projection) {
    throw new DirectorIntegrationPublicIndexException({
      code: "PUBLIC_INDEX_CORRUPTED",
      message: "Missing public index projection payload.",
    });
  }

  const restored = deepFreeze(parsed.projection);
  if (
    restored.compatibility !== "BackwardCompatible" ||
    restored.namespaceSections.length !== 9 ||
    restored.consumerRules.length !== 8
  ) {
    throw new DirectorIntegrationPublicIndexException({
      code: "PUBLIC_INDEX_CORRUPTED",
      message: "Restored public index projection failed integrity checks.",
    });
  }

  return restored;
}

export function getNexoraObjectDirectorIntegrationPublicIndexSummary() {
  return deepFreeze({
    identity: directorIntegrationPublicIndexIdentity,
    version: directorIntegrationPublicIndexVersion,
    schemaVersion: directorIntegrationPublicIndexSchemaVersion,
    upstream: directorIntegrationPublicIndexUpstream,
    namespaceSections: DIRECTOR_INTEGRATION_NAMESPACE_SECTIONS,
    sectionCount: directorIntegrationNamespaceSectionCount,
    status: directorIntegrationPublicIndexStatus,
    consumerRules: DIRECTOR_INTEGRATION_CONSUMER_RULES,
    publicApiCount: directorIntegrationPublicApiRegistry.length,
    exportCount: NEXORA_DIRECTOR_FROZEN_PUBLIC_EXPORTS.length,
    noBusinessLogic: true,
    noRendererLogic: true,
    noRuntimeLogic: true,
    noWorkspaceLogic: true,
    noTimelineLogic: true,
  });
}
