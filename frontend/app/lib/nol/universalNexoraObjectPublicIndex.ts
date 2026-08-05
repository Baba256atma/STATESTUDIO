/**
 * NOL-1:9 — Universal NexoraObject Public Index
 *
 * Sole supported consumer doorway into NOL-1.
 * Publishes the Freeze-locked platform surface — no new engine logic.
 *
 * Upstream: NOL-1:8 Universal NexoraObject Freeze only.
 * Identity: NOL-1:9/UniversalNexoraObjectPublicIndex
 */

import {
  NOL_CERTIFICATION_IDENTITY,
  NOL_CONTRACT_IDENTITY,
  NOL_FOUNDATION_IDENTITY,
  NOL_FREEZE_COMPATIBILITY_VERSION,
  NOL_FREEZE_IDENTITY,
  NOL_RELATIONSHIP_IDENTITY,
  NOL_RUNTIME_IDENTITY,
  NOL_STE_IDENTITY,
  NOL_VALIDATION_IDENTITY,
  NEXORA_FROZEN_PUBLIC_EXPORTS,
  applyNexoraObjectRuntimeCommand,
  applyNexoraObjectTransition,
  calculateIntegrityScore,
  certifyNexoraObject,
  createFreezeManifest,
  createNexoraObject,
  createNexoraObjectContract,
  createNexoraObjectGraph,
  createNexoraObjectState,
  createRelationship,
  deserializeFreezeManifest,
  evaluateNexoraObjectTransition,
  freezeNexoraObject,
  getFrozenApiBindings,
  getFrozenApiRegistry,
  getFrozenReleaseMetadata,
  getNexoraObjectRuntimeState,
  projectFreezeManifest,
  projectNexoraObjectForDirector,
  recertifyNexoraObject,
  revokeNexoraObjectCertification,
  serializeFreezeManifest,
  serializeNexoraObjectToJson,
  simulateImpactPropagation,
  validateNexoraObject,
  validateNexoraObjectContract,
  validateNexoraObjectRuntimeState,
  validateNexoraObjects,
  verifyFreezeCompatibility,
  type NexoraFreezeCompatibility,
  type NexoraFreezeProjection,
  type NexoraFreezeReleaseMetadata,
  type NexoraObjectFreezeManifest,
} from "./freeze/universalNexoraObjectFreeze.ts";

// ─── Public Index identity ──────────────────────────────────────────────────

export const universalNexoraObjectPublicIndexIdentity =
  "NOL-1:9/UniversalNexoraObjectPublicIndex" as const;

export const universalNexoraObjectPublicIndexNamespace =
  "nexora.nol.universal-object.public-index" as const;

export const universalNexoraObjectPublicIndexUpstream =
  "NOL-1:8/UniversalNexoraObjectFreeze" as const;

export const universalNexoraObjectPublicIndexLock =
  "NOL-1-UNIVERSAL-NEXORA-OBJECT-LOCKED" as const;

export const universalNexoraObjectPublicIndexVersion = "1.0.0" as const;

export const universalNexoraObjectPublicIndexStatus = Object.freeze({
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
} as const);

/** Compact aliases */
export const publicIndexIdentity = universalNexoraObjectPublicIndexIdentity;
export const publicIndexNamespace = universalNexoraObjectPublicIndexNamespace;
export const publicIndexUpstream = universalNexoraObjectPublicIndexUpstream;
export const publicIndexLock = universalNexoraObjectPublicIndexLock;
export const publicIndexStatus = universalNexoraObjectPublicIndexStatus;

// ─── Namespace section order (immutable public contract) ────────────────────

export const UNIVERSAL_NEXORA_OBJECT_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Release Information",
  "Object Contracts",
  "Object Runtime",
  "State & Transition",
  "Relationship & Dependency",
  "Validation & Certification",
  "Serialization & Projection",
  "Registry & Compatibility",
] as const);

export const universalNexoraObjectNamespaceSectionCount =
  UNIVERSAL_NEXORA_OBJECT_NAMESPACE_SECTIONS.length;

export const namespaceSectionCount = universalNexoraObjectNamespaceSectionCount;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UniversalNexoraObjectPublicApiEntry {
  readonly exportName: string;
  readonly apiIdentity: string;
  readonly owningModule: string;
  readonly stability: "Stable";
  readonly visibility: "Public";
}

export interface UniversalNexoraObjectIdentityNamespace {
  readonly publicIndexIdentity: typeof universalNexoraObjectPublicIndexIdentity;
  readonly namespace: typeof universalNexoraObjectPublicIndexNamespace;
  readonly lockIdentity: typeof universalNexoraObjectPublicIndexLock;
  readonly upstreamIdentity: typeof universalNexoraObjectPublicIndexUpstream;
  readonly moduleIdentity: typeof universalNexoraObjectPublicIndexIdentity;
  readonly freezeIdentity: typeof NOL_FREEZE_IDENTITY;
  readonly publicIndexVersion: typeof universalNexoraObjectPublicIndexVersion;
  readonly moduleVersion: typeof universalNexoraObjectPublicIndexVersion;
  readonly foundationIdentity: typeof NOL_FOUNDATION_IDENTITY;
  readonly contractIdentity: typeof NOL_CONTRACT_IDENTITY;
  readonly runtimeIdentity: typeof NOL_RUNTIME_IDENTITY;
  readonly stateIdentity: typeof NOL_STE_IDENTITY;
  readonly relationshipIdentity: typeof NOL_RELATIONSHIP_IDENTITY;
  readonly validationIdentity: typeof NOL_VALIDATION_IDENTITY;
  readonly certificationIdentity: typeof NOL_CERTIFICATION_IDENTITY;
}

export interface UniversalNexoraObjectReleaseNamespace {
  readonly releaseStages: NexoraFreezeReleaseMetadata["releaseStages"];
  readonly release: "Released";
  readonly certification: "Certified";
  readonly freeze: "Frozen";
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly releaseDate: string;
  readonly compatibility: NexoraFreezeCompatibility;
  readonly supportedPlatformVersion: string;
  readonly metadata: NexoraFreezeReleaseMetadata;
}

export interface UniversalNexoraObjectContractNamespace {
  readonly createNexoraObject: typeof createNexoraObject;
  readonly createNexoraObjectContract: typeof createNexoraObjectContract;
  readonly validateNexoraObjectContract: typeof validateNexoraObjectContract;
  readonly freezeNexoraObject: typeof freezeNexoraObject;
  readonly serializeNexoraObjectToJson: typeof serializeNexoraObjectToJson;
  readonly projectNexoraObjectForDirector: typeof projectNexoraObjectForDirector;
  readonly NOL_FOUNDATION_IDENTITY: typeof NOL_FOUNDATION_IDENTITY;
  readonly NOL_CONTRACT_IDENTITY: typeof NOL_CONTRACT_IDENTITY;
}

export interface UniversalNexoraObjectRuntimeNamespace {
  readonly applyNexoraObjectRuntimeCommand: typeof applyNexoraObjectRuntimeCommand;
  readonly getNexoraObjectRuntimeState: typeof getNexoraObjectRuntimeState;
  readonly validateNexoraObjectRuntimeState: typeof validateNexoraObjectRuntimeState;
  readonly NOL_RUNTIME_IDENTITY: typeof NOL_RUNTIME_IDENTITY;
}

export interface UniversalNexoraObjectStateNamespace {
  readonly createNexoraObjectState: typeof createNexoraObjectState;
  readonly evaluateNexoraObjectTransition: typeof evaluateNexoraObjectTransition;
  readonly applyNexoraObjectTransition: typeof applyNexoraObjectTransition;
  readonly NOL_STE_IDENTITY: typeof NOL_STE_IDENTITY;
}

export interface UniversalNexoraObjectRelationshipNamespace {
  readonly createNexoraObjectGraph: typeof createNexoraObjectGraph;
  readonly createRelationship: typeof createRelationship;
  readonly simulateImpactPropagation: typeof simulateImpactPropagation;
  readonly NOL_RELATIONSHIP_IDENTITY: typeof NOL_RELATIONSHIP_IDENTITY;
}

export interface UniversalNexoraObjectTrustNamespace {
  readonly validateNexoraObject: typeof validateNexoraObject;
  readonly validateNexoraObjects: typeof validateNexoraObjects;
  readonly calculateIntegrityScore: typeof calculateIntegrityScore;
  readonly NOL_VALIDATION_IDENTITY: typeof NOL_VALIDATION_IDENTITY;
  readonly certifyNexoraObject: typeof certifyNexoraObject;
  readonly recertifyNexoraObject: typeof recertifyNexoraObject;
  readonly revokeNexoraObjectCertification: typeof revokeNexoraObjectCertification;
  readonly NOL_CERTIFICATION_IDENTITY: typeof NOL_CERTIFICATION_IDENTITY;
}

export interface UniversalNexoraObjectSerializationNamespace {
  readonly serializeNexoraObjectToJson: typeof serializeNexoraObjectToJson;
  readonly projectNexoraObjectForDirector: typeof projectNexoraObjectForDirector;
  readonly serializeFreezeManifest: typeof serializeFreezeManifest;
  readonly deserializeFreezeManifest: typeof deserializeFreezeManifest;
  readonly projectFreezeManifest: typeof projectFreezeManifest;
}

export interface UniversalNexoraObjectRegistryNamespace {
  readonly frozenApiRegistry: ReturnType<typeof getFrozenApiRegistry>;
  readonly publicApiRegistry: readonly UniversalNexoraObjectPublicApiEntry[];
  readonly publicApiCount: number;
  readonly publicExportCount: number;
  readonly schemaVersions: NexoraObjectFreezeManifest["schemaVersions"];
  readonly dependencyVersions: NexoraObjectFreezeManifest["dependencyVersions"];
  readonly compatibilitySummary: NexoraFreezeProjection["compatibilitySummary"];
  readonly releaseMetadata: NexoraFreezeReleaseMetadata;
  readonly freezeProjection: NexoraFreezeProjection;
  readonly lockIdentity: typeof universalNexoraObjectPublicIndexLock;
  readonly consumerEntryVerification: UniversalNexoraObjectConsumerEntryResult;
}

export interface UniversalNexoraObjectPublicIndex {
  readonly identity: UniversalNexoraObjectIdentityNamespace;
  readonly releaseInformation: UniversalNexoraObjectReleaseNamespace;
  readonly objectContracts: UniversalNexoraObjectContractNamespace;
  readonly objectRuntime: UniversalNexoraObjectRuntimeNamespace;
  readonly stateTransition: UniversalNexoraObjectStateNamespace;
  readonly relationshipDependency: UniversalNexoraObjectRelationshipNamespace;
  readonly validationCertification: UniversalNexoraObjectTrustNamespace;
  readonly serializationProjection: UniversalNexoraObjectSerializationNamespace;
  readonly registryCompatibility: UniversalNexoraObjectRegistryNamespace;
}

export type UniversalNexoraObjectConsumerEntryIssue = {
  readonly code:
    | "PUBLIC_INDEX_UPSTREAM"
    | "PUBLIC_INDEX_IDENTITY"
    | "PUBLIC_INDEX_LOCK"
    | "PUBLIC_INDEX_NAMESPACE"
    | "PUBLIC_INDEX_REGISTRY"
    | "PUBLIC_INDEX_COMPATIBILITY"
    | "PUBLIC_INDEX_READINESS"
    | "PUBLIC_INDEX_COUNT"
    | "PUBLIC_INDEX_ALTERNATE_ENTRY";
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type UniversalNexoraObjectConsumerEntryResult = {
  readonly ok: boolean;
  readonly errors: readonly UniversalNexoraObjectConsumerEntryIssue[];
  readonly warnings: readonly UniversalNexoraObjectConsumerEntryIssue[];
  readonly checkedAt: string;
};

export type UniversalNexoraObjectConsumerEntryOptions = {
  readonly registry?: readonly UniversalNexoraObjectPublicApiEntry[];
  readonly compatibility?: NexoraFreezeCompatibility | string;
  readonly readiness?: string;
  readonly identity?: string;
  readonly lock?: string;
  readonly upstream?: string;
  readonly sectionCount?: number;
  readonly apiCount?: number;
  readonly exportCount?: number;
  readonly now?: () => string;
  /** Claimed supported consumer entry paths. Internal NOL paths must not appear. */
  readonly supportedConsumerEntries?: readonly string[];
};

// ─── Consumer rules (documentation + testable metadata) ─────────────────────

export const universalNexoraObjectConsumerRules = Object.freeze([
  "Import only the Public Index.",
  "Do not import Foundation directly.",
  "Do not import Contract directly.",
  "Do not import Runtime directly.",
  "Do not import State Transition directly.",
  "Do not import Relationship directly.",
  "Do not import Validation or Certification directly.",
  "Do not import Freeze directly.",
] as const);

export const publicConsumerRules = universalNexoraObjectConsumerRules;

// ─── Top-level export manifest (drift-protected) ────────────────────────────

export const UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS = Object.freeze([
  "universalNexoraObjectPublicIndexIdentity",
  "universalNexoraObjectPublicIndexNamespace",
  "universalNexoraObjectPublicIndexStatus",
  "universalNexoraObjectPublicIndexUpstream",
  "universalNexoraObjectPublicIndexLock",
  "universalNexoraObjectPublicApiRegistry",
  "universalNexoraObjectPublicApiCount",
  "universalNexoraObjectPublicExportCount",
  "universalNexoraObjectNamespaceSectionCount",
  "publicReleaseMetadata",
  "publicCompatibility",
  "universalNexoraObjectPublicIndex",
  "verifyUniversalNexoraObjectConsumerEntry",
  "universalNexoraObjectConsumerRules",
  "publicIndexIdentity",
  "publicIndexNamespace",
  "publicIndexStatus",
  "publicIndexUpstream",
  "publicIndexLock",
  "publicApiRegistry",
  "publicApiCount",
  "publicExportCount",
  "namespaceSectionCount",
  "UNIVERSAL_NEXORA_OBJECT_NAMESPACE_SECTIONS",
  "UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Object.isFrozen(value)) {
    // Still freeze nested plain objects/arrays that may not be frozen.
    if (Array.isArray(value)) {
      for (const item of value) deepFreeze(item);
    } else {
      for (const key of Object.keys(value as object)) {
        deepFreeze((value as Record<string, unknown>)[key]);
      }
    }
    return value;
  }
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.freeze(value);
}

function issue(
  code: UniversalNexoraObjectConsumerEntryIssue["code"],
  message: string,
  details?: Readonly<Record<string, unknown>>,
): UniversalNexoraObjectConsumerEntryIssue {
  return Object.freeze({ code, message, details });
}

function buildPublicApiRegistry(): readonly UniversalNexoraObjectPublicApiEntry[] {
  return Object.freeze(
    getFrozenApiRegistry().map((entry) =>
      Object.freeze({
        exportName: entry.apiName,
        apiIdentity: `${entry.identity}#${entry.apiName}`,
        owningModule: entry.owningModule,
        stability: "Stable" as const,
        visibility: "Public" as const,
      }),
    ),
  );
}

// ─── Derived public registry / counts ───────────────────────────────────────

export const universalNexoraObjectPublicApiRegistry = buildPublicApiRegistry();

export const universalNexoraObjectPublicApiCount =
  universalNexoraObjectPublicApiRegistry.length;

export const universalNexoraObjectPublicExportCount =
  UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS.length;

export const publicApiRegistry = universalNexoraObjectPublicApiRegistry;
export const publicApiCount = universalNexoraObjectPublicApiCount;
export const publicExportCount = universalNexoraObjectPublicExportCount;

const RELEASE_DATE = "2026-08-04T00:00:00.000Z";

export const publicReleaseMetadata = getFrozenReleaseMetadata(RELEASE_DATE);

export const publicCompatibility = Object.freeze({
  compatibility: "BackwardCompatible" as const,
  compatibilityVersion: NOL_FREEZE_COMPATIBILITY_VERSION,
  readyForConsumer: true as const,
});

// ─── Consumer-entry verification ────────────────────────────────────────────

export function verifyUniversalNexoraObjectConsumerEntry(
  options: UniversalNexoraObjectConsumerEntryOptions = {},
): UniversalNexoraObjectConsumerEntryResult {
  const now = options.now ?? (() => new Date().toISOString());
  const errors: UniversalNexoraObjectConsumerEntryIssue[] = [];
  const warnings: UniversalNexoraObjectConsumerEntryIssue[] = [];

  const identity = options.identity ?? universalNexoraObjectPublicIndexIdentity;
  const lock = options.lock ?? universalNexoraObjectPublicIndexLock;
  const upstream = options.upstream ?? universalNexoraObjectPublicIndexUpstream;
  const registry = options.registry ?? universalNexoraObjectPublicApiRegistry;
  const compatibility =
    options.compatibility ?? publicCompatibility.compatibility;
  const readiness =
    options.readiness ?? universalNexoraObjectPublicIndexStatus.readiness;
  const sectionCount =
    options.sectionCount ?? universalNexoraObjectNamespaceSectionCount;
  const apiCount = options.apiCount ?? registry.length;
  const exportCount =
    options.exportCount ?? universalNexoraObjectPublicExportCount;

  if (upstream !== NOL_FREEZE_IDENTITY) {
    errors.push(
      issue(
        "PUBLIC_INDEX_UPSTREAM",
        `Upstream must be Freeze-only (${NOL_FREEZE_IDENTITY}).`,
        { upstream },
      ),
    );
  }

  if (identity !== "NOL-1:9/UniversalNexoraObjectPublicIndex") {
    errors.push(
      issue(
        "PUBLIC_INDEX_IDENTITY",
        "Public Index identity mismatch.",
        { identity },
      ),
    );
  }

  if (lock !== "NOL-1-UNIVERSAL-NEXORA-OBJECT-LOCKED") {
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

  const exportNames = new Set<string>();
  const apiIdentities = new Set<string>();
  for (const entry of registry) {
    if (exportNames.has(entry.exportName)) {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Duplicate export name: ${entry.exportName}`,
          { exportName: entry.exportName },
        ),
      );
    }
    exportNames.add(entry.exportName);

    if (apiIdentities.has(entry.apiIdentity)) {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Duplicate API identity: ${entry.apiIdentity}`,
          { apiIdentity: entry.apiIdentity },
        ),
      );
    }
    apiIdentities.add(entry.apiIdentity);

    if (entry.stability !== "Stable" || entry.visibility !== "Public") {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Registry entry must be Stable/Public: ${entry.exportName}`,
          { entry },
        ),
      );
    }
  }

  // Registry must derive from Freeze — every exportName must exist there.
  const frozenNames = new Set(getFrozenApiRegistry().map((e) => e.apiName));
  for (const entry of registry) {
    if (!frozenNames.has(entry.exportName)) {
      errors.push(
        issue(
          "PUBLIC_INDEX_REGISTRY",
          `Registry entry is not present in Freeze: ${entry.exportName}`,
          { exportName: entry.exportName },
        ),
      );
    }
  }

  if (compatibility !== "BackwardCompatible") {
    errors.push(
      issue(
        "PUBLIC_INDEX_COMPATIBILITY",
        `Unsupported compatibility: ${String(compatibility)}`,
        { compatibility },
      ),
    );
  }

  const freezeCompat = verifyFreezeCompatibility(
    createFreezeManifest(RELEASE_DATE),
    now,
  );
  if (!freezeCompat.ok) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COMPATIBILITY",
        "Freeze compatibility verification failed.",
        { freezeErrors: freezeCompat.errors },
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

  if (apiCount !== registry.length) {
    errors.push(
      issue("PUBLIC_INDEX_COUNT", "API count does not match registry length.", {
        apiCount,
        registryLength: registry.length,
      }),
    );
  }

  if (exportCount !== UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS.length) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COUNT",
        "Export count does not match public export manifest.",
        {
          exportCount,
          expected: UNIVERSAL_NEXORA_OBJECT_PUBLIC_EXPORTS.length,
        },
      ),
    );
  }

  // Freeze public export surface must remain available for registry derivation.
  if (NEXORA_FROZEN_PUBLIC_EXPORTS.length < getFrozenApiRegistry().length) {
    errors.push(
      issue(
        "PUBLIC_INDEX_COUNT",
        "Freeze public export count is smaller than API registry.",
      ),
    );
  }

  const supportedEntries = options.supportedConsumerEntries ?? [
    "nol/universalNexoraObjectPublicIndex",
  ];
  const forbiddenEntryTokens = Object.freeze([
    "nol/foundation",
    "nol/contract",
    "nol/runtime",
    "nol/state",
    "nol/relationship",
    "nol/validation",
    "nol/certification",
    "nol/freeze",
  ] as const);
  for (const entry of supportedEntries) {
    if (
      forbiddenEntryTokens.some((token) => entry.includes(token))
    ) {
      errors.push(
        issue(
          "PUBLIC_INDEX_ALTERNATE_ENTRY",
          `Internal NOL module presented as consumer entry: ${entry}`,
          { entry },
        ),
      );
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt: now(),
  });
}

// ─── Build immutable public index ───────────────────────────────────────────

function buildPublicIndex(): UniversalNexoraObjectPublicIndex {
  const freezeProjection = projectFreezeManifest(RELEASE_DATE);
  const releaseMetadata = getFrozenReleaseMetadata(RELEASE_DATE);
  const manifest = createFreezeManifest(RELEASE_DATE);
  const bindings = getFrozenApiBindings();

  // Ensure every registry API has a live binding from Freeze.
  for (const entry of getFrozenApiRegistry()) {
    if (!(entry.apiName in bindings)) {
      throw new Error(
        `Missing frozen API binding for registry entry: ${entry.apiName}`,
      );
    }
  }

  const consumerEntryVerification = verifyUniversalNexoraObjectConsumerEntry({
    now: () => RELEASE_DATE,
  });

  const identity: UniversalNexoraObjectIdentityNamespace = Object.freeze({
    publicIndexIdentity: universalNexoraObjectPublicIndexIdentity,
    namespace: universalNexoraObjectPublicIndexNamespace,
    lockIdentity: universalNexoraObjectPublicIndexLock,
    upstreamIdentity: universalNexoraObjectPublicIndexUpstream,
    moduleIdentity: universalNexoraObjectPublicIndexIdentity,
    freezeIdentity: NOL_FREEZE_IDENTITY,
    publicIndexVersion: universalNexoraObjectPublicIndexVersion,
    moduleVersion: universalNexoraObjectPublicIndexVersion,
    foundationIdentity: NOL_FOUNDATION_IDENTITY,
    contractIdentity: NOL_CONTRACT_IDENTITY,
    runtimeIdentity: NOL_RUNTIME_IDENTITY,
    stateIdentity: NOL_STE_IDENTITY,
    relationshipIdentity: NOL_RELATIONSHIP_IDENTITY,
    validationIdentity: NOL_VALIDATION_IDENTITY,
    certificationIdentity: NOL_CERTIFICATION_IDENTITY,
  });

  const releaseInformation: UniversalNexoraObjectReleaseNamespace =
    Object.freeze({
      releaseStages: releaseMetadata.releaseStages,
      release: "Released" as const,
      certification: "Certified" as const,
      freeze: "Frozen" as const,
      stability: "Stable" as const,
      readiness: "ReadyForConsumer" as const,
      releaseDate: releaseMetadata.releaseDate,
      compatibility: releaseMetadata.compatibility,
      supportedPlatformVersion: releaseMetadata.supportedPlatformVersion,
      metadata: releaseMetadata,
    });

  const objectContracts: UniversalNexoraObjectContractNamespace = Object.freeze({
    createNexoraObject,
    createNexoraObjectContract,
    validateNexoraObjectContract,
    freezeNexoraObject,
    serializeNexoraObjectToJson,
    projectNexoraObjectForDirector,
    NOL_FOUNDATION_IDENTITY,
    NOL_CONTRACT_IDENTITY,
  });

  const objectRuntime: UniversalNexoraObjectRuntimeNamespace = Object.freeze({
    applyNexoraObjectRuntimeCommand,
    getNexoraObjectRuntimeState,
    validateNexoraObjectRuntimeState,
    NOL_RUNTIME_IDENTITY,
  });

  const stateTransition: UniversalNexoraObjectStateNamespace = Object.freeze({
    createNexoraObjectState,
    evaluateNexoraObjectTransition,
    applyNexoraObjectTransition,
    NOL_STE_IDENTITY,
  });

  const relationshipDependency: UniversalNexoraObjectRelationshipNamespace =
    Object.freeze({
      createNexoraObjectGraph,
      createRelationship,
      simulateImpactPropagation,
      NOL_RELATIONSHIP_IDENTITY,
    });

  const validationCertification: UniversalNexoraObjectTrustNamespace =
    Object.freeze({
      validateNexoraObject,
      validateNexoraObjects,
      calculateIntegrityScore,
      NOL_VALIDATION_IDENTITY,
      certifyNexoraObject,
      recertifyNexoraObject,
      revokeNexoraObjectCertification,
      NOL_CERTIFICATION_IDENTITY,
    });

  const serializationProjection: UniversalNexoraObjectSerializationNamespace =
    Object.freeze({
      serializeNexoraObjectToJson,
      projectNexoraObjectForDirector,
      serializeFreezeManifest,
      deserializeFreezeManifest,
      projectFreezeManifest,
    });

  const registryCompatibility: UniversalNexoraObjectRegistryNamespace =
    Object.freeze({
      frozenApiRegistry: getFrozenApiRegistry(),
      publicApiRegistry: universalNexoraObjectPublicApiRegistry,
      publicApiCount: universalNexoraObjectPublicApiCount,
      publicExportCount: universalNexoraObjectPublicExportCount,
      schemaVersions: manifest.schemaVersions,
      dependencyVersions: manifest.dependencyVersions,
      compatibilitySummary: freezeProjection.compatibilitySummary,
      releaseMetadata,
      freezeProjection,
      lockIdentity: universalNexoraObjectPublicIndexLock,
      consumerEntryVerification,
    });

  return deepFreeze({
    identity,
    releaseInformation,
    objectContracts,
    objectRuntime,
    stateTransition,
    relationshipDependency,
    validationCertification,
    serializationProjection,
    registryCompatibility,
  });
}

export const universalNexoraObjectPublicIndex: UniversalNexoraObjectPublicIndex =
  buildPublicIndex();

// ─── Type-only publication (via Freeze; no direct NOL-1:1–1:7 imports) ──────

export type {
  AnyNexoraObject,
  CreateNexoraObjectInput,
  MutableNexoraObject,
  NexoraCertificationEvent,
  NexoraCertificationProfile,
  NexoraCertificationRecord,
  NexoraCertificationRequest,
  NexoraCertificationResult,
  NexoraCertificationStamp,
  NexoraCertificationState,
  NexoraFreezeCompatibility,
  NexoraFreezeProjection,
  NexoraFreezeReleaseMetadata,
  NexoraGraphEdge,
  NexoraGraphImpactResult,
  NexoraGraphPath,
  NexoraGraphProjection,
  NexoraGraphTraversalOptions,
  NexoraObject,
  NexoraObjectContract,
  NexoraObjectFreezeManifest,
  NexoraObjectGraph,
  NexoraObjectIdentity,
  NexoraObjectLifecycle,
  NexoraObjectRuntimeCommand,
  NexoraObjectRuntimeCommandContext,
  NexoraObjectRuntimeError,
  NexoraObjectRuntimeEvent,
  NexoraObjectRuntimeState,
  NexoraObjectRuntimeTransitionResult,
  NexoraObjectState,
  NexoraObjectStatus,
  NexoraObjectTransitionError,
  NexoraObjectTransitionEvent,
  NexoraObjectTransitionPlan,
  NexoraObjectTransitionRequest,
  NexoraObjectTransitionResult,
  NexoraObjectTransitionWarning,
  NexoraObjectType,
  NexoraObjectValidationRequest,
  NexoraObjectValidationResult,
  NexoraObjectVisualizationState,
  NexoraValidationError,
  NexoraValidationLevel,
  NexoraValidationRepairSuggestion,
  NexoraValidationReport,
  ReadonlyNexoraObject,
} from "./freeze/universalNexoraObjectFreeze.ts";
